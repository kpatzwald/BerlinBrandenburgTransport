import document from "document";
import { gettext } from "i18n";

export function VBBUI() {
  this.trainList = document.getElementById("trainList");
  this.statusText = document.getElementById("status");
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
  //console.log(departures);
  departures.unshift(departures[0].station); // Adds the actual station as first element to the departures-array
  //console.log(departures);

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

}
