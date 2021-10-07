import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { BVGAPI } from "./bvg.js"
import { TRAIN_COUNT, FAVORITE_STATION_SETTING } from "../common/globals.js";

settingsStorage.onchange = function (evt) {
  sendBBTSchedule();
}

// Listen for the onopen event
messaging.peerSocket.onopen = function () {
  // Ready to send or receive messages
  sendBBTSchedule();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function (evt) {
  // Output the message to the console
  console.log("index.js:onmessage(): " + JSON.stringify(evt.data));
}

function sendBBTSchedule() {
  let station = settingsStorage.getItem(FAVORITE_STATION_SETTING);
  let station_id;
  //console.log("Station: " + station);
  if (station) {
    try {
      station = JSON.parse(station);
      console.log("Station 1: " + station[0].name + " ID: " + station[0].id);
      //console.log("Station 2: " + station[1].name);
      console.log("index.js:sendBBTSchedule(): parseSettings: " + station);
    }
    catch (e) {
      console.log("index.js:sendBBTSchedule(): Error parsing setting value: " + e);
    }
  }

  if (!station || typeof (station) !== "object" || station.length < 1 || typeof (station[0]) !== "object") {
    //station = { code: "embr", direction: "s" };
    console.log("index.js:sendBBTSchedule(): Loading default value");
    // Macht eigentlich keinen Sinn. Hinweis, dass kein Favorit angelegt wurde.
    station_id = -1;
    messaging.peerSocket.send("error_no_fav_station");
  } else {
    station_id = station[0].id;
    //console.log("Test");
    let bvgApi = new BVGAPI();
    bvgApi.realTimeDepartures(station_id).then(function (departures) {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        // Limit results to the number of tiles available in firmware
        departures.splice(TRAIN_COUNT, departures.length);
        messaging.peerSocket.send(departures);
      }
    }).catch(function (e) {
      console.log("index.js:sendBartSchedule(): Error: " + e);
    });
  }
}
