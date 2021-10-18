import { TRAIN_COUNT } from "../common/globals.js";
import document from "document";
import { gettext } from "i18n";

export function VBBUI() {
  this.trainList = document.getElementById("trainList");
  this.statusText = document.getElementById("status");

  // this.tiles = [];
  // for (let i = 0; i < NUM_ELEMS; i++) {
  //   let tile = document.getElementById(`my-pool[${i}]`);
  //   if (tile) {
  //     this.tiles.push(tile);
  //   }
  // }
}

VBBUI.prototype.updateUI = function (state, departures) {
  if (state === "loaded") {
    this.trainList.style.display = "inline";
    this.statusText.text = "";
    this.statusText.style.display = "none";

    this.updateDepartureList(departures);
  }
  else {
    this.statusText.style.display = "inline";
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

/** 
 * Updates the DepartureList when new data is available 
 */
VBBUI.prototype.updateDepartureList = function (departures) {

  // let station = document.getElementById("station");
  // if (departures[0] === undefined) {
  //   console.log("Error: No departures found.");
  //   station.text = "Error";
  // } else {
  //   station.text = departures[0].station;
  //   station.style.display = "inline";
  // }
  console.log(departures);
  departures.unshift(departures[0].station);
  console.log(departures);

  this.trainList.delegate = {
    getTileInfo: function (index) {
      if (index === 0) {
        return {
          type: "header-pool",
          data: departures[index],
          index: index
        }
      } else {
        return {
          type: "my-pool",
          data: departures[index],
          index: index
        }
      };
    },
    configureTile: function (tile, info) {
      if (info.type == "my-pool") {
        //console.log("configureTile " + `${info.value} ${info.index}`);
        tile.getElementById("name").text = info.data.name + "-->" + info.data.direction;;
        let depTime = new Date(info.data.when);
        tile.getElementById("when").text = gettext("departure") + depTime.getHours() + ":" + (depTime.getMinutes() < 10 ? '0' : '') + depTime.getMinutes();
        if (info.data.delay == null) {
          tile.getElementById("delay").text = gettext("delay") + ": " + gettext("no_delay");
        } else {
          tile.getElementById("delay").text = gettext("delay") + ": " + info.data.delay + " s";
        }
        let touch = tile.getElementById("touch-me");
        touch.onclick = evt => {
          console.log(`touched: ${info.index}`);
        };
      } else {
        if (info.type = "header-pool") {
          tile.getElementById("station").text = info.data;
          // TODO Fall berücksichtigen, dass es keine Abfahrtzeiten gibt

        }
      }
    }
  };

  this.trainList.length = departures.length;

  //let station = document.getElementById("station");

  // TODO: Error, when no favorite station is set 
  //console.log("departures[0]: " + departures[0]);
  // if (departures[0] === undefined) {
  //   console.log("Fehler: Es wurden keine Abfahrtzeiten geladen.");
  //   station.text = "Fehler";
  // } else {
  //   this.trainList.length = departures.length;
  //   station.text = departures[0].station;
  // }

  // for (let i = 0; i < departures.length; i++) {
  //   let tile = document.getElementById(`my-pool[${i}]`);
  //   if (!tile) {
  //     continue;
  //   }

  //   const train = departures[i];

  //   if (!train) {
  //     tile.style.display = "none";
  //     continue;
  //   }

  //   tile.style.display = "inline";
  //   tile.getElementById("name").text = train.name + "-->" + train.direction;
  //   // let test = [{type: "my-pool", value: train.name + "-->" + train.direction, index: i}];
  //   // this.trainList.configureTile(tile, test);

  //   // Enable scrolling of masquee after 2 s
  //   setTimeout(function () {
  //      tile.getElementById("name").state = "enabled";
  //      //tile.getElementById("name").y = 25;
  //   }, 2000);

  //   let depTime = new Date(train.when);

  //   tile.getElementById("when").text = depTime.getHours() + ":" + (depTime.getMinutes() < 10 ? '0' : '') + depTime.getMinutes();
  //   if (train.delay == null) {
  //     tile.getElementById("delay").text = gettext("delay") + ": " + gettext("no_delay");
  //   } else {
  //     tile.getElementById("delay").text = gettext("delay") + ": " + train.delay + " s";
  //   }
  //   //tile.getElementById("minutes").text = train.minutes + " minutes";
  //   //tile.getElementById("bike").image = train.bike ? "bike.png" : "nobike.png";
  // }

  // Removes all not used tiles
  // for (let i = departures.length; i < TRAIN_COUNT; i++) {
  //   let tile = this.tiles[i];
  //   tile.style.display = "none";
  // }
}
