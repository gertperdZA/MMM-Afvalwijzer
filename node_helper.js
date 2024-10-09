const Log = require("logger");
const NodeHelper = require("node_helper");
const moment = require("moment");

module.exports = NodeHelper.create({
  async socketNotificationReceived(notification, payload) {
    const self = this;

    if (notification === "GET_TRASH_DATA") {
      const afvalwijzerUrl = `https://api.mijnafvalwijzer.nl/webservices/appsinput/?apikey=${payload.config.apiKey}&method=postcodecheck&postcode=${payload.config.postalCode}&street=${payload.config.streetName}&huisnummer=${payload.config.houseNumber}&toevoeging=${payload.config.extention}&app_name=afvalwijzer&platform=web&afvaldata=2022-10-19&langs=nl&&__cf_chl_tk=YKspnxe1mVfGgdRMHr_fA_eKMJX1NdWAiRw4lWv9AjE-1709554190-0.0.1.1-1941`;

      let returnData = "";

      try {
        const response = await fetch(afvalwijzerUrl);
        const body = await response.json();

        if (!body || !body.ophaaldagen) {
          returnData = JSON.stringify(body.ophaaldagen);
        } else {
          let result = body;

          if (payload.config.showCleanprofsData) {
            result = await self.appendCleanProfsData(payload, result);
          }

          returnData = result;
        }
      } catch (error) {
        Log.error("Error:", error);
      }
      self.sendSocketNotification("TRASH_DATA", returnData);
    }
  },

  async appendCleanProfsData(payload, afvalwijzerResult) {
    const startDate = moment(new Date(Date.now())).format("YYYY-MM-DD");
    const endDate = moment(new Date(new Date(Date.now()).getTime() + (payload.config.numberOfweeks * 7 * 24 * 60 * 60 * 1000))).format("YYYY-MM-DD");
    const cleanprofsUrl = `https://cleanprofs.jmsdev.nl/api/get-plannings-address?zipcode=${payload.config.postalCode}&house_number=${payload.config.houseNumber}&start_date=${startDate}&end_date=${endDate}&code=crm`;
    Log.log("cleanProfsUrl", cleanprofsUrl);
    // ophaaldagen looks like this:
    // {
    //   "ophaaldagen": {
    //     "data": [
    //       {
    //         "date": "2022-10-19",
    //         "nameType": "pmd",
    //         "type": "pmd"
    //       }
    //     ]
    //   }

    // cleanprofs looks like this:
    // [
    //    { "product_name": "RST", "weekday": "vrijdag", "date": "30 aug.", "full_date": "2024-08-30" }
    // ]

    try {
      const response = await fetch(cleanprofsUrl);
      const cleanprofsBody = await response.json();

      if (cleanprofsBody) {
        cleanprofsBody.forEach((cleanprofsDay) => {
          // update the ophaaldagen object with the cleanprofs data
          // match on date and type of product

          afvalwijzerResult.ophaaldagen.data
            .filter(x => x.date === cleanprofsDay.full_date)
            .filter((x) => {
              if ((x.nameType === "REST" || x.nameType === "restafval") &&
                cleanprofsDay.product_name === "RST") {
                return true;
              }
              if ((x.nameType === "gft") &&
                cleanprofsDay.product_name === "GFT") {
                return true;
              }
              return false;
            })
            // eslint-disable-next-line no-return-assign
            .forEach(x => x.cleanprofs = true);
        });
      }
    } catch (error) {
      Log.error("Error:", error);
    }

    return afvalwijzerResult;
  }
});
