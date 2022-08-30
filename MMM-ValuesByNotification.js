/* global Module

/* Magic Mirror²
 * Module: ValuesByNotification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */  
Module.register('MMM-ValuesByNotification', {

  defaults: {
    positions: "tivu",
    reuseCount: 1,
    naValue: "na",
    title: null,
    icon: null,
    valueUnit: null,
    valueFormat: "{value}",
    thresholds: null,
    groups: [],
    notificationPrefix: "VALUES_BY_NOTIFICATION_",
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
        console.log("Stopping value creation because "+profilesConfig+" does not include "+self.currentProfile)
        return null
      }
    }

    let elementWrapper = document.createElement("div")
    elementWrapper.classList.add("elementWrapper")

    let curNotification = self.config.notificationPrefix+curItemConfig["notification"]
    let curNotificationValueObj = self.sensorsSortedByNotification[curNotification]

    let title = self.config["title"]
    if(typeof curValueConfig["title"] !== "undefined"){
      title = curValueConfig["title"]
    } else if (typeof curItemConfig["title"] !== "undefined"){
      title = curItemConfig["title"]
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

    let value = curNotificationValueObj["currentRawValue"]
    curNotificationValueObj["currentUses"] = curNotificationValueObj["currentUses"]+1
    if ((typeof value === "undefined") || (curNotificationValueObj["currentUses"] > curNotificationValueObj["reuseCount"])) {
      curNotificationValueObj["currentUses"] = curNotificationValueObj["currentUses"]+1
      value = naValueConfig
      additionalClasses.push("naValue")
    } else {
      curNotificationValueObj["currentUses"] = curNotificationValueObj["currentUses"]+1
      if(jsonpathConfig != null){
        value = JSONPath.JSONPath({path: jsonpathConfig, json: value});
        console.log("JSONPath result: "+value)
      }

      value = eval(eval("`"+valueFormatConfig+"`"))
    
    
      if (thresholdsConfig != null) {
        for(let thresholdIdx = 0; thresholdIdx < thresholdsConfig.length; thresholdIdx++){
          let curThresholdConfig = thresholdsConfig[thresholdIdx]
          if (curThresholdConfig.type === "eq"){
            if(value === curThresholdConfig["value"]){
              if (typeof curThresholdConfig["icon"] !== "undefined"){
                iconConfig = curThresholdConfig["icon"]
              }
              if (typeof curThresholdConfig["classes"] !== "undefined"){
                additionalClasses = curThresholdConfig["classes"].split(" ")
              }
              break
            }
          } else if(curThresholdConfig["type"] === "lt"){
            if(value < curThresholdConfig["value"]){
              if (typeof curThresholdConfig["icon"] !== "undefined"){
                iconConfig = curThresholdConfig["icon"]
              }
              if (typeof curThresholdConfig["classes"] !== "undefined"){
                additionalClasses = curThresholdConfig["classes"].split(" ")
              }
              break
            }
          } else if(curThresholdConfig["type"] === "gt"){
            if(value > curThresholdConfig["value"]){
              if (typeof curThresholdConfig["icon"] !== "undefined"){
                iconConfig = curThresholdConfig["icon"]
              }
              if (typeof curThresholdConfig["classes"] !== "undefined"){
                additionalClasses = curThresholdConfig["classes"].split(" ")
              }
              break
            }
          }
        }
      }
    }

    

    let valueElement = null
    if (positionsConfig.includes("v")){
      valueElement = document.createElement("div")
      valueElement.classList.add("value")
      if (additionalClasses.length > 0){
        valueElement.classList.add(additionalClasses)
      }
      valueElement.innerHTML = value
    }

    let iconElement = null
    if (iconConfig != null){
      iconElement = document.createElement("i")
      iconElement.classes = iconConfig
      iconElement.classList.add("icon")
      if (additionalClasses.length > 0){
        iconElement.classList.add(additionalClasses)
      }
      iconElement.setAttribute("aria-hidden", "true")
    }

    let titleElement = null
    if (title != null){
      titleElement = document.createElement("div")
      titleElement.classList.add("title")
      if (additionalClasses.length > 0){
        titleElement.classList.add(additionalClasses)
      }
      titleElement.innerHTML = title
    }

    let unitElement = null
    if (valueUnitConfig != null){
      unitElement = document.createElement("div")
      unitElement.classList.add("unit")
      if (additionalClasses.length > 0){
        unitElement.classList.add(additionalClasses)
      }
      unitElement.innerHTML = valueUnitConfig
    }

    let atLeastOneAdded = false
    for (let posChar of positionsConfig) {
      if(posChar === "t"){
        if (titleElement != null){
          console.log(title)
          atLeastOneAdded = true
          elementWrapper.appendChild(titleElement)
        }
      } else if (posChar === "i"){
        if (iconElement != null){
          atLeastOneAdded = true
          elementWrapper.appendChild(iconElement)
        }
      } else if (posChar === "v"){
        if (valueElement != null){
          atLeastOneAdded = true
          elementWrapper.appendChild(valueElement)
        }
      } else if (posChar === "u"){
        if (unitElement != null){
          atLeastOneAdded = true
          elementWrapper.appendChild(unitElement)
        }
      } else {
        console.log("UNKNOWN CHARACHTER")
      }
    }

    if (atLeastOneAdded === true){
      return elementWrapper
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
        console.log("Stopping item creation because "+profilesConfig+" does not include "+self.currentProfile)
        return null
      }
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
      for(let elementIdx = 0; elementIdx < valueElements.length; elementIdx++){
        itemWrapper.appendChild(valueElements[elementIdx])
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
        console.log("Stopping group creation because "+profilesConfig+" does not include "+self.currentProfile)
        return null
      }
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
      for(let elementIdx = 0; elementIdx < itemElements.length; elementIdx++){
        groupWrapper.appendChild(itemElements[elementIdx])
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
        console.log("Stopping groups creation because "+profilesConfig+" does not include "+self.currentProfile)
        return null
      }
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
      for(let elementIdx = 0; elementIdx < groupElements.length; elementIdx++){
        groupsWrapper.appendChild(groupElements[elementIdx])
      }
      return groupsWrapper
    }
  },

  getDom: function() {
    const self = this
    let wrapper = document.createElement('div')
    wrapper.classList.add("groups")
    let groupsElement = self.getGroupsDomElement()
    if(groupsElement != null){
      wrapper.appendChild(groupsElement)
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
        let curReuseCount = self.config["reuseCount"]
        //either use global reuse value or the one set for this item
        if (typeof curItem["reuseCount"] !== "undefined"){
          curReuseCount = curItem["reuseCount"]
        }
        
        let curElement = []
        if (typeof self.sensorsSortedByNotification[self.config.notificationPrefix+curNotifcation] !== "undefined"){
          curElement = self.sensorsSortedByNotification[self.config.notificationPrefix+curNotifcation]
        }
        curElement.push(
          {
            "groupIdx":groupIdx,
            "itemIdx": itemIdx,
            "reuseCount": curReuseCount,
            "currentUses": curReuseCount
          }
        )

        self.sensorsSortedByNotification[self.config.notificationPrefix+curNotifcation] = curElement
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
    self.sendSocketNotification("UPDATE_SENSOR_VALUES")
    self.refreshTimer = setTimeout(()=>{
      self.resetTimer()
    }, self.config.updateInterval * 1000)
  },

  notificationReceived: function (notification, payload) {
    const self = this
    if (notification === "CHANGED_PROFILE") {
      console.log("PROFILE CHANGED TO: "+payload.to)
      self.currentProfile = payload.to
    } else if (typeof self.sensorsSortedByNotification[notification] !== "undefined"){
      console.log("RECEIVED NOTI: "+notification)
      let curItems = self.sensorsSortedByNotification[notification]
      for (let curItemIdx = 0; curItemIdx < curItems.length; curItemIdx++){
        let curElement = curItems[curItemIdx]
        curElement["currentUses"] = 0
        parsedPayload = payload
        try{
          parsedPayload = JSON.parse(payload)
        } catch (e) {console.log(e)}

        curElement["currentRawValue"] = parsedPayload
      }
    }
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
  },
})
