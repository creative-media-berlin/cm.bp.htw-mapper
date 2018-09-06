"""Web server which handles incoming requests to scrape room occupation from LSF"""

import re
from flask import Flask, request, jsonify
import room_occupied
APP = Flask(__name__)

@APP.route('/')
def get_room_occupation():
    """Parse room from query params and look up its occupation."""
    room = request.args.get('room')
    if room:
        room_args = re.split('([0-9]+)', room)
        room_args = [arg for arg in room_args if arg != '']
        if len(room_args) == 2:
            try:
                occupied = room_occupied.main(room_args)
                return jsonify(occupied=occupied)
            except KeyError:
                message = 'Room {0} has no occupation data or does not exist.'.format(room)
                return jsonify(error=message), 400
        return jsonify(error='Wrong room format. Room must have format C355.'), 400
    return jsonify(error='Please provide a room in the query parameters.'), 400

if __name__ == '__main__':
    APP.run(debug=True, use_reloader=True)
