Module.register("MMM-SanitaryMeasures",{
	// Default module config.
	defaults: {
		// palier:	3,
		curfew: {
			isActive:	true,
			begin:		"22:00:00",
			end: 		"05:00:00"
		},
		closed_on_sunday: {
			isActive:	true,
			end: 		"2022-01-16 23:59:59.999"
		}
	},

	// set update interval
	start: function() {
		var self = this;

		var date = new Date();
		this.day = date.getDay();
		this.as_play = false;

		setInterval(function() {
			self.updateDom(); // no speed defined, so it updates instantly.
		}, this.config.customInterval); 
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-SanitaryMeasures.css",
		];
	},


	// Update function
	getDom: function() {
		var wrapper = document.createElement("div");

		var wrapper_sanitary_measures = document.createElement("div");
		wrapper.classList.add("sanitary_measures");
		wrapper.appendChild(wrapper_sanitary_measures);

		var table = document.createElement("table");
		wrapper_sanitary_measures.appendChild(table);

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
			// header
			var tr_curfew_header = document.createElement("tr");
			table.appendChild(tr_curfew_header);
			
			var td_curfew_header = document.createElement("td");
			td_curfew_header.classList.add("small", "level_1");
			td_curfew_header.innerHTML = "- Couvre-feu:";
			tr_curfew_header.appendChild(td_curfew_header);

			//current mode
			var tr_curfew_current_mode = document.createElement("tr");
			table.appendChild(tr_curfew_current_mode);
			
			var td_curfew_current_mode = document.createElement("td");
			td_curfew_current_mode.classList.add("xsmall", "level_2");
			tr_curfew_current_mode.appendChild(td_curfew_current_mode);

			//next mode
			var tr_curfew_next_mode = document.createElement("tr");
			table.appendChild(tr_curfew_next_mode);
			
			var td_curfew_next_mode= document.createElement("td");
			td_curfew_next_mode.classList.add("xsmall", "level_2");
			tr_curfew_next_mode.appendChild(td_curfew_next_mode);

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
				td_curfew_current_mode.innerHTML = "· Couvre-feu jusqu'à " + this.formatTime(this.config.curfew.end);
				td_curfew_next_mode.innerHTML = "· Normalité dans " + diffHours + ":" + diffMinutes.toString().padStart(2, '0') + ":" + diffSeconds.toString().padStart(2, '0');
			} else if (this.dateCompare(today, end) == 1 & this.dateCompare(today, begin) == -1) {
				td_curfew_current_mode.innerHTML = "· Normalité jusqu'à " + this.formatTime(this.config.curfew.begin);
				td_curfew_next_mode.innerHTML = "· Couvre-feu dans " + diffHours + ":" + diffMinutes.toString().padStart(2, '0') + ":" + diffSeconds.toString().padStart(2, '0');
			} else if (this.dateCompare(today, end) == 1 & this.dateCompare(today, begin) == 1) {
				td_curfew_current_mode.innerHTML = "· Couvre-feu jusqu'à " + this.formatTime(this.config.curfew.end);
				td_curfew_next_mode.innerHTML = "· Normalité dans " + diffHours + ":" + diffMinutes.toString().padStart(2, '0') + ":" + diffSeconds.toString().padStart(2, '0');
			}
		}

		if (this.config.closed_on_sunday.isActive) {
			
			var startDate = new Date(Date.now());
			var endDate = new Date(this.config.closed_on_sunday.end);
			var totalSundays = 0;

			for (var i = startDate; i <= endDate; ){
				if (i.getDay() == 0){
					totalSundays++;
				}
				i.setTime(i.getTime() + 1000*60*60*24);
			}

			// header
			var tr_closed_header = document.createElement("tr");
			table.appendChild(tr_closed_header);

			var td_closed_header = document.createElement("td");
			td_closed_header.classList.add("small", "level_1");
			td_closed_header.innerHTML = "- Fermé les dimanches:";
			tr_closed_header.appendChild(td_closed_header);

			// number
			var tr_closed_until_time = document.createElement("tr");
			table.appendChild(tr_closed_until_time);
			
			var td_closed_until_time = document.createElement("td");
			td_closed_until_time.classList.add("xsmall", "level_2");
			td_closed_until_time.innerHTML = "· Encore " + totalSundays + " dimanche" + ((totalSundays>1) ? "s": "");
			tr_closed_until_time.appendChild(td_closed_until_time);

			// until date
			var tr_closed_until_date = document.createElement("tr");
			table.appendChild(tr_closed_until_date);
			
			var td_closed_until_date = document.createElement("td");
			td_closed_until_date.classList.add("xsmall", "level_2");
			td_closed_until_date.innerHTML = "&nbsp;&nbsp;&nbsp;jusqu'au " + endDate.toLocaleDateString('en-CA');
			tr_closed_until_date.appendChild(td_closed_until_date);
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
