# -*- coding: iso-8859-15 -*-
import re
import json
import requests
from bs4 import BeautifulSoup

url = "https://lsf.htw-berlin.de/qisserver/rds?state=change&type=6&moduleParameter=raumSelect&nextdir=change&next=SearchSelect.vm&target=raumSearch&subdir=raum&init=y&source=state%3Dchange%26type%3D5%26moduleParameter%3DraumSearch%26nextdir%3Dchange%26next%3Dsearch.vm%26subdir%3Draum%26_form%3Ddisplay%26topitem%3Dfacilities%26subitem%3Dsearch%26function%3Dnologgedin%26field%3Ddtxt&targetfield=dtxt&_form=display"
r = requests.get(url)
soup = BeautifulSoup(r.text, "html.parser")

rooms = soup.find_all("a", attrs={"name": "W"})
room_dict = {}
regex_anchor = re.compile('{}(.*){}'.format(re.escape('rgid='), re.escape('&idcol')))
regex_text = re.compile('{}(.*){}'.format(re.escape('ude '), re.escape(' -')))
for room in rooms:
    anchor = room['href']
    text = room.text.strip()
    room_id = regex_anchor.findall(anchor)
    if room_id:
        room_id = room_id[0]
        room_number = regex_text.findall(text)
        if room_number:
            room_number = room_number[0]
            room_dict[room_number]=room_id


with open('room_ids.json', 'w') as fp:
    json.dump(room_dict, fp, sort_keys=True, indent=4)
