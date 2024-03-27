const node_helper = require("node_helper");
const Log = require("logger");

module.exports = node_helper.create({
	socketNotificationReceived: async function (notification, payload) {
		const self = this;

		if (notification === "GET_TRASH_DATA") {
			const afvalwijzer_url = 'https://api.mijnafvalwijzer.nl/webservices/appsinput/?apikey='+payload.config.apiKey+'&method=postcodecheck&postcode=' + payload.config.postalCode + '&street=' + payload.config.streetName + '&huisnummer=' + payload.config.houseNumber + '&toevoeging=' + payload.config.extention + '&app_name=afvalwijzer&platform=web&afvaldata=2022-10-19&langs=nl&&__cf_chl_tk=YKspnxe1mVfGgdRMHr_fA_eKMJX1NdWAiRw4lWv9AjE-1709554190-0.0.1.1-1941';
			let returnData = ""

			try {
				const response = await fetch(afvalwijzer_url);
				const body = await response.json();
				returnData = JSON.stringify(body.ophaaldagen);
				if (body && body.ophaaldagen) {
					returnData = body;
				}
			} catch (error) {
				Log.error("Error:", error);
			}
			self.sendSocketNotification("TRASH_DATA", returnData);
		}
	},
});
