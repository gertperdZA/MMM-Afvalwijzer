# MMM-Afvalwijzer

Afvalwijzer Trash collection module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror). Some of the code was re-used from the MMM-ROVA-trashcalendar repository. Not all cities in the Netherland uses the ROVA service, hence the reason why I decided to create this one.

## Dependencies

A MagicMirror² installation.

## Installation

In your terminal, go to your MagicMirror's module folder:

```bash
cd ~/MagicMirror/modules
```

Clone this repository and install the dependencies:

```bash
git clone https://github.com/gertperdZA/MMM-Afvalwijzer
```

Add the module to the modules array in the `config/config.js` file and insert your own postal code, housenumber and, if applicable, your house number extention:

```js
		{
			module: 'MMM-Afvalwijzer',
			position: 'top_left',
			config: {
				title:"Trash collection days",
				apiKey:"{ContactMeForTheAPIKey}",
				numberOfweeks:4,
				houseNumber:"1",
				postalCode:"3607LA",
				streetName:"Valkenkamp",
				extention:""
			}
		},
```

If you do not have an extention then just leave it blank.
`NumberOfWeeks` indicate the number of weeks you want to see the schedule in advance.

## Sample screenshot

![screenshot](AfvalwijzerScreenshot.png)

## Special Thanks

Michael Teeuw for creating the awesome MagicMirror² project that made this module possible.
