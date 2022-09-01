/* global Module

/* Magic Mirror²
 * Module: ValuesByNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */  
Module.register('MMM-ValuesByNotification', {

  defaults: {
    animationSpeed: 500,
    positions: "ti[vu]",
    reuseCount: 1,
    naValue: "na",
    valueTitle: null,
		itemTitle: null,
		groupTitle: null,
    classes: null,
    icon: null,
    valueUnit: null,
    valueFormat: "{value}",
    thresholds: null,
    groups: [],
    notificationPrefix: "",
    profiles: null
  },
  
  suspend: function() {
    const self = this
  },

  resume: function() {
    const self = this
    self.updateDom()
  },

  
  getScripts: function () {
		return [this.file('node_modules/jsonpath-plus/dist/index-browser-umd.js')];
	},
  

  getStyles: function() {
    return ['font-awesome.css', 'valuesByNotification.css']
  },

  getValueDomElement: function(groupIdx, itemIdx, valueIdx){
    const self = this
    let curGroupConfig = self.config["groups"][groupIdx]
    let curItemConfig = curGroupConfig["items"][itemIdx]
    let curValueConfig = null
    if (typeof curItemConfig["values"] != "undefined"){
      curValueConfig = curItemConfig["values"][valueIdx]
    } else {
      curValueConfig = {}
    }

    let profilesConfig = self.config["profiles"]
    if (typeof curValueConfig["profiles"] !== "undefined"){
      profilesConfig = curValueConfig["profiles"]
    } else if (typeof curItemConfig["profiles"] !== "undefined"){
      profilesConfig = curItemConfig["profiles"]
    } else if (typeof curGroupConfig["profiles"] !== "undefined"){
      profilesConfig = curGroupConfig["profiles"]
    }

    if (profilesConfig != null){
      if (!profilesConfig.includes(self.currentProfile)){
        return null
      }
    }

    let valueWrapper = document.createElement("div")
    valueWrapper.classList.add("valueWrapper")

    let curNotifcationPrefix = self.config.notificationPrefix
    if (typeof curItemConfig["notificationPrefix"] !== "undefined"){
      curNotifcationPrefix = curItemConfig["notificationPrefix"]
    } else if (typeof curGroupConfig["notificationPrefix"] !== "undefined"){
      curNotifcationPrefix = curGroupConfig["notificationPrefix"]
    }

    let curNotification = curNotifcationPrefix+curItemConfig["notification"]
    let curNotifcationObj = self.sensorsSortedByNotification[curNotification]

    let valueTitle = self.config["valueTitle"]
    if(typeof curValueConfig["valueTitle"] !== "undefined"){
      valueTitle = curValueConfig["valueTitle"]
    } else if (typeof curItemConfig["valueTitle"] !== "undefined"){
      valueTitle = curItemConfig["valueTitle"]
    } else if (typeof curGroupConfig["valueTitle"] !== "undefined"){
      valueTitle = curGroupConfig["valueTitle"]
    }

    let iconConfig = self.config["icon"]
    if(typeof curValueConfig["icon"] !== "undefined"){
      iconConfig = curValueConfig["icon"]
    }

    let positionsConfig = self.config["positions"]
    if(typeof curValueConfig["positions"] !== "undefined"){
      positionsConfig = curValueConfig["positions"]
    } else if (typeof curItemConfig["positions"] !== "undefined"){
      positionsConfig = curItemConfig["positions"]
    }

    let valueFormatConfig = self.config["valueFormat"]
    if(typeof curValueConfig["valueFormat"] !== "undefined"){
      valueFormatConfig = curValueConfig["valueFormat"]
    } else if (typeof curItemConfig["valueFormat"] !== "undefined"){
      valueFormatConfig = curItemConfig["valueFormat"]
    }

    let valueUnitConfig = self.config["valueUnit"]
    if(typeof curValueConfig["valueUnit"] !== "undefined"){
      valueUnitConfig = curValueConfig["valueUnit"]
    } else if (typeof curItemConfig["valueUnit"] !== "undefined"){
      valueUnitConfig = curItemConfig["valueUnit"]
    }

    let naValueConfig = self.config["naValue"]
    if(typeof curValueConfig["naValue"] !== "undefined"){
      naValueConfig = curValueConfig["naValue"]
    } else if (typeof curItemConfig["naValue"] !== "undefined"){
      naValueConfig = curItemConfig["naValue"]
    }

    let thresholdsConfig = self.config["thresholds"]
    if(typeof curValueConfig["thresholds"] !== "undefined"){
      thresholdsConfig = curValueConfig["thresholds"]
    } else if (typeof curItemConfig["thresholds"] !== "undefined"){
      thresholdsConfig = curItemConfig["thresholds"]
    }

    let jsonpathConfig = self.config["jsonpath"]
    if(typeof curValueConfig["jsonpath"] !== "undefined"){
      jsonpathConfig = curValueConfig["jsonpath"]
    } else if (typeof curItemConfig["jsonpath"] !== "undefined"){
      jsonpathConfig = curItemConfig["jsonpath"]
    }

    let additionalClasses = []
    if(self.config["classes"] != null){
      self.config["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    if((typeof curGroupConfig["classes"] !== "undefined") && (curGroupConfig["classes"] != null)){
      curGroupConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    if((typeof curItemConfig["classes"] !== "undefined") && (curItemConfig["classes"] != null)){
      curItemConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    if((typeof curValueConfig["classes"] !== "undefined") && (curValueConfig["classes"] != null)){
      curValueConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    let value = curNotifcationObj["currentRawValue"]

    if ((typeof value === "undefined") || (curNotifcationObj["currentUses"] > curNotifcationObj[groupIdx][itemIdx]["reuseCount"])) {
      value = naValueConfig
      additionalClasses.push("naValue")
    } else {
      if(jsonpathConfig != null){
        value = JSONPath.JSONPath({path: jsonpathConfig, json: value});
      }

      value = eval(eval("`"+valueFormatConfig+"`"))
    }

    console.log("VALUE: "+value)
      console.log("THRESHOLDS: "+JSON.stringify(thresholdsConfig))
    
    if (thresholdsConfig != null) {
      for(let thresholdIdx = 0; thresholdIdx < thresholdsConfig.length; thresholdIdx++){
        let curThresholdConfig = thresholdsConfig[thresholdIdx]
        if(typeof curThresholdConfig.type !== "undefined"){
          if (curThresholdConfig.type === "eq"){
            if(value === curThresholdConfig["value"]){
              if (typeof curThresholdConfig["icon"] !== "undefined"){
                iconConfig = curThresholdConfig["icon"]
              }
              if (typeof curThresholdConfig["classes"] !== "undefined"){
                curThresholdConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
              }
              break
            }
          } else if((curThresholdConfig["type"] === "lt") && (Number.parseFloat(value) !== NaN)){
            if(Number.parseFloat(value) < curThresholdConfig["value"]){
              if (typeof curThresholdConfig["icon"] !== "undefined"){
                iconConfig = curThresholdConfig["icon"]
              }
              if (typeof curThresholdConfig["classes"] !== "undefined"){
                curThresholdConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
              }
              break
            }
          } else if((curThresholdConfig["type"] === "gt") && (Number.parseFloat(value) !== NaN)){
            if(Number.parseFloat(value) > curThresholdConfig["value"]){
              if (typeof curThresholdConfig["icon"] !== "undefined"){
                iconConfig = curThresholdConfig["icon"]
              }
              if (typeof curThresholdConfig["classes"] !== "undefined"){
                curThresholdConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
              }
              break
            }
          }
        }
      }
    }

    console.log("ADDITONAL_CLASSES: "+JSON.stringify(additionalClasses))
    

    let valueElement = null
    if (positionsConfig.includes("v")){
      valueElement = document.createElement("div")
      valueElement.classList.add("value")
      additionalClasses.forEach(element => valueElement.classList.add(element))
      valueElement.innerHTML = value
    }

    let iconElement = null
    if (iconConfig != null){
      iconElement = document.createElement("i")
      iconElement.classes = iconConfig
      iconElement.classList.add("icon")
      iconConfig.split(" ").forEach(element => iconElement.classList.add(element))
      additionalClasses.forEach(element => iconElement.classList.add(element))
      iconElement.setAttribute("aria-hidden", "true")
    }

    let valueTitleElement = null
    if (valueTitle != null){
      valueTitleElement = document.createElement("div")
      valueTitleElement.classList.add("valueTitle")
      additionalClasses.forEach(element => valueTitleElement.classList.add(element))
      valueTitleElement.innerHTML = valueTitle
    }

    let unitElement = null
    if (valueUnitConfig != null){
      unitElement = document.createElement("div")
      unitElement.classList.add("unit")
      additionalClasses.forEach(element => unitElement.classList.add(element))
      unitElement.innerHTML = valueUnitConfig
    }

    let atLeastOneAdded = false
    let curWrapperCount = 0
    let wrappers = []
    let curWrapper = valueWrapper
    for (let posChar of positionsConfig) {
      if(posChar === "t"){
        if (valueTitleElement != null){
          atLeastOneAdded = true
          curWrapper.appendChild(valueTitleElement)
        }
      } else if (posChar === "i"){
        if (iconElement != null){
          atLeastOneAdded = true
          curWrapper.appendChild(iconElement)
        }
      } else if (posChar === "v"){
        if (valueElement != null){
          atLeastOneAdded = true
          curWrapper.appendChild(valueElement)
        }
      } else if (posChar === "u"){
        if (unitElement != null){
          atLeastOneAdded = true
          curWrapper.appendChild(unitElement)
        }
      } else if (posChar === "["){
        curWrapperCount += 1
        wrappers.push(curWrapper)
        let newWrapper = document.createElement("div")
          newWrapper.classList.add("wrap"+curWrapperCount)
        curWrapper.appendChild(newWrapper)
        curWrapper = newWrapper        
      } else if (posChar === "]"){
        curWrapper = wrappers.pop()
      } else {
        console.log("UNKNOWN CHARACTER")
      }
    }

    if (atLeastOneAdded === true){
      additionalClasses.forEach(element => valueWrapper.classList.add(element))
      return valueWrapper
    } else {
      return null
    }
  },

  getItemDomElement: function(groupIdx, itemIdx){
    const self = this
    let curGroupConfig = self.config["groups"][groupIdx]
    let curItemConfig = curGroupConfig["items"][itemIdx]

    let profilesConfig = self.config["profiles"]
    if (typeof curItemConfig["profiles"] !== "undefined"){
      profilesConfig = curItemConfig["profiles"]
    } else if (typeof curGroupConfig["profiles"] !== "undefined"){
      profilesConfig = curGroupConfig["profiles"]
    }

    if (profilesConfig != null){
      if (!profilesConfig.includes(self.currentProfile)){
        return null
      }
    }

    let additionalClasses = []
    if(self.config["classes"] != null){
      self.config["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    if((typeof curGroupConfig["classes"] !== "undefined") && (curGroupConfig["classes"] != null)){
      curGroupConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    if((typeof curItemConfig["classes"] !== "undefined") && (curItemConfig["classes"] != null)){
      curItemConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    let itemTitle = self.config["itemTitle"]
    if(typeof curItemConfig["itemTitle"] !== "undefined"){
      itemTitle = curItemConfig["itemTitle"]
    } else if (typeof curGroupConfig["itemTitle"] !== "undefined"){
      itemTitle = curGroupConfig["itemTitle"]
    }

    let valueElements = []
    if (typeof curItemConfig["values"] !== "undefined"){
      for(let valueIdx = 0; valueIdx < curItemConfig["values"].length; valueIdx++){
        let valueElement = self.getValueDomElement(groupIdx, itemIdx, valueIdx)
        if(valueElement != null){
          valueElements.push(valueElement)
        }
      }
    } else {
      let valueElement = self.getValueDomElement(groupIdx, itemIdx, null)
      if(valueElement != null){
        valueElements.push(valueElement)
      }
    }

    if (valueElements.length < 1){
      return null
    } else {
      let itemWrapper = document.createElement("div")
      itemWrapper.classList.add("itemWrapper")
      additionalClasses.forEach(element => itemWrapper.classList.add(element))

      if (itemTitle != null){
        let itemTitleElement = null
        itemTitleElement = document.createElement("div")
        itemTitleElement.classList.add("itemTitle")
        additionalClasses.forEach(element => itemTitleElement.classList.add(element))
        itemTitleElement.innerHTML = itemTitle

        itemWrapper.appendChild(itemTitleElement)
      }

      let valuesWrapper = document.createElement("div")
      itemWrapper.appendChild(valuesWrapper)
      valuesWrapper.classList.add("valuesWrapper")
      additionalClasses.forEach(element => valuesWrapper.classList.add(element))

      for(let elementIdx = 0; elementIdx < valueElements.length; elementIdx++){
        valuesWrapper.appendChild(valueElements[elementIdx])
      }
      return itemWrapper
    }
  },

  getGroupDomElement: function(groupIdx){
    const self = this
    let curGroupConfig = self.config["groups"][groupIdx]
    let profilesConfig = self.config.profiles
    if (typeof curGroupConfig["profiles"] !== "undefined"){
      profilesConfig = curGroupConfig["profiles"]
    }

    if (profilesConfig != null){
      if (!profilesConfig.includes(self.currentProfile)){
        return null
      }
    }

    let additionalClasses = []
    if(self.config["classes"] != null){
      self.config["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    if((typeof curGroupConfig["classes"] !== "undefined") && (curGroupConfig["classes"] != null)){
      curGroupConfig["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    let itemElements = []
    for(let itemIdx = 0; itemIdx < curGroupConfig["items"].length; itemIdx++){
      let itemElement = self.getItemDomElement(groupIdx, itemIdx)
      if(itemElement != null){
        itemElements.push(itemElement)
      }
    }

    if (itemElements.length < 1){
      return null
    } else {
      let groupWrapper = document.createElement("div")
      groupWrapper.classList.add("groupWrapper")
      additionalClasses.forEach(element => groupWrapper.classList.add(element))

      let groupTitle = self.config["groupTitle"]
      if(typeof curGroupConfig["groupTitle"] !== "undefined"){
        groupTitle = curGroupConfig["groupTitle"]
      }

      if (groupTitle != null){
        let groupTitleElement = null
        groupTitleElement = document.createElement("div")
        groupTitleElement.classList.add("groupTitle")
        additionalClasses.forEach(element => groupTitleElement.classList.add(element))
        groupTitleElement.innerHTML = groupTitle

        groupWrapper.appendChild(groupTitleElement)
      }

      let itemsWrapper = document.createElement("div")
      groupWrapper.appendChild(itemsWrapper)
      itemsWrapper.classList.add("itemsWrapper")
      additionalClasses.forEach(element => itemsWrapper.classList.add(element))

      for(let elementIdx = 0; elementIdx < itemElements.length; elementIdx++){
        itemsWrapper.appendChild(itemElements[elementIdx])
      }
      return groupWrapper
    }
  },

  getGroupsDomElement: function(){
    const self = this
    let curGroupsConfig = self.config.groups
    let profilesConfig = self.config.profiles

    if (profilesConfig != null){
      if (!profilesConfig.includes(self.currentProfile)){
        return null
      }
    }

    let additionalClasses = []
    if(self.config["classes"] != null){
      self.config["classes"].split(" ").forEach(element => additionalClasses.push(element))
    }

    let groupElements = []
    for(let groupIdx = 0; groupIdx < curGroupsConfig.length; groupIdx++){
      let groupElement = self.getGroupDomElement(groupIdx)
      if(groupElement != null){
        groupElements.push(groupElement)
      }
    }

    if (groupElements.length < 1){
      return null
    } else {
      let groupsWrapper = document.createElement("div")
      groupsWrapper.classList.add("groupsWrapper")
      additionalClasses.forEach(element => {
        groupsWrapper.classList.add(element)
      })

      for(let elementIdx = 0; elementIdx < groupElements.length; elementIdx++){
        groupsWrapper.appendChild(groupElements[elementIdx])
      }
      return groupsWrapper
    }
  },

  getDom: function() {
    const self = this
    let wrapper = document.createElement('div')
    wrapper.classList.add("vbn")
    wrapper.classList.add("groups")
    let groupsElement = self.getGroupsDomElement()
    if(groupsElement != null){
      wrapper.appendChild(groupsElement)
    }

    for(let key in self.sensorsSortedByNotification){
      self.sensorsSortedByNotification[key]["currentUses"] = self.sensorsSortedByNotification[key]["currentUses"] + 1
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
      let curGroup =  self.config.groups[groupIdx]
      for (let itemIdx = 0; itemIdx < curGroup.items.length; itemIdx++) {
        let curItem = curGroup.items[itemIdx]
        let curNotifcation = curItem.notification
        let curNotifcationPrefix = self.config.notificationPrefix
        if (typeof curItem["notificationPrefix"] !== "undefined"){
          curNotifcationPrefix = curItem["notificationPrefix"]
        } else if (typeof curGroup["notificationPrefix"] !== "undefined"){
          curNotifcationPrefix = curGroup["notificationPrefix"]
        }
        let curReuseCount = self.config["reuseCount"]
        //either use global reuse value or the one set for this item
        if (typeof curItem["reuseCount"] !== "undefined"){
          curReuseCount = curItem["reuseCount"]
        }
        

        let curNotificationElement = {}
        if (typeof self.sensorsSortedByNotification[curNotifcationPrefix+curNotifcation] !== "undefined"){
          curNotificationElement = self.sensorsSortedByNotification[curNotifcationPrefix+curNotifcation]
        }

        let curGroupElement = {}
        if (typeof curNotificationElement[groupIdx] !== "undefined"){
          curGroupElement = curNotificationElement[groupIdx]
        }

        let curItemElement = {
            "reuseCount": curReuseCount,
        }

        curGroupElement[itemIdx] = curItemElement
        curNotificationElement[groupIdx] = curGroupElement
        self.sensorsSortedByNotification[curNotifcationPrefix+curNotifcation] = curNotificationElement
      }
    }
    this.sendSocketNotification("CONFIG", this.config);

    self.resetTimer()
  },

  resetTimer: function(){
    const self = this
    if(self.refreshTimer){
      clearTimeout(self.refreshTimer)
      refreshTimer = null
    }
    self.refreshTimer = setTimeout(()=>{
      self.resetTimer()
    }, self.config.updateInterval * 1000)
    self.updateDom(self.config.animationSpeed)
  },

  notificationReceived: function (notification, payload) {
    const self = this
    if (notification === "CHANGED_PROFILE") {
      console.log("PROFILE CHANGED TO: "+payload.to)
      self.currentProfile = payload.to
    } else if (typeof self.sensorsSortedByNotification[notification] !== "undefined"){
      let curNotificationItem = self.sensorsSortedByNotification[notification]
      curNotificationItem["currentUses"] = 0
      parsedPayload = payload
      try{
        parsedPayload = JSON.parse(payload)
      } catch (e) {}
      curNotificationItem["currentRawValue"] = parsedPayload
    }
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
  },
})
