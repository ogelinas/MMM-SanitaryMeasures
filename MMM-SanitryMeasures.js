Module.register("MMM-SanitryMeasures",{
	// Default module config.
	defaults: {
		// palier:	3,
		curfew: {
			isActive:	true,
			begin:		"22:00:00",
			end: 		"05:00:00"
		}
	},

	// set update interval
	start: function() {
		var self = this;
		setInterval(function() {
			self.updateDom(); // no speed defined, so it updates instantly.
		}, this.config.customInterval); 
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-SanitryMeasures.css",
		];
	},


	// Update function
	getDom: function() {
		var wrapper = document.createElement("div");

		// Palier
		// var zone_wrapper = document.createElement("div");
		// zone_wrapper.classList.add("small");

		

		// var zone_icon = document.createElement('span');
		// zone_icon.classList.add("palier" + this.config.palier);
		
		// var zone_text = document.createElement("span");
		// zone_text.classList.add("align-left", "small");
		// zone_text.innerHTML = this.getPalierLabel([this.config.palier]);

		// zone_wrapper.appendChild(zone_icon);
		// zone_wrapper.appendChild(zone_text);

		// wrapper.appendChild(zone_wrapper);

		if (this.config.curfew.isActive) {
			// Couvre-feu
			var curfew_wrapper = document.createElement("div");
			curfew_wrapper.classList.add("curfew");

			var curfew_header_wrapper = document.createElement("div");
			curfew_header_wrapper.classList.add("small");
			var curfew_header = document.createElement("span");
			curfew_header.classList.add("small", "header");
			curfew_header.innerHTML = "Couvre-feu:";
			curfew_header_wrapper.appendChild(curfew_header);

			var curfew_current_mode_wrapper = document.createElement("div");
			curfew_current_mode_wrapper.classList.add("small");
			var curfew_current_mode = document.createElement("span");
			curfew_current_mode.classList.add("small", "data");
			curfew_current_mode_wrapper.appendChild(curfew_current_mode);

			var curfew_next_mode_wrapper = document.createElement("div");
			curfew_next_mode_wrapper.classList.add("small");
			var curfew_next_mode = document.createElement("span");
			curfew_next_mode.classList.add("small", "data");
			curfew_next_mode_wrapper.appendChild(curfew_next_mode);


			// Curfew - Time calculation
			var today = new Date(Date.now());

			var begin_time = this.getTime(this.config.curfew.begin);
			var end_time = this.getTime(this.config.curfew.end);
			var begin = new Date(Date.now()).setHours(begin_time[0], begin_time[1], begin_time[2], 0);
			var end = new Date(Date.now()).setHours(end_time[0], end_time[1], end_time[2], 0);
			var timeDiff = new Date(Date.now());

			if (this.dateCompare(today, end) == -1 & this.dateCompare(today, begin) == -1) {
				timeDiff = end - today;
			} else if (this.dateCompare(today, end) == 1 & this.dateCompare(today, begin) == -1) {
				timeDiff = begin - today;
			} else if (this.dateCompare(today, end) == 1 & this.dateCompare(today, begin) == 1) {
				var tomorrow = new Date(end);
				tomorrow.setDate(tomorrow.getDate() + 1);
				timeDiff = tomorrow - today;
			}

			// Set days, hours, minutes and seconds
			var diffHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var diffMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			var diffSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
			
			if (this.dateCompare(today, end) == -1 & this.dateCompare(today, begin) == -1) {
				curfew_current_mode.innerHTML = "- Couvre-feu jusqu'à " + this.formatTime(this.config.curfew.end);
				curfew_next_mode.innerHTML = "- Normalité dans " + diffHours + ":" + diffMinutes.toString().padStart(2, '0') + ":" + diffSeconds.toString().padStart(2, '0');
			} else if (this.dateCompare(today, end) == 1 & this.dateCompare(today, begin) == -1) {
				curfew_current_mode.innerHTML = "- Normalité jusqu'à " + this.formatTime(this.config.curfew.begin);
				curfew_next_mode.innerHTML = "- Couvre-feu dans " + diffHours + ":" + diffMinutes.toString().padStart(2, '0') + ":" + diffSeconds.toString().padStart(2, '0');
			} else if (this.dateCompare(today, end) == 1 & this.dateCompare(today, begin) == 1) {
				curfew_current_mode.innerHTML = "- Couvre-feu jusqu'à " + this.formatTime(this.config.curfew.end);
				curfew_next_mode.innerHTML = "- Normalité dans " + diffHours + ":" + diffMinutes.toString().padStart(2, '0') + ":" + diffSeconds.toString().padStart(2, '0');
			}

			curfew_wrapper.appendChild(curfew_header_wrapper);
			curfew_wrapper.appendChild(curfew_current_mode_wrapper);
			curfew_wrapper.appendChild(curfew_next_mode_wrapper);

			wrapper.appendChild(curfew_wrapper);
		}
		
		return wrapper;
	},

	dateCompare: function(time1, time2) {
		if (time1 > time2) return 1;
		if (time1 < time2) return -1;
		return 0;
	},

	getTime: function(time) {
		return time.split(":");
	},

	getPalierLabel: function(num) {
		var palier_label = [
			"",
			"Vigilance",
			"Préalerte",
			"Alerte",
			"Alerte maximale",
			"Mesures spéciales d'urgence en vigueur",
			"Mesures particulières"
		]

		label = "";

		if (1 <= num <= 4) {
			label = "Palier " + this.config.palier + " - " + palier_label[this.config.palier];
		} else if (5 <= num <= 6) {
			label = palier_label[this.config.palier];
		}
		else {
			label = "ERR: PALIER INEXISTANT";
		}

		return label;
	},

	formatTime: function(time) {
		var parts = time.split(":");
		return parts[0] + ":" + parts[1].toString().padStart(2, '0');
	}

});
