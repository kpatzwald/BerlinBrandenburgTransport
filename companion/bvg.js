// Not necessary for bvg-api
/*export function BVGAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    // Default key for open public access.
    this.apiKey = "MW9S-E7SL-26DU-VV8V";
  }
};*/

export function BVGAPI() {
  
};

BVGAPI.prototype.realTimeDepartures = function(station_id) {
  let self = this;
  return new Promise(function(resolve, reject) {
    /*let url = "https://api.bart.gov/api/etd.aspx?json=y";
    url += "&key=" + self.apiKey;
    url += "&cmd=etd";
    url += "&orig=" + origin;*/

    let url = "https://v5.bvg.transport.rest/stops/";
//    url += 900000080202 + "/departures?duration=1"; //ID ist vom U Grenzallee
    // url += 900100003 + "/departures?duration=1"; //ID ist vom U Alexanderplatz
    url += station_id + "/departures?duration=1";

    url += "&when=" + "now"; // actual time
    url += "&results=4"; // only the first 4 results // TODO eingeschränkt, weil zu viele Ergebnisse
    //console.log("URL: " + url);
    
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));

      let data = json;
      
      let departures = [];

      // TODO Station muss nicht für alle Einträge mitgeliefert werden. Spart evtl. Speicherplatz

      json.forEach( (trip) => {
        let d = {
          "name": trip["line"]["name"],
          "when": trip["when"],
          "delay": trip["delay"],
          "direction": trip["direction"],
          "station": trip["stop"]["name"]
        }
        departures.push(d);

        /*trip["estimate"].forEach( (train) => {
          let d = {
            "to": destination["abbreviation"],
            "minutes": Number.parseInt(train["minutes"]),
            "platform": train["platform"],
            "bike": (train["bikeflag"] === "1" ? true : false)
          };
          if (!Number.isInteger(d["minutes"])) {
            d["minutes"] = 0;
          }
          departures.push(d);
        });*/
      });

      // Sort departures (TODO)
      //departures.sort( (a,b) => { return (a["minutes"] - b["minutes"]) } );

      resolve(departures);
    }).catch(function (error) {
      console.log("Error in bvg.js->realTimeDepartures()"); console.log(error)
      reject(error);
    });
  });
}
