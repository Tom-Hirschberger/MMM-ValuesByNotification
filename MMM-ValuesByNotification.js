/* global Module

/* Magic Mirror²
 * Module: ValuesByNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register('MMM-ValuesByNotification', {

	defaults: {
		basicElementType: "span", //this module uses a lot of wrappers and basic elements. This option decides about the basic element (div or span)
		updateInterval: 60, //how often should the module be refreshed
		reuseCount: 1, //how often should a value of a notification be reused before it is marked as stale and the na value is used instead
		animationSpeed: 500, //use this animation speed if the dom objects of the module gets updated
		groupsPositions: "tie", //decides in which order the elments of a group object get added to the wrapper; t=title,i=icon,d=dummy,e=elements, use [] to create an wrapper
		groupPositions: "tie", //decides in which order the elments of a group object get added to the wrapper; t=title,i=icon,d=dummy,e=elements, use [] to create an wrapper
		itemPositions: "tie", //decides in which order the elments of a item object get added to the wrapper; t=title,i=icon,d=dummy,e=elements, use [] to create an wrapper
		valuePositions: "ti[vu]", //decides in which order the elments of a value object get added to the wrapper; t=title,i=icon,v=value,u=unit,d=dummy, use [] to create an wrapper
		naValue: "na", //the value which will be displayed if a specific notification has not reached within the reuse interval
		groupsTitle: null, //the title(s) which are added before/after all groups
		groupTitle: null, //the default title of the groups
		itemTitle: null, //the default title of the items
		valueTitle: null, //the default title of the values
		classes: null, //should classes be added additionally? Add them to a string separated by a space
		groupsIcon: null, //the icons which are added before/after all groups
		groupIcon: null, //which is the default font awesome 4.7 icon to use for groups
		itemIcon: null, //which is the default font awesome 4.7 icon to use for items
		valueIcon: null, //which is the default font awesome 4.7 icon to use for values
		groupsImgIcon: null, //the imgIcons which are added before/after all groups
		groupImgIcon: null, //which is the default image icon url to use for groups
		itemImgIcon: null, //which is the default image icon url to use for items
		valueImgIcon: null, //which is the default image icon url to use for values
		valueUnit: null, //what is the default unit of the values
		valueFormat: null,//"{value}", //use an javascript script to format the value; {value} will be the value of the parsed notifcation; i.e. Number(${value}).toFixed(2) to display the number with two decimals
		transformerFunctions: {}, //specify a map of functions which should be usable as transformers
		valueTransformers: null,//specify a list of transformer function names that should be called
		formatNaValue: false, //should the na value be formatted as it would be a regular value
		thresholds: null, //specifify thresholds to add classes or change the icon based on the current value; possible compare types are eq=equal,lt=lower then,le=lower equal,gt=greater than,ge=greater equal
		groups: [], //specify groups of items which contain values; the used notification can be specified for each item
		notificationPrefix: "", //a prefix that will be added to all notifications
		profiles: null, //should some elements only be visible if some of this profiles is the current active one? Enter the profiles in this string separted by spaces
		addClassesRecursive: false, //should classes that are defined for elements be added to all sub elements as well?
		letClassesBubbleUp: true, //should classes set to elements in upper hirarchies?
		reusedClass: "reused", //this class will be added to the elments if the value is reused
		automaticWrapperClassPrefix: "wrap", //if wrappers are configured in the positions strings what is the prefix of the classes that should be added?
		newlineReplacement: " ",
		unitSpace: false, // If user requests, add a space for units.
	},

	suspend: function () {
		const self = this
	},

	resume: function () {
		const self = this
		self.updateDom(self.config.animationSpeed)
	},


	getScripts: function () {
		return [this.file('node_modules/jsonpath-plus/dist/index-browser-umd.cjs'), this.file('node_modules/@iconify/iconify/dist/iconify.min.js')];
	},


	getStyles: function () {
		return ['font-awesome.css', 'valuesByNotification.css']
	},

	/*
	** creates html objects based on a given string
	** different approach: https://davidwalsh.name/convert-html-stings-dom-nodes
	*/
	htmlToElement: function (theString) {
		theString = theString.trim()
		if (theString == ""){
			return theString
		} else {
			return document.createRange().createContextualFragment(theString)
		}
	},

	/*
	** creates the dom object of a value object which is specified by its in indices in the configuration
	*/
	getValueDomElement: function (groupIdx, itemIdx, valueIdx) {
		const self = this

		let curGroupConfig = self.config["groups"][groupIdx]
		let curItemConfig = curGroupConfig["items"][itemIdx]

		if (typeof curItemConfig["notification"] === "undefined") {
			return null
		}

		let curValueConfig
		if (typeof curItemConfig["values"] !== "undefined") {
			curValueConfig = curItemConfig["values"][valueIdx]
		} else {
			curValueConfig = {}
		}

		let profilesConfig = self.config["profiles"]
		if (typeof curValueConfig["profiles"] !== "undefined") {
			profilesConfig = curValueConfig["profiles"]
		} else if (typeof curItemConfig["profiles"] !== "undefined") {
			profilesConfig = curItemConfig["profiles"]
		} else if (typeof curGroupConfig["profiles"] !== "undefined") {
			profilesConfig = curGroupConfig["profiles"]
		}

		if (profilesConfig != null) {
			if (!profilesConfig.includes(self.currentProfile)) {
				return null
			}
		}

		let valueWrapper = document.createElement(self.config["basicElementType"])
		valueWrapper.classList.add("valueWrapper")

		let curNotifcationPrefix = self.config.notificationPrefix
		if (typeof curItemConfig["notificationPrefix"] !== "undefined") {
			curNotifcationPrefix = curItemConfig["notificationPrefix"]
		} else if (typeof curGroupConfig["notificationPrefix"] !== "undefined") {
			curNotifcationPrefix = curGroupConfig["notificationPrefix"]
		}

		let curNotification = curNotifcationPrefix + curItemConfig["notification"]
		let curNotifcationObj = self.sensorsSortedByNotification[curNotification]

		let valueTitle = self.config["valueTitle"]
		if (typeof curValueConfig["valueTitle"] !== "undefined") {
			valueTitle = curValueConfig["valueTitle"]
		} else if (typeof curItemConfig["valueTitle"] !== "undefined") {
			valueTitle = curItemConfig["valueTitle"]
		} else if (typeof curGroupConfig["valueTitle"] !== "undefined") {
			valueTitle = curGroupConfig["valueTitle"]
		}

		let iconConfig = null
		let imgIconConfig = null
		if (typeof curValueConfig["valueImgIcon"] !== "undefined") {
			imgIconConfig = curValueConfig["valueImgIcon"]
		} else if (typeof curValueConfig["valueIcon"] !== "undefined") {
			iconConfig = curValueConfig["valueIcon"]
		} else if (typeof curItemConfig["valueImgIcon"] !== "undefined") {
			imgIconConfig = curItemConfig["valueImgIcon"]
		} else if (typeof curItemConfig["valueIcon"] !== "undefined") {
			iconConfig = curItemConfig["valueIcon"]
		} else if (typeof curGroupConfig["valueImgIcon"] !== "undefined") {
			imgIconConfig = curGroupConfig["valueImgIcon"]
		} else if (typeof curGroupConfig["valueIcon"] !== "undefined") {
			iconConfig = curGroupConfig["valueIcon"]
		} else {
			iconConfig = self.config["valueIcon"]
			imgIconConfig = self.config["valueImgIcon"]
		}

		let positionsConfig = self.config["valuePositions"]
		if (typeof curValueConfig["valuePositions"] !== "undefined") {
			positionsConfig = curValueConfig["valuePositions"]
		} else if (typeof curItemConfig["valuePositions"] !== "undefined") {
			positionsConfig = curItemConfig["valuePositions"]
		} else if (typeof curGroupConfig["valuePositions"] !== "undefined") {
			positionsConfig = curGroupConfig["valuePositions"]
		}

		let naPositionsConfig = positionsConfig
		if (typeof curValueConfig["valueNaPositions"] !== "undefined") {
			naPositionsConfig = curValueConfig["valueNaPositions"]
		} else if (typeof curItemConfig["valueNaPositions"] !== "undefined") {
			naPositionsConfig = curItemConfig["valueNaPositions"]
		} else if (typeof curGroupConfig["valueNaPositions"] !== "undefined") {
			naPositionsConfig = curGroupConfig["valueNaPositions"]
		} else if (typeof self.config["valueNaPositions"] !== "undefined") {
			naPositionsConfig = self.config["valueNaPositions"]
		}

		let valueFormatConfig = self.config["valueFormat"]
		if (typeof curValueConfig["valueFormat"] !== "undefined") {
			valueFormatConfig = curValueConfig["valueFormat"]
		} else if (typeof curItemConfig["valueFormat"] !== "undefined") {
			valueFormatConfig = curItemConfig["valueFormat"]
		} else if (typeof curGroupConfig["valueFormat"] !== "undefined") {
			valueFormatConfig = curGroupConfig["valueFormat"]
		}

		let valueTransformersConfig = self.config["valueTransformers"]
		if (typeof curValueConfig["valueTransformers"] !== "undefined") {
			valueTransformersConfig = curValueConfig["valueTransformers"]
		} else if (typeof curItemConfig["valueTransformers"] !== "undefined") {
			valueTransformersConfig = curItemConfig["valueTransformers"]
		} else if (typeof curGroupConfig["valueTransformers"] !== "undefined") {
			valueTransformersConfig = curGroupConfig["valueTransformers"]
		}

		let formatNaValue = self.config["formatNaValue"]
		if (typeof curValueConfig["formatNaValue"] !== "undefined") {
			formatNaValue = curValueConfig["formatNaValue"]
		} else if (typeof curItemConfig["formatNaValue"] !== "undefined") {
			formatNaValue = curItemConfig["formatNaValue"]
		} else if (typeof curGroupConfig["formatNaValue"] !== "undefined") {
			formatNaValue = curGroupConfig["formatNaValue"]
		}

		let valueUnitConfig = self.config["valueUnit"]
		if (typeof curValueConfig["valueUnit"] !== "undefined") {
			valueUnitConfig = curValueConfig["valueUnit"]
		} else if (typeof curItemConfig["valueUnit"] !== "undefined") {
			valueUnitConfig = curItemConfig["valueUnit"]
		} else if (typeof curGroupConfig["valueUnit"] !== "undefined") {
			valueUnitConfig = curGroupConfig["valueUnit"]
		}

		let naValueConfig = self.config["naValue"]
		if (typeof curValueConfig["naValue"] !== "undefined") {
			naValueConfig = curValueConfig["naValue"]
		} else if (typeof curItemConfig["naValue"] !== "undefined") {
			naValueConfig = curItemConfig["naValue"]
		} else if (typeof curGroupConfig["naValue"] !== "undefined") {
			naValueConfig = curGroupConfig["naValue"]
		}

		let thresholdsConfig = self.config["thresholds"]
		if (typeof curValueConfig["thresholds"] !== "undefined") {
			thresholdsConfig = curValueConfig["thresholds"]
		} else if (typeof curItemConfig["thresholds"] !== "undefined") {
			thresholdsConfig = curItemConfig["thresholds"]
		} else if (typeof curGroupConfig["thresholds"] !== "undefined") {
			thresholdsConfig = curGroupConfig["thresholds"]
		}

		let jsonpathConfig = self.config["jsonpath"]
		if (typeof curValueConfig["jsonpath"] !== "undefined") {
			jsonpathConfig = curValueConfig["jsonpath"]
		} else if (typeof curItemConfig["jsonpath"] !== "undefined") {
			jsonpathConfig = curItemConfig["jsonpath"]
		} else if (typeof curGroupConfig["jsonpath"] !== "undefined") {
			jsonpathConfig = curGroupConfig["jsonpath"]
		}

		let newlineReplacement = self.config["newlineReplacement"]
		if (typeof curValueConfig["newlineReplacement"] !== "undefined") {
			newlineReplacement = curValueConfig["newlineReplacement"]
		} else if (typeof curItemConfig["newlineReplacement"] !== "undefined") {
			newlineReplacement = curItemConfig["newlineReplacement"]
		} else if (typeof curGroupConfig["newlineReplacement"] !== "undefined") {
			newlineReplacement = curGroupConfig["newlineReplacement"]
		}

		let automaticWrapperClassPrefix = self.config["automaticWrapperClassPrefix"]
		if (typeof curValueConfig["automaticWrapperClassPrefix"] !== "undefined") {
			automaticWrapperClassPrefix = curValueConfig["automaticWrapperClassPrefix"]
		} else if (typeof curItemConfig["automaticWrapperClassPrefix"] !== "undefined") {
			automaticWrapperClassPrefix = curItemConfig["automaticWrapperClassPrefix"]
		} else if (typeof curGroupConfig["automaticWrapperClassPrefix"] !== "undefined") {
			automaticWrapperClassPrefix = curGroupConfig["automaticWrapperClassPrefix"]
		}

		let unitSpace = self.config["unitSpace"]
		if (typeof curValueConfig["unitSpace"] !== "undefined") {
			unitSpace = curValueConfig["unitSpace"]
		} else if (typeof curItemConfig["unitSpace"] !== "undefined") {
			unitSpace = curItemConfig["unitSpace"]
		} else if (typeof curGroupConfig["unitSpace"] !== "undefined") {
			unitSpace = curGroupConfig["unitSpace"]
		}

		let additionalClasses = []
		if (self.config.addClassesRecursive) {
			if (self.config["classes"] != null) {
				self.config["classes"].split(" ").forEach(element => additionalClasses.push(element))
			}

			if ((typeof curGroupConfig["classes"] !== "undefined") && (curGroupConfig["classes"] != null)) {
				curGroupConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
			}

			if ((typeof curItemConfig["classes"] !== "undefined") && (curItemConfig["classes"] != null)) {
				curItemConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
			}
		}

		if ((typeof curValueConfig["classes"] !== "undefined") && (curValueConfig["classes"] != null)) {
			curValueConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
		}

		let value = curNotifcationObj["currentRawValue"];

		let isNaValue = false
		if ((typeof value === "undefined") ||
		    ((curNotifcationObj[groupIdx][itemIdx]["reuseCount"] > 0) && (curNotifcationObj["currentUses"] > curNotifcationObj[groupIdx][itemIdx]["reuseCount"]))) {
			value = naValueConfig
			isNaValue = true
			additionalClasses.push("naValue")
			positionsConfig = naPositionsConfig
		} else {
			if (curNotifcationObj["currentUses"] > 0){
				additionalClasses.push(self.config.reusedClass)
				additionalClasses.push(self.config.reusedClass+"-"+curNotifcationObj["currentUses"])
			}
			if ((jsonpathConfig != null) && (curNotifcationObj["isJSON"])) {
				try {
					value = JSONPath.JSONPath({ path: jsonpathConfig, json: value })[0];
					if(value === ""){
						isNaValue = true
						value = naValueConfig
						additionalClasses.push("naValue")
					}
				} catch {
					isNaValue = true
					value = naValueConfig
					positionsConfig = naPositionsConfig
					additionalClasses.push("naValue")
				}
			}
		}

		if((!isNaValue) || formatNaValue){
			if (valueTransformersConfig != null){
				for (let curTransformerIdentifier of valueTransformersConfig){
					let curTransformer = self.config.transformerFunctions[curTransformerIdentifier]
					if (typeof curTransformer !== "undefined") {
						try {
							value = curTransformer(value)
						} catch (exception) {
							console.log("Error during call of transformer function: "+curTransformerIdentifier+".")
							console.log(exception)
						}
					}
				}
			}

			if (valueFormatConfig != null){
				try {

					if (newlineReplacement != null) {
						value = String(value).replace(/(?:\r\n|\r|\n)/g, newlineReplacement)
					}
					value = eval(eval("`" + valueFormatConfig + "`"))
				} catch (exception){
					console.log(exception)
				}
			}
		}

		let thresholdClasses = []
		if (thresholdsConfig != null) {
			for (let thresholdIdx = 0; thresholdIdx < thresholdsConfig.length; thresholdIdx++) {
				let curThresholdConfig = thresholdsConfig[thresholdIdx]
				if (typeof curThresholdConfig.type !== "undefined") {
					let match = false
					if (curThresholdConfig.type === "eq") {
						if (value === curThresholdConfig["value"]) {
							match = true
						}
					} else if ((curThresholdConfig["type"] === "lt") && (Number.parseFloat(value) !== NaN)) {
						if (Number.parseFloat(value) < curThresholdConfig["value"]) {
							match = true
						}
					} else if ((curThresholdConfig["type"] === "gt") && (Number.parseFloat(value) !== NaN)) {
						if (Number.parseFloat(value) > curThresholdConfig["value"]) {
							match = true
						}
					} else if ((curThresholdConfig["type"] === "ge") && (Number.parseFloat(value) !== NaN)) {
						if (Number.parseFloat(value) >= curThresholdConfig["value"]) {
							match = true
						}
					} else if ((curThresholdConfig["type"] === "ge") && (Number.parseFloat(value) !== NaN)) {
						if (Number.parseFloat(value) >= curThresholdConfig["value"]) {
							match = true
						}
					}

					if (match) {
						if (typeof curThresholdConfig["valueIcon"] !== "undefined") {
							iconConfig = curThresholdConfig["valueIcon"]
						}

						if (typeof curThresholdConfig["valueImgIcon"] !== "undefined") {
							imgIconConfig = curThresholdConfig["valueImgIcon"]
						}

						if (typeof curThresholdConfig["classes"] !== "undefined") {
							curThresholdConfig["classes"].split(" ").forEach(element => thresholdClasses.push(element))
						}

						if (typeof curThresholdConfig["valuePositions"] !== "undefined") {
							positionsConfig = curThresholdConfig["valuePositions"]
						}
						break
					}
				}
			}
		}

		let valueElement = null
		if (positionsConfig.includes("v")) {
			valueElement = document.createElement(self.config["basicElementType"])
			console.log("Converting value: "+value+" to html!")
			valueElement.appendChild(self.htmlToElement(String(value)))
			valueElement.classList.add("value")
			additionalClasses.concat(thresholdClasses).forEach(element => valueElement.classList.add(element))
		}

		let iconElement = null
		if (positionsConfig.includes("i")) {
			if (imgIconConfig != null) {
				if (Array.isArray(imgIconConfig)) {
					iconElement = document.createElement(self.config["basicElementType"])
					iconElement.classList.add("valueImgIconWrapper")

					let idx = 0
					for (let curImgIconConfig of imgIconConfig) {
						let curIconElement = document.createElement("img")
						curIconElement.setAttribute("src", curImgIconConfig)
						curIconElement.classList.add("valueImgIcon")
						curIconElement.classList.add("valueImgIcon" + idx)
						additionalClasses.concat(thresholdClasses).forEach(element => curIconElement.classList.add(element))
						if (curImgIconConfig.endsWith(".svg")) {
							curIconElement.classList.add("valueSvgIcon")
						}
						iconElement.appendChild(curIconElement)
						idx += 1
					}
				} else {
					iconElement = document.createElement("img")
					iconElement.setAttribute("src", imgIconConfig)
					iconElement.classList.add("valueImgIcon")
					if (imgIconConfig.endsWith(".svg")) {
						iconElement.classList.add("valueSvgIcon")
					}
				}
				additionalClasses.concat(thresholdClasses).forEach(element => iconElement.classList.add(element))
			} else if (iconConfig != null) {
				if (Array.isArray(iconConfig)) {
					iconElement = document.createElement(self.config["basicElementType"])
					iconElement.classList.add("valueIconWrapper")
					additionalClasses.concat(thresholdClasses).forEach(element => iconElement.classList.add(element))
					let idx = 0
					for (let curIconConfig of iconConfig) {
						let curIconElement = null
						if(curGroupConfig.startsWith("fa ")){
							curIconElement = document.createElement("i")
							curIconElement.classes = curIconConfig
							curIconElement.setAttribute("aria-hidden", "true")
						} else {
							curIconElement = document.createElement("span")
							curIconElement.classList.add("iconify-inline")
							curIconElement.setAttribute("data-icon", curIconConfig)
						}

						curIconElement.classList.add("valueIcon")
						curIconElement.classList.add("valueIcon" + idx)
						curIconConfig.split(" ").forEach(element => curIconElement.classList.add(element))
						additionalClasses.concat(thresholdClasses).forEach(element => curIconElement.classList.add(element))
						iconElement.appendChild(curIconElement)
						idx += 1
					}
				} else {
					if(iconConfig.startsWith("fa ")){
						iconElement = document.createElement("i")
						iconElement.classes = iconConfig
						iconElement.setAttribute("aria-hidden", "true")
					} else {
						iconElement = document.createElement("span")
						iconElement.classList.add("iconify-inline")
						iconElement.setAttribute("data-icon", iconConfig)
					}
					iconElement.classList.add("valueIcon")
					iconConfig.split(" ").forEach(element => iconElement.classList.add(element))
					additionalClasses.concat(thresholdClasses).forEach(element => iconElement.classList.add(element))
				}
				additionalClasses.concat(thresholdClasses).forEach(element => iconElement.classList.add(element))
			}
		}

		let valueTitleElement = null
		if ((valueTitle != null) && (positionsConfig.includes("t"))) {
			valueTitleElement = document.createElement(self.config["basicElementType"])
			if (Array.isArray(valueTitle)) {
				valueTitleElement.classList.add("valueTitleWrapper")
				let idx = 0
				for (let curValueTitle of valueTitle) {
					let curValueTitleElement = document.createElement(self.config["basicElementType"])
					curValueTitleElement.appendChild(self.htmlToElement(String(curValueTitle)))
					curValueTitleElement.classList.add("valueTitle")
					curValueTitleElement.classList.add("valueTitle" + idx)
					additionalClasses.concat(thresholdClasses).forEach(element => curValueTitleElement.classList.add(element))
					valueTitleElement.appendChild(curValueTitleElement)
					idx += 1
				}
			} else {
				valueTitleElement.appendChild(self.htmlToElement(String(valueTitle)))
				valueTitleElement.classList.add("valueTitle")
			}

			additionalClasses.concat(thresholdClasses).forEach(element => valueTitleElement.classList.add(element))
		}

		let unitElement = null
		if ((valueUnitConfig != null) && (positionsConfig.includes("u"))) {
			unitElement = document.createElement(self.config["basicElementType"])
			if (unitSpace) {
				unitElement.appendChild(self.htmlToElement(String("&nbsp;" + valueUnitConfig)))
			}else{
				unitElement.appendChild(self.htmlToElement(String(valueUnitConfig)))
			}
			unitElement.classList.add("unit")
			additionalClasses.concat(thresholdClasses).forEach(element => unitElement.classList.add(element))
		}

		let atLeastOneAdded = false
		let curWrapperCount = 0
		let wrappers = []
		let curWrapper = valueWrapper
		let dummyCount = 0
		for (let posChar of positionsConfig) {
			if (posChar === "t") {
				if (valueTitleElement != null) {
					atLeastOneAdded = true
					curWrapper.appendChild(valueTitleElement)
				}
			} else if (posChar === "i") {
				if (iconElement != null) {
					atLeastOneAdded = true
					curWrapper.appendChild(iconElement)
				}
			} else if (posChar === "v") {
				if (valueElement != null) {
					atLeastOneAdded = true
					curWrapper.appendChild(valueElement)
				}
			} else if (posChar === "u") {
				if (unitElement != null) {
					atLeastOneAdded = true
					curWrapper.appendChild(unitElement)
				}
			} else if (posChar === "d") {
				let curDummyElement = document.createElement(self.config["basicElementType"])
				curDummyElement.classList.add("valueDummy")
				curDummyElement.classList.add("valueDummy"+dummyCount)
				additionalClasses.concat(thresholdClasses).forEach(element => curDummyElement.classList.add(element))
				dummyCount += 1
				curWrapper.appendChild(curDummyElement)
				atLeastOneAdded = true
			} else if (posChar === "[") {
				curWrapperCount += 1
				wrappers.push(curWrapper)
				let newWrapper = document.createElement(self.config["basicElementType"])
				newWrapper.classList.add(automaticWrapperClassPrefix + curWrapperCount)
				additionalClasses.concat(thresholdClasses).forEach(element => newWrapper.classList.add(element))
				curWrapper.appendChild(newWrapper)
				curWrapper = newWrapper
			} else if (posChar === "]") {
				curWrapper = wrappers.pop()
			} else {
				console.log("UNKNOWN CHARACTER")
			}
		}

		if (atLeastOneAdded === true) {
			if (self.config.addClassesRecursive){
				additionalClasses.forEach(element => valueWrapper.classList.add(element))
			}

			if (self.config.letClassesBubbleUp){
				thresholdClasses.forEach(element => valueWrapper.classList.add(element))
			}

			return [valueWrapper, thresholdClasses]
		} else {
			return [null, thresholdClasses]
		}
	},

	getItemDomElement: function (groupIdx, itemIdx) {
		const self = this
		let curGroupConfig = self.config["groups"][groupIdx]
		let curItemConfig
		if ((curGroupConfig["items"] !== "undefined") && (curGroupConfig["items"][itemIdx] !== "undefined")) {
			curItemConfig = curGroupConfig["items"][itemIdx]
		} else {
			curItemConfig = {}
		}

		let profilesConfig = self.config["profiles"]
		if (typeof curItemConfig["profiles"] !== "undefined") {
			profilesConfig = curItemConfig["profiles"]
		} else if (typeof curGroupConfig["profiles"] !== "undefined") {
			profilesConfig = curGroupConfig["profiles"]
		}

		if (profilesConfig != null) {
			if (!profilesConfig.includes(self.currentProfile)) {
				return [null,[]]
			}
		}

		let automaticWrapperClassPrefix = self.config["automaticWrapperClassPrefix"]
		if (typeof curItemConfig["automaticWrapperClassPrefix"] !== "undefined") {
			automaticWrapperClassPrefix = curItemConfig["automaticWrapperClassPrefix"]
		} else if (typeof curGroupConfig["automaticWrapperClassPrefix"] !== "undefined") {
			automaticWrapperClassPrefix = curGroupConfig["automaticWrapperClassPrefix"]
		}

		let additionalClasses = []
		if (self.config.addClassesRecursive) {
			if (self.config["classes"] != null) {
				self.config["classes"].split(" ").forEach(element => additionalClasses.push(element))
			}

			if ((typeof curGroupConfig["classes"] !== "undefined") && (curGroupConfig["classes"] != null)) {
				curGroupConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
			}
		}

		if ((typeof curItemConfig["classes"] !== "undefined") && (curItemConfig["classes"] != null)) {
			curItemConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
		}

		let iconConfig = null
		let imgIconConfig = null
		if (typeof curItemConfig["itemImgIcon"] !== "undefined") {
			imgIconConfig = curItemConfig["itemImgIcon"]
		} else if (typeof curItemConfig["itemIcon"] !== "undefined") {
			iconConfig = curItemConfig["itemIcon"]
		} else if (typeof curGroupConfig["itemImgIcon"] !== "undefined") {
			imgIconConfig = curGroupConfig["itemImgIcon"]
		} else if (typeof curGroupConfig["itemIcon"] !== "undefined") {
			iconConfig = curGroupConfig["itemIcon"]
		} else {
			iconConfig = self.config["itemIcon"]
			imgIconConfig = self.config["itemImgIcon"]
		}

		let positionsConfig = self.config["itemPositions"]
		if (typeof curItemConfig["itemPositions"] !== "undefined") {
			positionsConfig = curItemConfig["itemPositions"]
		} else if (typeof curGroupConfig["itemPositions"] !== "undefined") {
			positionsConfig = curGroupConfig["itemPositions"]
		}

		let itemTitle = self.config["itemTitle"]
		if (typeof curItemConfig["itemTitle"] !== "undefined") {
			itemTitle = curItemConfig["itemTitle"]
		} else if (typeof curGroupConfig["itemTitle"] !== "undefined") {
			itemTitle = curGroupConfig["itemTitle"]
		}

		let valueElements = []
		let bubbleClasses = []
		if (typeof curItemConfig["values"] !== "undefined") {
			for (let valueIdx = 0; valueIdx < curItemConfig["values"].length; valueIdx++) {
				let valueElement = self.getValueDomElement(groupIdx, itemIdx, valueIdx)
				if (valueElement[0] != null) {
					valueElements.push(valueElement[0])
				}
				bubbleClasses = bubbleClasses.concat(valueElement[1])
			}
		} else {
			let valueElement = self.getValueDomElement(groupIdx, itemIdx, null)
			if (valueElement[0] != null) {
				valueElements.push(valueElement[0])
			}
			bubbleClasses = bubbleClasses.concat(valueElement[1])
		}

		if (valueElements.length < 1) {
			return [null, bubbleClasses]
		} else {
			let itemWrapper = document.createElement(self.config["basicElementType"])
			itemWrapper.classList.add("itemWrapper")
			if (self.config.letClassesBubbleUp){
				bubbleClasses.forEach(element => itemWrapper.classList.add(element))
			}

			additionalClasses.forEach(element => itemWrapper.classList.add(element))

			let iconElement = null
			if (positionsConfig.includes("i")) {
				if (imgIconConfig != null) {
					if (Array.isArray(imgIconConfig)) {
						iconElement = document.createElement(self.config["basicElementType"])
						iconElement.classList.add("itemImgIconWrapper")

						let idx = 0
						for (let curImgIconConfig of imgIconConfig) {
							let curIconElement = document.createElement("img")
							curIconElement.setAttribute("src", curImgIconConfig)
							curIconElement.classList.add("itemImgIcon")
							curIconElement.classList.add("itemImgIcon" + idx)
							additionalClasses.forEach(element => curIconElement.classList.add(element))
							if (curImgIconConfig.endsWith(".svg")) {
								curIconElement.classList.add("itemSvgIcon")
							}
							iconElement.appendChild(curIconElement)
							idx += 1
						}
					} else {
						iconElement = document.createElement("img")
						iconElement.setAttribute("src", imgIconConfig)
						iconElement.classList.add("itemImgIcon")
						if (imgIconConfig.endsWith(".svg")) {
							iconElement.classList.add("itemSvgIcon")
						}
					}
					additionalClasses.forEach(element => iconElement.classList.add(element))
				} else if (iconConfig != null) {
					if (Array.isArray(iconConfig)) {
						iconElement = document.createElement(self.config["basicElementType"])
						iconElement.classList.add("itemIconWrapper")
						additionalClasses.forEach(element => iconElement.classList.add(element))
						let idx = 0
						for (let curIconConfig of iconConfig) {
							let curIconElement
							if(curIconConfig.startsWith("fa ")){
								curIconElement = document.createElement("i")
								curIconElement.classes = curIconConfig
								curIconElement.setAttribute("aria-hidden", "true")
							} else {
								curIconElement = document.createElement("span")
								curIconElement.classList.add("iconify-inline")
								curIconElement.setAttribute("data-icon", curIconConfig)
							}

							curIconElement.classList.add("itemIcon")
							curIconElement.classList.add("itemIcon" + idx)
							curIconConfig.split(" ").forEach(element => curIconElement.classList.add(element))
							additionalClasses.forEach(element => curIconElement.classList.add(element))

							iconElement.appendChild(curIconElement)
							idx += 1
						}
					} else {
						if(iconConfig.startsWith("fa ")){
							iconElement = document.createElement("i")
							iconElement.classes = iconConfig
							iconElement.setAttribute("aria-hidden", "true")
						} else {
							iconElement = document.createElement("span")
							iconElement.classList.add("iconify-inline")
							iconElement.setAttribute("data-icon", iconConfig)
						}

						iconElement.classList.add("itemIcon")
						iconConfig.split(" ").forEach(element => iconElement.classList.add(element))
						additionalClasses.forEach(element => iconElement.classList.add(element))
					}
					additionalClasses.forEach(element => iconElement.classList.add(element))
				}
			}

			let itemTitleElement = null
			if (itemTitle != null) {
				itemTitleElement = document.createElement(self.config["basicElementType"])
				if (Array.isArray(itemTitle)) {
					itemTitleElement.classList.add("itemTitleWrapper")
					let idx = 0
					for (let curItemTitle of itemTitle) {
						let curItemTitleElement = document.createElement(self.config["basicElementType"])
						curItemTitleElement.appendChild(self.htmlToElement(String(curItemTitle)))
						curItemTitleElement.classList.add("itemTitle")
						curItemTitleElement.classList.add("itemTitle" + idx)
						if (self.config.addClassesRecursive) {
							additionalClasses.forEach(element => curItemTitleElement.classList.add(element))
						}
						itemTitleElement.appendChild(curItemTitleElement)
						idx += 1
					}
				} else {
					itemTitleElement.classList.add("itemTitle")
					if (self.config.addClassesRecursive) {
						additionalClasses.forEach(element => itemTitleElement.classList.add(element))
					}
					itemTitleElement.appendChild(self.htmlToElement(String(itemTitle)))
				}
			}

			let valuesWrapper = document.createElement(self.config["basicElementType"])
			valuesWrapper.classList.add("valuesWrapper")
			if (self.config.addClassesRecursive) {
				additionalClasses.forEach(element => valuesWrapper.classList.add(element))
			}

			if (self.config.letClassesBubbleUp){
				bubbleClasses.forEach(element => valuesWrapper.classList.add(element))
			}

			for (let elementIdx = 0; elementIdx < valueElements.length; elementIdx++) {
				valuesWrapper.appendChild(valueElements[elementIdx])
			}

			let curWrapperCount = 0
			let wrappers = []
			let curWrapper = itemWrapper
			let dummyCount = 0
			for (let posChar of positionsConfig) {
				if (posChar === "t") {
					if (itemTitleElement != null) {
						curWrapper.appendChild(itemTitleElement)
					}
				} else if (posChar === "i") {
					if (iconElement != null) {
						curWrapper.appendChild(iconElement)
					}
				} else if (posChar === "d") {
					let curDummyElement = document.createElement(self.config["basicElementType"])
					curDummyElement.classList.add("itemDummy")
					curDummyElement.classList.add("itemDummy"+dummyCount)
					dummyCount += 1
					curWrapper.appendChild(curDummyElement)
				} else if (posChar === "e") {
					curWrapper.appendChild(valuesWrapper)
				} else if (posChar === "[") {
					curWrapperCount += 1
					wrappers.push(curWrapper)
					let newWrapper = document.createElement(self.config["basicElementType"])
					newWrapper.classList.add(automaticWrapperClassPrefix + curWrapperCount)
					curWrapper.appendChild(newWrapper)
					curWrapper = newWrapper
				} else if (posChar === "]") {
					curWrapper = wrappers.pop()
				} else {
					console.log("UNKNOWN CHARACTER")
				}
			}

			return [itemWrapper, bubbleClasses]
		}
	},

	getGroupDomElement: function (groupIdx) {
		const self = this
		let curGroupConfig = self.config["groups"][groupIdx]
		let profilesConfig = self.config.profiles
		if (typeof curGroupConfig["profiles"] !== "undefined") {
			profilesConfig = curGroupConfig["profiles"]
		}

		if (profilesConfig != null) {
			if (!profilesConfig.includes(self.currentProfile)) {
				return [null,[]]
			}
		}

		let automaticWrapperClassPrefix = self.config["automaticWrapperClassPrefix"]
		if (typeof curGroupConfig["automaticWrapperClassPrefix"] !== "undefined") {
			automaticWrapperClassPrefix = curGroupConfig["automaticWrapperClassPrefix"]
		}

		let additionalClasses = []
		if (self.config.addClassesRecursive) {
			if (self.config["classes"] != null) {
				self.config["classes"].split(" ").forEach(element => additionalClasses.push(element))
			}
		}

		if ((typeof curGroupConfig["classes"] !== "undefined") && (curGroupConfig["classes"] != null)) {
			curGroupConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
		}

		let iconConfig = null
		let imgIconConfig = null
		if (typeof curGroupConfig["groupImgIcon"] !== "undefined") {
			imgIconConfig = curGroupConfig["groupImgIcon"]
		} else if (typeof curGroupConfig["groupIcon"] !== "undefined") {
			iconConfig = curGroupConfig["groupIcon"]
		} else {
			iconConfig = self.config["groupIcon"]
			imgIconConfig = self.config["groupImgIcon"]
		}

		let positionsConfig = self.config["groupPositions"]
		if (typeof curGroupConfig["groupPositions"] !== "undefined") {
			positionsConfig = curGroupConfig["groupPositions"]
		}

		let itemElements = []
		let bubbleClasses = []
		for (let itemIdx = 0; itemIdx < curGroupConfig["items"].length; itemIdx++) {
			let itemElement = self.getItemDomElement(groupIdx, itemIdx)
			if (itemElement[0] != null) {
				itemElements.push(itemElement[0])
			}
			bubbleClasses = bubbleClasses.concat(itemElement[1])
		}

		if (itemElements.length < 1) {
			return [null, bubbleClasses]
		} else {
			let groupWrapper = document.createElement(self.config["basicElementType"])
			groupWrapper.classList.add("groupWrapper")
			if (self.config.letClassesBubbleUp){
				bubbleClasses.forEach(element => groupWrapper.classList.add(element))
			}

			additionalClasses.forEach(element => groupWrapper.classList.add(element))

			let iconElement = null
			if (positionsConfig.includes("i")) {
				if (imgIconConfig != null) {
					if (Array.isArray(imgIconConfig)) {
						iconElement = document.createElement(self.config["basicElementType"])
						iconElement.classList.add("groupImgIconWrapper")

						let idx = 0
						for (let curImgIconConfig of imgIconConfig) {
							let curIconElement = document.createElement("img")
							curIconElement.setAttribute("src", curImgIconConfig)
							curIconElement.classList.add("groupImgIcon")
							curIconElement.classList.add("groupImgIcon" + idx)
							additionalClasses.forEach(element => curIconElement.classList.add(element))
							if (curImgIconConfig.endsWith(".svg")) {
								curIconElement.classList.add("groupSvgIcon")
							}
							iconElement.appendChild(curIconElement)
							idx += 1
						}
					} else {
						iconElement = document.createElement("img")
						iconElement.setAttribute("src", imgIconConfig)
						iconElement.classList.add("groupImgIcon")
						if (imgIconConfig.endsWith(".svg")) {
							iconElement.classList.add("groupSvgIcon")
						}
					}
					additionalClasses.forEach(element => iconElement.classList.add(element))
				} else if (iconConfig != null) {
					if (Array.isArray(iconConfig)) {
						iconElement = document.createElement(self.config["basicElementType"])
						iconElement.classList.add("groupIconWrapper")
						additionalClasses.forEach(element => iconElement.classList.add(element))
						let idx = 0
						for (let curIconConfig of iconConfig) {
							let curIconElement
							if(curIconConfig.startsWith("fa ")){
								curIconElement = document.createElement("i")
								curIconElement.classes = curIconConfig
								curIconElement.setAttribute("aria-hidden", "true")
							} else {
								curIconElement = document.createElement("span")
								curIconElement.classList.add("iconify-inline")
								curIconElement.setAttribute("data-icon", curIconConfig)
							}

							curIconElement.classList.add("groupIcon")
							curIconElement.classList.add("groupIcon" + idx)
							curIconConfig.split(" ").forEach(element => curIconElement.classList.add(element))
							additionalClasses.forEach(element => curIconElement.classList.add(element))
							iconElement.appendChild(curIconElement)
							idx += 1
						}
					} else {
						if(iconConfig.startsWith("fa ")){
							iconElement = document.createElement("i")
							iconElement.classes = iconConfig
							iconElement.setAttribute("aria-hidden", "true")
						} else {
							iconElement = document.createElement("span")
							iconElement.classList.add("iconify-inline")
							iconElement.setAttribute("data-icon", iconConfig)
						}
						iconElement.classList.add("groupIcon")
						iconConfig.split(" ").forEach(element => iconElement.classList.add(element))
						additionalClasses.forEach(element => iconElement.classList.add(element))
					}
					additionalClasses.forEach(element => iconElement.classList.add(element))
				}
			}

			let groupTitle = self.config["groupTitle"]
			if (typeof curGroupConfig["groupTitle"] !== "undefined") {
				groupTitle = curGroupConfig["groupTitle"]
			}

			let groupTitleElement = null
			if (groupTitle != null) {
				groupTitleElement = document.createElement(self.config["basicElementType"])

				if (Array.isArray(groupTitle)) {
					groupTitleElement.classList.add("groupTitleWrapper")
					let idx = 0
					for (let curGroupTitle of groupTitle) {
						let curGroupTitleElement = document.createElement(self.config["basicElementType"])
						curGroupTitleElement.appendChild(self.htmlToElement(String(curGroupTitle)))
						curGroupTitleElement.classList.add("groupTitle")
						curGroupTitleElement.classList.add("groupTitle" + idx)
						if (self.config.addClassesRecursive) {
							additionalClasses.forEach(element => curGroupTitleElement.classList.add(element))
						}
						groupTitleElement.appendChild(curGroupTitleElement)
						idx += 1
					}
				} else {
					groupTitleElement.classList.add("groupTitle")
					if (self.config.addClassesRecursive) {
						additionalClasses.forEach(element => groupTitleElement.classList.add(element))
					}
					groupTitleElement.appendChild(self.htmlToElement(String(groupTitle)))
				}
			}

			let itemsWrapper = document.createElement(self.config["basicElementType"])
			itemsWrapper.classList.add("itemsWrapper")
			if (self.config.addClassesRecursive) {
				additionalClasses.forEach(element => itemsWrapper.classList.add(element))
			}

			for (let elementIdx = 0; elementIdx < itemElements.length; elementIdx++) {
				itemsWrapper.appendChild(itemElements[elementIdx])
			}

			let curWrapperCount = 0
			let wrappers = []
			let curWrapper = groupWrapper
			let dummyCount = 0
			for (let posChar of positionsConfig) {
				if (posChar === "t") {
					if (groupTitleElement != null) {
						curWrapper.appendChild(groupTitleElement)
					}
				} else if (posChar === "i") {
					if (iconElement != null) {
						curWrapper.appendChild(iconElement)
					}
				} else if (posChar === "d") {
					let curDummyElement = document.createElement(self.config["basicElementType"])
					curDummyElement.classList.add("groupDummy")
					curDummyElement.classList.add("groupDummy"+dummyCount)
					dummyCount += 1
					curWrapper.appendChild(curDummyElement)
				} else if (posChar === "e") {
					curWrapper.appendChild(itemsWrapper)
				} else if (posChar === "[") {
					curWrapperCount += 1
					wrappers.push(curWrapper)
					let newWrapper = document.createElement(self.config["basicElementType"])
					newWrapper.classList.add(automaticWrapperClassPrefix + curWrapperCount)
					curWrapper.appendChild(newWrapper)
					curWrapper = newWrapper
				} else if (posChar === "]") {
					curWrapper = wrappers.pop()
				} else {
					console.log("UNKNOWN CHARACTER")
				}
			}

			return [groupWrapper, bubbleClasses]
		}
	},

	getGroupsDomElement: function () {
		const self = this
		let curGroupsConfig = self.config.groups
		let profilesConfig = self.config.profiles

		if (profilesConfig != null) {
			if (!profilesConfig.includes(self.currentProfile)) {
				return [null,[]]
			}
		}

		let additionalClasses = []
		if (self.config["classes"] != null) {
			self.config["classes"].split(" ").forEach(element => additionalClasses.push(element))
		}

		let iconConfig = self.config["groupsIcon"]
		let imgIconConfig = self.config["groupsImgIcon"]
		let positionsConfig = self.config["groupsPositions"]
		let groupsTitle = self.config["groupsTitle"]

		let iconElement = null
		if (positionsConfig.includes("i")) {
			if (imgIconConfig != null) {
				if (Array.isArray(imgIconConfig)) {
					iconElement = document.createElement(self.config["basicElementType"])
					iconElement.classList.add("groupsImgIconWrapper")

					let idx = 0
					for (let curImgIconConfig of imgIconConfig) {
						let curIconElement = document.createElement("img")
						curIconElement.setAttribute("src", curImgIconConfig)
						curIconElement.classList.add("groupsImgIcon")
						curIconElement.classList.add("groupsImgIcon" + idx)
						additionalClasses.forEach(element => curIconElement.classList.add(element))
						if (curImgIconConfig.endsWith(".svg")) {
							curIconElement.classList.add("groupsSvgIcon")
						}
						iconElement.appendChild(curIconElement)
						idx += 1
					}
				} else {
					iconElement = document.createElement("img")
					iconElement.setAttribute("src", imgIconConfig)
					iconElement.classList.add("groupsImgIcon")
					if (imgIconConfig.endsWith(".svg")) {
						iconElement.classList.add("groupsSvgIcon")
					}
				}
				additionalClasses.forEach(element => iconElement.classList.add(element))
			} else if (iconConfig != null) {
				if (Array.isArray(iconConfig)) {
					iconElement = document.createElement(self.config["basicElementType"])
					iconElement.classList.add("groupsIconWrapper")
					additionalClasses.forEach(element => iconElement.classList.add(element))
					let idx = 0
					for (let curIconConfig of iconConfig) {
						let curIconElement = document.createElement("i")
						curIconElement.classes = curIconConfig
						curIconElement.classList.add("groupsIcon")
						curIconElement.classList.add("groupsIcon" + idx)
						curIconConfig.split(" ").forEach(element => curIconElement.classList.add(element))
						additionalClasses.forEach(element => curIconElement.classList.add(element))
						curIconElement.setAttribute("aria-hidden", "true")
						iconElement.appendChild(curIconElement)
						idx += 1
					}
				} else {
					iconElement = document.createElement("i")
					iconElement.classes = iconConfig
					iconElement.classList.add("groupsIcon")
					iconConfig.split(" ").forEach(element => iconElement.classList.add(element))
					additionalClasses.forEach(element => iconElement.classList.add(element))
					iconElement.setAttribute("aria-hidden", "true")
				}
				additionalClasses.forEach(element => iconElement.classList.add(element))
			}
		}

		let groupsTitleElement = null
		if (groupsTitle != null) {
			groupsTitleElement = document.createElement(self.config["basicElementType"])

			if (Array.isArray(groupsTitle)) {
				groupsTitleElement.classList.add("groupsTitleWrapper")
				let idx = 0
				for (let curGroupsTitle of groupsTitle) {
					let curGroupsTitleElement = document.createElement(self.config["basicElementType"])
					curGroupsTitleElement.appendChild(self.htmlToElement(String(curGroupsTitle)))
					curGroupsTitleElement.classList.add("groupsTitle")
					curGroupsTitleElement.classList.add("groupsTitle" + idx)
					if (self.config.addClassesRecursive) {
						additionalClasses.forEach(element => curGroupsTitleElement.classList.add(element))
					}
					groupsTitleElement.appendChild(curGroupsTitleElement)
					idx += 1
				}
			} else {
				groupsTitleElement.classList.add("groupTitle")
				if (self.config.addClassesRecursive) {
					additionalClasses.forEach(element => groupsTitleElement.classList.add(element))
				}
				groupsTitleElement.appendChild(self.htmlToElement(String(groupsTitle)))
			}
		}

		let groupElements = []
		let bubbleClasses = []
		for (let groupIdx = 0; groupIdx < curGroupsConfig.length; groupIdx++) {
			let groupElement = self.getGroupDomElement(groupIdx)
			if (groupElement[0] != null) {
				groupElements.push(groupElement[0])
			}
			bubbleClasses = bubbleClasses.concat(groupElement[1])
		}

		let groupsWrapper = document.createElement(self.config["basicElementType"])
		groupsWrapper.classList.add("groupsWrapper")

		if (self.config.letClassesBubbleUp){
			bubbleClasses.forEach(element => groupsWrapper.classList.add(element))
		}

		additionalClasses.forEach(element => groupsWrapper.classList.add(element))

		let curWrapperCount = 0
		let wrappers = []
		let curWrapper = groupsWrapper
		let dummyCount = 0
		for (let posChar of positionsConfig) {
			if (posChar === "t") {
				if (groupsTitleElement != null) {
					curWrapper.appendChild(groupsTitleElement)
				}
			} else if (posChar === "i") {
				if (iconElement != null) {
					curWrapper.appendChild(iconElement)
				}
			} else if (posChar === "d") {
				let curDummyElement = document.createElement(self.config["basicElementType"])
				curDummyElement.classList.add("groupDummy")
				curDummyElement.classList.add("groupDummy"+dummyCount)
				dummyCount += 1
				curWrapper.appendChild(curDummyElement)
			} else if (posChar === "e") {
				for (let elementIdx = 0; elementIdx < groupElements.length; elementIdx++) {
					curWrapper.appendChild(groupElements[elementIdx])
				}
			} else if (posChar === "[") {
				curWrapperCount += 1
				wrappers.push(curWrapper)
				let newWrapper = document.createElement(self.config["basicElementType"])
				newWrapper.classList.add(automaticWrapperClassPrefix + curWrapperCount)
				curWrapper.appendChild(newWrapper)
				curWrapper = newWrapper
			} else if (posChar === "]") {
				curWrapper = wrappers.pop()
			} else {
				console.log("UNKNOWN CHARACTER")
			}
		}

		return [groupsWrapper, bubbleClasses]
	},

	getDom: function () {
		const self = this
		let wrapper = document.createElement(self.config["basicElementType"])
		wrapper.classList.add("vbn")
		wrapper.classList.add("groups")
		if (self.config["classes"] != null) {
			self.config["classes"].split(" ").forEach(element => wrapper.classList.add(element))
		}
		let groupsElement = self.getGroupsDomElement()
		if (groupsElement[0] != null) {
			wrapper.appendChild(groupsElement[0])
		}

		if (self.config.letClassesBubbleUp){
			groupsElement[1].forEach(element => wrapper.classList.add(element))
		}

		return wrapper
	},

	start: function () {
		const self = this
		self.currentProfile = null
		self.sensorsSortedByNotification = {}

		//building a structure which holds the current values based on the notification
		//this way we can set the values directly if an notification is received rather than
		//iterating through all groups and items each time

		for (let groupIdx = 0; groupIdx < self.config.groups.length; groupIdx++) {
			let curGroup = self.config.groups[groupIdx]
			for (let itemIdx = 0; itemIdx < curGroup.items.length; itemIdx++) {
				let curItem = curGroup.items[itemIdx]
				if (typeof curItem["notification"]) {
					let curNotifcation = curItem["notification"]
					let curNotifcationPrefix = self.config.notificationPrefix
					if (typeof curItem["notificationPrefix"] !== "undefined") {
						curNotifcationPrefix = curItem["notificationPrefix"]
					} else if (typeof curGroup["notificationPrefix"] !== "undefined") {
						curNotifcationPrefix = curGroup["notificationPrefix"]
					}
					let curReuseCount = self.config["reuseCount"]
					//either use global reuse value or the one set for this item
					if (typeof curItem["reuseCount"] !== "undefined") {
						curReuseCount = curItem["reuseCount"]
					}


					let curNotificationElement = {}
					if (typeof self.sensorsSortedByNotification[curNotifcationPrefix + curNotifcation] !== "undefined") {
						curNotificationElement = self.sensorsSortedByNotification[curNotifcationPrefix + curNotifcation]
					}

					let curGroupElement = {}
					if (typeof curNotificationElement[groupIdx] !== "undefined") {
						curGroupElement = curNotificationElement[groupIdx]
					}

					let curItemElement = {
						"reuseCount": curReuseCount,
					}

					curGroupElement[itemIdx] = curItemElement
					curNotificationElement[groupIdx] = curGroupElement
					self.sensorsSortedByNotification[curNotifcationPrefix + curNotifcation] = curNotificationElement
				}
			}
		}
		this.sendSocketNotification("CONFIG", this.config);

		self.resetTimer()
	},

	resetTimer: function () {
		const self = this
		if (self.refreshTimer) {
			clearTimeout(self.refreshTimer)
			refreshTimer = null
		}
		self.refreshTimer = setTimeout(() => {
			self.resetTimer()
		}, self.config.updateInterval * 1000)

		if (!self.hidden) {
			self.updateDom(self.config.animationSpeed)
		}

		for (let key in self.sensorsSortedByNotification) {
			self.sensorsSortedByNotification[key]["currentUses"] = self.sensorsSortedByNotification[key]["currentUses"] + 1
		}
	},

	//https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
	tryParseJSONObject: function (jsonString) {
		try {
			var o = JSON.parse(jsonString);

			// Handle non-exception-throwing cases:
			// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
			// but... JSON.parse(null) returns null, and typeof null === "object",
			// so we must check for that, too. Thankfully, null is falsey, so this suffices:
			if (o && typeof o === "object") {
				return o;
			}
		}
		catch (e) { }

		return false;
	},

	notificationReceived: function (notification, payload) {
		const self = this
		if (notification === "CHANGED_PROFILE") {
			self.currentProfile = payload.to
		} else if (typeof self.sensorsSortedByNotification[notification] !== "undefined") {
			let curNotificationItem = self.sensorsSortedByNotification[notification]
			curNotificationItem["currentUses"] = 0
			curNotificationItem["isJSON"] = false
			parsedPayload = self.tryParseJSONObject(payload)
			if (!parsedPayload) {
				parsedPayload = payload
			} else {
				curNotificationItem["isJSON"] = true
			}

			curNotificationItem["currentRawValue"] = parsedPayload
		}
	},

	socketNotificationReceived: function (notification, payload) {
		const self = this
	},
})
