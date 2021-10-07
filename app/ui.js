import { TRAIN_COUNT } from "../common/globals.js";
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
    } else if (state === "disconnected") {
      this.statusText.text = gettext("disconnected");
    } else if (state === "error") {
      this.statusText.text = gettext("error");
    } else if (state === "error_no_fav_station") {
      this.statusText.text = gettext("error_no_fav_station");
    }
  }
}

BVGUI.prototype.updateDepartureList = function(departures) {

  let station = document.getElementById("station");
  // TODO: Fehler muss noch behoben werden.
  console.log("departures[0]: " + departures[0]);
  if (departures[0] === undefined) {
    console.log("Fehler: Es wurden keine Abfahrtzeiten geladen.");
    station.text = "Fehler";
  } else
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

    // Enable scrolling of masquee after 2 s
    setTimeout(function () {
       tile.getElementById("name").state = "enabled";
       //tile.getElementById("name").y = 25;
    }, 2000);
    // //}
    let depTime = new Date(train.when);
    //date.parse(train.when)
    tile.getElementById("when").text = depTime.getHours() + ":" + (depTime.getMinutes() < 10 ? '0' : '') + depTime.getMinutes();
    if (train.delay == null) {
      tile.getElementById("delay").text = gettext("delay") + ": " + gettext("no_delay");
    } else {
      tile.getElementById("delay").text = gettext("delay") + ": " + train.delay + " s";
    }
    //tile.getElementById("minutes").text = train.minutes + " minutes";
    //tile.getElementById("bike").image = train.bike ? "bike.png" : "nobike.png";
  }

  for (let i = departures.length; i < TRAIN_COUNT; i++) {
    let tile = this.tiles[i];
    tile.style.display = "none";
  }
}
