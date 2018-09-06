""" Module that takes a room number as input and checks for its availability """

import sys
import datetime
from icalendar import Calendar
from bs4 import BeautifulSoup
import requests
import re
from dateutil import rrule
import json

def main(args):
    """main class, gets calendar, takes arguments and passes them on

    args[1] is the building A,B,C,D,E,F,G,H
    args[2] is the room number

    """
    building = args[0].upper()
    room_nr = args[1]
    now = datetime.datetime.now()
    room_id = get_room_id(building+' '+room_nr)
    cal = get_calendar(room_id, now)
    return is_occupied(now, cal)

def get_room_id(room_nr):
    with open('room_ids.json') as json_data:
        room_dict = json.load(json_data)
        return room_dict[room_nr]

def get_calendar(room_id, now):
    """ Scrapes the HTW roomplan to get the ical
    for the specific room for a specific week

    :param room_nr: An int, specified as commandline arguments
    :param now: A Datetime, the current date
    """
    week = now.date().isocalendar()[1]
    year = now.date().isocalendar()[0]
    url = "https://lsf.htw-berlin.de/qisserver/rds?state=wplan&raum.rgid={}&week={}_{}&act=Raum&pool=Raum&show=plan&P.vx=kurz&P.subc=plan".format(room_id, week, year)
    room_plan = requests.get(url)
    soup = BeautifulSoup(room_plan.text, "html.parser")
    ical_link = soup.select_one("a[href*=iCalendarPlan]")
    if ical_link is not None:
        ical_link = ical_link['href'].encode('ASCII', 'ignore')
        return Calendar.from_ical(requests.get(ical_link).text)
    raise KeyError

def create_rrule(rule):
    """parses a rule and creates an rrule out of it

    :param rule: A vRecur, the rule of the calendar event
    """
    weekdays = {'MO': rrule.MO, 'TU': rrule.TU, 'WE': rrule.WE,
                'TH': rrule.TH, 'FR': rrule.FR}
    freqs = {'YEARLY': rrule.YEARLY, 'MONTHLY': rrule.MONTHLY,
             'WEEKLY': rrule.WEEKLY, 'DAILY': rrule.DAILY}
    _freq = str(rule.get('FREQ')[0])
    freq = freqs[_freq]
    until = rule.get('UNTIL')[0].replace(tzinfo=None)
    byday = rule.get('BYDAY')
    byweekday = []
    for day in byday:
        byweekday.append(weekdays[day])
    return rrule.rrule(freq=freq, until=until, interval=1, byweekday=byweekday)


def is_occupied(now, cal):
    """iterates through the calendar events and
    checks if the room is occupied at the current time

    :param now: A Datetime, the current date
    :param cal: A Calendar, from the roomplan website with the current week
    """
    for component in cal.walk('VEVENT'):
        start = component.get('DTSTART').dt
        end = component.get('DTEND').dt

        if component.get('RRULE') is not None:
            rule = create_rrule(component.get('RRULE'))

            for date in rule:
                if now.date() == date.date():
                    if start.time() <= now.time() <= end.time():
                        return True

        elif component.get('CATEGORIES') == 'Einzelbuchung':
            if now.date() == start.date():
                if start.time() <= now.time() <= end.time():
                    return True


    return False

if __name__ == "__main__":
    main(sys.argv[1:])
