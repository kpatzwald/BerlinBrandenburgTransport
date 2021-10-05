//import { STATIONS } from "../common/globals.js"
import { gettext } from "i18n";

console.log("Opening BBT Settings page");

/*let autoValues = [];
for (let key in STATIONS) {
  autoValues.push( {
    "name": STATIONS[key] + " Northbound",
    "value": { code: key, direction: "n" }
  } );
  autoValues.push( {
    "name": STATIONS[key] + " Southbound",
    "value": { code: key, direction: "s" }
  } );
}*/

// TODO Add i18n
// TODO Eingabe validieren?
// TODO Settings testen, wenn online

/* Define the settings page */
function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">BerlinBrandenburgTransport</Text>}>
        <AdditiveList
          title={gettext("fav_station")}
          settingsKey="favorite_station_setting"
          maxItems="5"
          addAction={
            <TextInput
              title={gettext("add_number")}
              label={gettext("station_number")}
              placeholder={gettext("insert_number")}
              action={gettext("add_number_action")}
              //onAutocomplete={(value) => {
              //  return autoValues.filter((option) =>
              //    option.name.toLowerCase().startsWith(value.toLowerCase()));
              //}}
            />
          }
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
