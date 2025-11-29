import os
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV") or "dev"

app = Flask(__name__)
CORS(app)

if ENV == "prd":
    GEONAMES_USERNAME = os.getenv("GEONAMES_USERNAME")
    TIMEZONE_DB_API_KEY = os.getenv("TIMEZONE_DB_API_KEY")

# TBD: Error handling for development
@app.route("/api/search", methods=["GET"])
def search_city():
    query = request.args.get("query", "")
    if len(query) < 2:
        return jsonify({})
    if ENV == "prd":
        url = f"http://api.geonames.org/searchJSON?name_startsWith={query}&featureClass=P&maxRows=5&username={GEONAMES_USERNAME}"
        result = requests.get(url)
        response = {}
        for data in result.json()["geonames"]:
            key = data["name"] + ", " + data["countryName"]
            if key in response:
                continue
            response[key] = {
                "lat": float(data["lat"]),
                "lng": float(data["lng"])
            }
        return jsonify(response)
    else:
        if query.lower().startswith("to"):
            return jsonify({
                "Tokyo, Japan": {
                    "lat": 35.6895,
                    "lng": 139.19171,
                },
                "Tokyojito-ri, South Korea": {
                    "lat": 34.23806,
                    "lng": 125.93944,
                },
            })
        elif query.lower().startswith("lo"):
            return jsonify({
                "London, United Kingdom": {
                    "lat": 51.50853,
                    "lng": -0.12574,
                },
                "London, Canada": {
                    "lat": 42.98339,
                    "lng": -81.23304,
                },
            })
        else:
            raise ValueError("Geonames API")

# TBD: Error handling for development
@app.route("/api/offset", methods=["GET"])
def get_timezone():
    lat = float(request.args.get("lat", '0'))
    lng = float(request.args.get("lng", '0'))

    if ENV == "prd":
        url = f"http://api.timezonedb.com/v2.1/get-time-zone?key={TIMEZONE_DB_API_KEY}&format=json&by=position&lat={lat}&lng={lng}"
        result = requests.get(url)
        data = result.json()
        return jsonify({
            "offset": data["gmtOffset"],
            "timezone": data["zoneName"],
        })
    else:
        if 35 < lat < 36 and 139 < lng < 140:
            return jsonify({
                "offset": 32400,
                "timezone": "Asia/Tokyo",
            })
        elif 34 < lat < 35 and 125 < lng < 126:
            return jsonify({
                "offset": 32400,
                "timezone": "Asia/Tokyo",
            })
        elif 51 < lat < 52 and -1 < lng < 0:
            return jsonify({
                "offset": 3600,
                "timezone": "Europe/London",
            })
        elif 42 < lat < 43 and -82 < lng < -81:
            return jsonify({
                "offset": -14400,
                "timezone": "America/Toronto",
            })
        else:
            raise ValueError("TimeZoneDB API")

if __name__ == "__main__":
    app.run(debug=True, port=8000)