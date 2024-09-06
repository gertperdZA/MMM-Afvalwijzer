

Module.register('MMM-Afvalwijzer', {
    defaults: {
        zipCode: "3607NR",
        houseNr: 1,
        extention: "",
        dateFormat: "dddd D MMMM",
        numberOfweeks: 2,
        updateInterval: 4 * 60 * 60 * 1000, // Defaults to 4 hours
        showCleanprofsData: false
    },

    start: function () {
        this.sendSocketNotification('GET_TRASH_DATA', this.config.url)
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'DATA_RECEIVED') {
            this.processData(payload);
            console.log("SUCCESS", payload);
        } else if (notification === 'DATA_ERROR') {
            console.error('Error:', payload);
        }
    },
    getHeader: function () {
        return this.config.title;
    },

    // Start the module
    start: function () {
        this.trashDays = [];
        const payloadReturn = "";
        this.loaded = false;
        this.getTrashCollectionDays();
        this.scheduleUpdate();
    },

    // Import additional CSS Styles
    getStyles: function () {
        return ['font-awesome.css', 'MMM-Afvalwijzer.css']
    },

    // Contact node_helper for the trash collection days
    getTrashCollectionDays: function () {
        this.sendSocketNotification("GET_TRASH_DATA", {
            config: this.config
        });
    },

    // Schedule the update interval and update
    scheduleUpdate: function (delay) {
        let nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        const self = this;
        setInterval(function () {
            self.getTrashCollectionDays();
        }, nextLoad);
    },

    // Handle node_helper response
    socketNotificationReceived: function (notification, payload) {
        if (notification === "TRASH_DATA") {
            payloadReturn = payload;
            // Logging the JavaScript object
            console.log("PAYLOAD", payloadReturn.ophaaldagen.data);
            this.loaded = true;
            this.updateDom(1000);
        }
    },
    capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    // Create icons
    getIconByTrashtype: function (trash_type) {
        console.log("Trashtype", trash_type);

        let color = "#64656a";

       switch (trash_type) {
            case 'REST':
            case 'restaval':
                color = "#64656a";
                break;
            case 'gft':
                color = this.config.showColorIcons?"#418740":"#64656a"
                break;
            case 'pbd':
                color = this.config.showColorIcons?"#e96c29":"#64656a"
            break;
            case 'papier':
            case 'papier en karton':
                color = this.config.showColorIcons?"#2a70b8":"#64656a"
                break;
            case 'DHM':
                color = this.config.showColorIcons?"#7c6a61":"#64656a"
                break;
            case 'BTG':
                color = this.config.showColorIcons?"#9a51bb":"#64656a"
                break;
            case 'PPBTG':
                color = this.config.showColorIcons?"#346dc3":"#64656a"
                break;
            case 'GROF':
                color = this.config.showColorIcons?"#e84c5e":"#64656a"
                break;
            case 'PTG':
                color = this.config.showColorIcons?"#4f936f":"#64656a"
                break;
            case 'KRINGLOOP':
                color = this.config.showColorIcons?"#7cbf6e":"#64656a"
                break;
            case 'KCA':
                color = this.config.showColorIcons?"#e64e61":"#64656a"
                break;
            case 'GLAS':
                color = this.config.showColorIcons?"#ffc729":"#64656a"
                break;
            default:
                color = this.config.showColorIcons?"#64656a":"#64656a"
                break;
        }

        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttributeNS(null, "class", "binday-icon");
        svg.setAttributeNS(null, "style", "fill: " + color);

        let use = document.createElementNS('http://www.w3.org/2000/svg', "use");
        use.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.file("bin_icon.svg#bin"));
        svg.appendChild(use);

        return (svg);
    },
    getCleanprofsIcon: function () {

        let span = document.createElement("span")
        span.classList.add("fa")
        span.classList.add("fa-solid")
        span.classList.add("fa-droplet")
        span.style.color = this.config.showColorIcons?"#2a70b8":"#64656a"
        span.style.width = "24px"
        span.style.height = "24px"
        return (span)
    },
    // Construct the DOM objects for this module
    getDom: function () {
        let wrapper = document.createElement("div");

        if (this.loaded === false) {
            wrapper.innerHTML = this.translate("Loading...");
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        console.log("TRASHDAYS", payloadReturn.ophaaldagen.data);
        for (i = 0; i < payloadReturn.ophaaldagen.data.length; i++) {

            let trashDay = payloadReturn.ophaaldagen.data[i];

            //console.log("Trashday",trashDay.date);

            let pickupContainer = document.createElement("div");
            pickupContainer.classList.add("binday-container");

            let dateContainer = document.createElement("span");
            dateContainer.classList.add("binday-date");

            moment.locale();
            let today = moment().startOf("day");
            let pickUpDate = moment(trashDay.date);
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

                dateContainer.innerHTML += ": " + this.capitalize(trashDay.type);

                pickupContainer.appendChild(dateContainer);

                let iconContainer = document.createElement("span");
                iconContainer.classList.add("binday-icon-container");
                if (trashDay.cleanprofs)
                    iconContainer.appendChild(this.getCleanprofsIcon())
                if(this.config.showContainerIcons)
                {
                iconContainer.appendChild(this.getIconByTrashtype(trashDay.nameType));
                }

                pickupContainer.appendChild(iconContainer);
                wrapper.appendChild(pickupContainer);
            }

        }


        return wrapper;

    }
});

