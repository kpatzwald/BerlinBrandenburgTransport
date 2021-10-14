import { gettext } from "i18n";

console.log("Opening BBT Settings page");

let autoValues = [];

// TODO Eingabe validieren?

/* Search for Station IDs */
async function searchID(searchString) {
  let url = 'https://v5.vbb.transport.rest/locations?results=5&query=' + encodeURIComponent(searchString);
  //console.log('Url: ' + url);
  //autoValues = []; // Empty array with autoValues TODO funktioniert noch nicht, Ergebnis immer leer
  await fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      //console.log("index.jsx:searchID(): Got JSON response from server: " + JSON.stringify(json));
      // console.log("index.jsx:searchID(): " + typeof(json));
      // console.log("Inhalt von json: " + json.toString());
      // console.log("Länge von json: " + json.length);
      // if (json && Object.keys(json).length === 0 && Object.getPrototypeOf(obj) === Object.prototype) {
      //   console.log("Leeres Ergebnis");
      // }
      //let stations = [];
      autoValues = [];
      //console.log("Anzahl Ergebnisse: " + json.length);
      Object.keys(json).forEach((trip) => {
        var arr = json[trip];
        if (!(arr["name"] === undefined)) {
          //console.log("Inhalt von Name: " + arr["name"]);
          let d = {
            "name": arr["name"],
            "id": arr["id"]
          }
          //console.log("index.jsx:searchID(): Station: " + d.name);
          autoValues.push(d);
        }
      })
      //console.log(autoValues);
    })
    .catch((error) => {
      console.error('Error in index.jsx:searchID(): ', error);
    });
}

// Only for debugging
//searchID('Alexanderplatz');

/* Define the settings page */
function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">BerlinBrandenburgTransport</Text>}>
        <AdditiveList
          title={gettext("fav_station")}
          settingsKey="favorite_station_setting"
          maxItems="1"
          addAction={
            <TextInput
              title={gettext("add_number")}
              label={gettext("station_number")}
              placeholder={gettext("insert_number")}
              action={gettext("add_number_action")}
              onAutocomplete={async (value) => {
                await searchID(value);
                //console.log("Value: " + value);
                return autoValues.filter((option) =>
                  option.name.toLowerCase().includes(value.toLowerCase()));
              }}
            />
          }
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
