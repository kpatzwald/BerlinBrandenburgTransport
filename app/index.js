import * as messaging from "messaging";
import { VBBUI } from "./ui.js";

let ui = new VBBUI();

ui.updateUI("disconnected");

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  ui.updateUI("loading");
  messaging.peerSocket.send("Hi!");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  //console.log("index.js:onmessage: " + typeof(evt.data));
  if (evt.data == "error_no_fav_station") {
    ui.updateUI("error_no_fav_station");
  } else {
    ui.updateUI("loaded", evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  ui.updateUI("error");
}
