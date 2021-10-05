import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { BVGAPI } from "./bvg.js"
import { TRAIN_COUNT, FAVORITE_STATION_SETTING } from "../common/globals.js";

settingsStorage.onchange = function(evt) {
  sendBBTSchedule();
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  sendBBTSchedule();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log(JSON.stringify(evt.data));
}

function sendBBTSchedule() {
  let station = settingsStorage.getItem(FAVORITE_STATION_SETTING);
  console.log("Station: " + station);
  if (station) {
    try {
      station = JSON.parse(station);
      console.log("Station 1: " + station[0].name);
      //console.log("Station 2: " + station[1].name);
      console.log("sendBBTSchedule(): parseSettings: " + station);
    }
    catch (e) {
      console.log("sendBBTSchedule(): Error parsing setting value: " + e);
    }
  }
 
  if (!station || typeof(station) !== "object" || station.length < 1 || typeof(station[0]) !== "object") {
    station = { code: "embr", direction: "s" };
    console.log("sendBBTSchedule(): Loading default value");
  }
  else {
    station = station[0].name;
    //console.log("Test");
  }
  let bvgApi = new BVGAPI();
  bvgApi.realTimeDepartures(station).then(function(departures) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Limit results to the number of tiles available in firmware
      departures.splice(TRAIN_COUNT, departures.length);
      messaging.peerSocket.send(departures);
    }
  }).catch(function (e) {
    console.log("Error in index.js->sendBartSchedule()"); console.log(e)
  });
}
