# MMM-Afvalwijzer

Afvalwijzer Trash collection module. Some of the code was re-used from the MMM-ROVA-trashcalendar repository. Not all cities in the Netherland uses the ROVA service, hence the reason why I decided to create this one. 
## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository and install the dependencies:
````
git clone https://github.com/gertperdZA/MMM-AfvalWijzer.git
````

Add the module to the modules array in the `config/config.js` file
and insert your own postal code, housenumber and, if applicable, your 
house number extention:

```
{
			module: 'MMM-Afvalwijzer',
			position: 'top_left',
			config: {
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
NumberOfWeeks indicate the number of weeks you want to see the schedule in advance.

## Sample screenshot
<img width="337" alt="Screenshot 2024-03-05 at 20 05 04" src="https://github.com/gertperdZA/MMM-AfvalWijzer/assets/49020124/336ce1e1-4d6f-47b5-b2ec-40274de2409d">

## Special Thanks
Michael Teeuw for creating the awesome MagicMirror² project that made this module possible.



