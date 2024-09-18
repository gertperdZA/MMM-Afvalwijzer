/* global Log Module moment */

Module.register("MMM-Afvalwijzer", {
  defaults: {
    title: "Trash Collection",
    zipCode: "3607NR",
    houseNr: 1,
    extention: "",
    dateFormat: "dddd D MMMM",
    numberOfweeks: 2,
    updateInterval: 4 * 60 * 60 * 1000, // Defaults to 4 hours
    showCleanprofsData: false,
    showColorIcons: true,
    showContainerIcons: true,
  },

  getHeader() {
    return this.config.title;
  },

  // Start the module
  start() {
    this.trashDays = [];
    this.payloadReturn = "";
    this.loaded = false;
    this.getTrashCollectionDays();
    this.scheduleUpdate();
  },

  // Import additional CSS Styles
  getStyles() {
    return ["font-awesome.css", "MMM-Afvalwijzer.css"];
  },

  // Contact node_helper for the trash collection days
  getTrashCollectionDays() {
    this.sendSocketNotification("GET_TRASH_DATA", {
      config: this.config
    });
  },

  // Schedule the update interval and update
  scheduleUpdate(delay) {
    let nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    const self = this;
    setInterval(() => {
      self.getTrashCollectionDays();
    }, nextLoad);
  },

  // Handle node_helper response
  socketNotificationReceived(notification, payload) {
    if (notification === "TRASH_DATA") {
      this.payloadReturn = payload;
      // Logging the JavaScript object
      Log.log("PAYLOAD", this.payloadReturn.ophaaldagen.data);
      this.loaded = true;
      this.updateDom(1000);
    }
  },
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  // Create icons
  getIconByTrashType(trashType) {
    Log.log("Trashtype", trashType);

    let color = "#64656a";

    switch (trashType) {
      case "REST":
      case "restaval":
        color = "#64656a";
        break;
      case "gft":
        color = this.config.showColorIcons ? "#418740" : "#64656a";
        break;
      case "pbd":
      case "pmd":
        color = this.config.showColorIcons ? "#e96c29" : "#64656a";
        break;
      case "papier":
      case "papier en karton":
        color = this.config.showColorIcons ? "#2a70b8" : "#64656a";
        break;
      case "DHM":
        color = this.config.showColorIcons ? "#7c6a61" : "#64656a";
        break;
      case "BTG":
        color = this.config.showColorIcons ? "#9a51bb" : "#64656a";
        break;
      case "PPBTG":
        color = this.config.showColorIcons ? "#346dc3" : "#64656a";
        break;
      case "GROF":
        color = this.config.showColorIcons ? "#e84c5e" : "#64656a";
        break;
      case "PTG":
        color = this.config.showColorIcons ? "#4f936f" : "#64656a";
        break;
      case "KRINGLOOP":
        color = this.config.showColorIcons ? "#7cbf6e" : "#64656a";
        break;
      case "KCA":
        color = this.config.showColorIcons ? "#e64e61" : "#64656a";
        break;
      case "GLAS":
        color = this.config.showColorIcons ? "#ffc729" : "#64656a";
        break;
      default:
        color = this.config.showColorIcons ? "#64656a" : "#64656a";
        break;
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null, "class", "binday-icon");
    svg.setAttributeNS(null, "style", `fill: ${color}`);

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.file("bin_icon.svg#bin"));
    svg.appendChild(use);

    return (svg);
  },
  getCleanprofsIcon() {
    const span = document.createElement("span");
    span.classList.add("fa");
    span.classList.add("fa-solid");
    span.classList.add("fa-droplet");
    span.style.color = this.config.showColorIcons ? "#2a70b8" : "#64656a";
    span.style.width = "24px";
    span.style.height = "24px";
    return (span);
  },
  // Construct the DOM objects for this module
  getDom() {
    const wrapper = document.createElement("div");

    if (this.loaded === false) {
      wrapper.innerHTML = this.translate("Loading...");
      wrapper.className = "dimmed light small";
      return wrapper;
    }
    Log.log("TRASHDAYS", this.payloadReturn.ophaaldagen.data);
    for (let i = 0; i < this.payloadReturn.ophaaldagen.data.length; i++) {
      const trashDay = this.payloadReturn.ophaaldagen.data[i];

      //Log.log("Trashday",trashDay.date);

      const pickupContainer = document.createElement("div");
      pickupContainer.classList.add("binday-container");

      const dateContainer = document.createElement("span");
      dateContainer.classList.add("binday-date");

      moment.locale();
      const today = moment().startOf("day");
      const pickUpDate = moment(trashDay.date);
      if (moment(pickUpDate) >= moment(today) && moment(pickUpDate) < (moment(today).add(this.config.numberOfweeks, "weeks"))) {
        if (today.isSame(pickUpDate)) {
          dateContainer.innerHTML = "Today";
        } else if (moment(today).add(1, "days").isSame(pickUpDate)) {
          dateContainer.innerHTML = "Tomorrow";
        } else if (moment(today).add(7, "days").isAfter(pickUpDate)) {
          dateContainer.innerHTML = this.capitalize(pickUpDate.format("dddd"));
        } else {
          dateContainer.innerHTML = this.capitalize(pickUpDate.format(this.config.dateFormat));
        }

        dateContainer.innerHTML += `: ${this.capitalize(trashDay.type)}`;

        pickupContainer.appendChild(dateContainer);

        const iconContainer = document.createElement("span");
        iconContainer.classList.add("binday-icon-container");
        if (trashDay.cleanprofs) { iconContainer.appendChild(this.getCleanprofsIcon()); }
        if (this.config.showContainerIcons) {
          iconContainer.appendChild(this.getIconByTrashType(trashDay.nameType));
        }

        pickupContainer.appendChild(iconContainer);
        wrapper.appendChild(pickupContainer);
      }
    }

    return wrapper;
  }
});
