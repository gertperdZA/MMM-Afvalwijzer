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
				extention:"",
                                showCleanprofsData: true,
				showColorIcons:true
			}
		},
```
## Configuration options

Option|Default|Description
------|------|-----------
`title`||Title of this module to show
`apiKey`|{ContactMeForTheAPIKey}|The API key in order to retrieve the data: {ContactMeForTheAPIKey}
`numberOfweeks`|2|Indicate the number of weeks you want to see the schedule in advance.
`houseNumber`|1|House number of the address
`postalCode`|3607NR|Postal code of the address
`streetName`||Street name of the address
`extention`||Housnumber addition of the address.
`dateFormat`|dddd D MMMM|Date format 
`updateInterval`|4 * 60 * 60 * 1000|How often should the data be retrieved
`showCleanprofsData`|`false`|Retrieve the dates that Clean Profs will clean the containers

## Sample screenshot

![image](https://github.com/user-attachments/assets/01efd7cb-b1d9-4bd8-88e1-a329a8cf25d1)


## Special Thanks

Michael Teeuw for creating the awesome MagicMirror² project that made this module possible.
