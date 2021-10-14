export function BVGAPI() {
  
};

BVGAPI.prototype.realTimeDepartures = function(station_id) {
  let self = this;
  console.log("Station ID: " + station_id);
  return new Promise(function(resolve, reject) {
    /*let url = "https://api.bart.gov/api/etd.aspx?json=y";
    url += "&key=" + self.apiKey;
    url += "&cmd=etd";
    url += "&orig=" + origin;*/

    let url = "https://v5.vbb.transport.rest/stops/";
//    url += 900000080202 + "/departures?duration=1"; //ID ist vom U Grenzallee
    // url += 900100003 + "/departures?duration=1"; //ID ist vom U Alexanderplatz
    url += station_id + "/departures?duration=30"; //Show departures for how many minutes?

    url += "&when=" + "now"; // actual time
    url += "&results=8"; // only the first 8 results // TODO eingeschränkt, weil zu viele Ergebnisse
    //console.log("URL: " + url);
    
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));

      //let data = json;
      
      let departures = [];

      // TODO Station muss nicht für alle Einträge mitgeliefert werden. Spart evtl. Speicherplatz

      // if (typeof(json) == "object") {
      //   console.log("bvg.js:realTimeDepartures(): No results!")
      // } else {

      console.log("Objekt-Typ: " + json.length);

      json.forEach( (trip) => {
        let d = {
          "name": trip["line"]["name"],
          "when": trip["when"],
          "delay": trip["delay"],
          "direction": trip["direction"],
          "station": trip["stop"]["name"]
        }
        departures.push(d);
      });
    // }

      // Sort departures (notwendig?)
      //departures.sort( (a,b) => { return (a["minutes"] - b["minutes"]) } );

      resolve(departures);
    }).catch(function (error) {
      console.log("Error in bvg.js->realTimeDepartures(): " + error);
      reject(error);
    });
  });
}
