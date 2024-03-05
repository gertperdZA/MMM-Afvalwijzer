const request = require("request");
const node_helper = require("node_helper");
const Log = require("logger");

module.exports = node_helper.create({
	socketNotificationReceived: function (notification, payload) {
		const self = this;

		if (notification === "GET_TRASH_DATA") {
			const afvalwijzer_url = 'https://api.mijnafvalwijzer.nl/webservices/appsinput/?apikey=5ef443e778f41c4f75c69459eea6e6ae0c2d92de729aa0fc61653815fbd6a8ca&method=postcodecheck&postcode=' + payload.config.postalCode + '&street=' + payload.config.streetName + '&huisnummer=' + payload.config.houseNumber + '&toevoeging=' + payload.config.extention + '&app_name=afvalwijzer&platform=web&afvaldata=2022-10-19&langs=nl&&__cf_chl_tk=YKspnxe1mVfGgdRMHr_fA_eKMJX1NdWAiRw4lWv9AjE-1709554190-0.0.1.1-1941';
			let returnData = ""

			request({
				method: 'GET',
				uri: afvalwijzer_url,
			}, function (error, response, body) {


				returnData = JSON.stringify(body.ophaaldagen);
				//Log.info("JSON Body", JSON.stringify(body));

				if (!error && response.statusCode == 200) {
					//Log.error("JSON PARSE", JSON.parse(body))
					returnData = JSON.parse(body);

				}
				else {
					self.sendSocketNotification("TRASH_DATA", returnData)
				}
				self.sendSocketNotification("TRASH_DATA", returnData);
			});
		}
	},
});

