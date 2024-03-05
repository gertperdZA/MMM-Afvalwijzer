# MMM-AfvalWijzer

Afvalwijzer Trash collection module. Some of the code was copied over from the MMM-ROVA-trashcalendar repository. Not all cities in the Netherland uses the ROMA service, hence the reason why I decided to create this one. 
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
				numberOfweeks:4,
				houseNumber:"1",
				postalCode:"3607LA",
				streetName:"Valkenkamp",
				extention:""
},
```


If you do not have an extention then just leave it blank.
NumberOfWeeks indicate the number of weeks you want to see the schedule in advance.

## Sample screenshot
<img width="269" alt="image" src="https://github.com/gertperdZA/MMM-AfvalWijzer/assets/49020124/177f5a30-428a-4bf4-a985-2e3e8a9b0fdf">



