import { TRAIN_COUNT, STATIONS } from "../common/globals.js";
import document from "document";
import { gettext } from "i18n";

export function BVGUI() {
  // TODO Funktioniert nicht: Es werden zu viele Tiles generiert, nicht in Abhängigkeit der Suche
  this.trainList = document.getElementById("trainList");
  this.statusText = document.getElementById("status");

  this.tiles = [];
  for (let i = 0; i < TRAIN_COUNT; i++) {
    let tile = document.getElementById(`train-${i}`);
    if (tile) {
      this.tiles.push(tile);
    }
  }
}

BVGUI.prototype.updateUI = function(state, departures) {
  if (state === "loaded") {
    this.trainList.style.display = "inline";
    this.statusText.text = "";

    this.updateDepartureList(departures);
  }
  else {
    this.trainList.style.display = "none";

    if (state === "loading") {
      this.statusText.text = gettext("loading");
    }
    else if (state === "disconnected") {
      this.statusText.text = gettext("disconnected");
    }
    else if (state === "error") {
      this.statusText.text = gettext("error");
    }
  }
}

BVGUI.prototype.updateDepartureList = function(departures) {

  let station = document.getElementById("station");
  station.text = departures[0].station;

  for (let i = 0; i < departures.length; i++) {
    let tile = this.tiles[i];
    if (!tile) {
      continue;
    }

    const train = departures[i];
  
    if (!train) {
      tile.style.display = "none";
      continue;
    }

    tile.style.display = "inline";
    //train.line = train.line.toLowerCase();
    // if (train.name in STATIONS) {
    //   tile.getElementById("name").text = STATIONS[train.line];
    // }
    // else {
    tile.getElementById("name").text = train.name + "-->" + train.direction;
    //}
    let depTime = new Date(train.when);
    //date.parse(train.when)
    tile.getElementById("when").text = depTime.getHours() + ":" + depTime.getMinutes();
    tile.getElementById("delay").text = "Delay: " + train.delay + "s"; //TODO i18n
    //tile.getElementById("minutes").text = train.minutes + " minutes";
    //tile.getElementById("bike").image = train.bike ? "bike.png" : "nobike.png";
  }
}
