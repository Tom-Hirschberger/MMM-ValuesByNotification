const { parseICS } = require("node-ical");

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
    notificationPrefix: "VALUES_BY_NOTIFICATION_"
  },

  suspend: function() {
    const self = this
  },

  resume: function() {
    const self = this
  },

  
  getScripts: function () {
		return [this.file('node_modules/jsonpath-plus/dist/index-browser-umd.js')];
	},
  

  getStyles: function() {
    return ['font-awesome.css', 'valuesByNotification.css']
  },

  getValueDomElement: function(groupIdx, itemIdx, valueIdx){
    const self = this
    let curGroupConfig = self.config.notificationPrefix+self.config.groups[groupIdx]
    let curItemConfig = curGroupConfig.items[itemIdx]
    let curValueConfig = curItemConfig[valueIdx]

    let curNotification = self.config.notificationPrefix+curItemConfig.notification
    let curNotificationValueObj = self.sensorsSortedByNotification[curNotification]

    let title = self.config.title
    if(typeof curValueConfig.title !== "undefined"){
      title = curValueConfig.title
    } else if (typeof curItemConfig.title !== "undefined"){
      title = curItemConfig.title
    }

    let icon = self.config.icon
    if(typeof curValueConfig.icon !== "undefined"){
      icon = curValueConfig.icon
    }

    let positions = self.config.positions
    if(typeof curValueConfig.positions !== "undefined"){
      positions = curValueConfig.positions
    } else if (typeof curItemConfig.positions !== "undefined"){
      positions = curItemConfig.positions
    }

    let valueFormat = self.config.valueFormat
    if(typeof curValueConfig.valueFormat !== "undefined"){
      valueFormat = curValueConfig.valueFormat
    } else if (typeof curItemConfig.valueFormat !== "undefined"){
      valueFormat = curItemConfig.valueFormat
    }

    let valueUnit = self.config.valueUnit
    if(typeof curValueConfig.valueUnit !== "undefined"){
      valueUnit = curValueConfig.valueUnit
    } else if (typeof curItemConfig.valueUnit !== "undefined"){
      valueUnit = curItemConfig.valueUnit
    }

    let naValue = self.config.naValue
    if(typeof curValueConfig.naValue !== "undefined"){
      naValue = curValueConfig.naValue
    } else if (typeof curItemConfig.naValue !== "undefined"){
      naValue = curItemConfig.naValue
    }

    let thresholds = self.config.thresholds
    if(typeof curValueConfig.thresholds !== "undefined"){
      thresholds = curValueConfig.thresholds
    } else if (typeof curItemConfig.thresholds !== "undefined"){
      thresholds = curItemConfig.thresholds
    }

    let jsonpath = self.config.jsonpath
    if(typeof curValueConfig.jsonpath !== "undefined"){
      jsonpath = curValueConfig.jsonpath
    } else if (typeof curItemConfig.jsonpath !== "undefined"){
      jsonpath = curItemConfig.jsonpath
    }

    let value = curNotificationValueObj.currentRawValue
    if(jsonpath != null){
      value = JSONPath.JSONPath({path: jsonpath, json: value});
    }

    value = eval(eval("`"+valueFormat+"`"))
  },

  getItemDomElement: function(groupIdx, itemIdx){
    const self = this
  },

  getGroupDomElement: function(groupIdx){
    const self = this
  },

  getDom: function() {
    const self = this
    let wrapper = document.createElement('div')
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

        console.log(typeof(curItem))
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
  },

  notificationReceived: function (notification, payload) {
    const self = this
    if (notification === "CHANGED_PROFILE") {
      self.currentProfile = payload.to
    } else if (typeof self.sensorsSortedByNotification[notification] !== "undefined"){
      let curItems = self.sensorsSortedByNotification[notification]
      for (let curItemIdx = 0; curItemIdx < curItems.length; curItemIdx++){
        let curElement = curItems[curItemIdx]
        curElement.currentUses = 0
        parsedPayload = payload
        try{
          parsedPayload = JSON.parse(payload)
        } catch {}

        curElement.currentRawValue = parsedPayload
      }
    }
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
  },
})
