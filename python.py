import flask
import json
import traceback


app = flask.Flask(__name__)

@app.route('/api/echo', methods=['POST'])
def echo():
    try:
        data = flask.request.get_json()
        print(data)
        if 'name' not in data or 'age' not in data:
            return flask.jsonify("Bad Request"), 400
 
        dataName = data['name']
        dataAge = data['age']
        print(len(dataName))
        if(len(dataName) > 32):
            return flask.jsonify("Bad Request"), 400


        if not data:
            return flask.jsonify({"error": "No JSON data provided"}), 400
        return flask.jsonify(data), 200
    except Exception as e:
        traceback.print_exc()
        return flask.jsonify({"error": str(e)}), 500
    

    
if __name__ == '__main__':
    app.run(debug=True)