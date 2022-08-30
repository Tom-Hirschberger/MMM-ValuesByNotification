const { configs } = require("eslint-plugin-prettier")

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
    title: null,
    icon: null,
    valueUnit: null,
    valueFormat: "{value}",
    thresholds: null,
    groups: []
  },

  suspend: function() {
    const self = this
  },

  resume: function() {
    const self = this
  },

  getStyles: function() {
    return ['font-awesome.css', 'valuesByNotification.css']
  },

  getDom: function() {
    const self = this
    let wrapper = document.createElement('div')
      

    return wrapper
  },

  start: function () {
    const self = this
    self.notificationPrefix = "VALUES_BY_NOTIFICATION_"
    self.currentProfile = null
    self.sensorsSortedByNotification = {}
    
    //building a structure which holds the current values based on the notification
    //this way we can set the values directly if an notification is received rather than
    //iterating through all groups and items each time
    for (let groupIdx = 0; i < self.config.groups.length; groupIdx++) {
      let curGroup = config.groups[groupIdx]
      for (let itemIdx = 0; i < curGroup.items.length; itemIdx++) {
        let curItem = curGroup.items[itemIdx]
        let curNotifcation = curItem.notification
        
        //either use global reuse value or the one set for this item
        if (curItem.has("reuseCount")){
          let curReuseCount = curItem["reuseCount"]
        } else {
          let curReuseCount = self.config["reuseCount"]
        }
        
        if (self.sensorsSortedByNotification.has(self.notificationPrefix+curNotifcation)){
          let curElement = self.sensorsSortedByNotification[self.notificationPrefix+curNotifcation]
        } else {
          let curElement = []
        }
        curElement.append(
          {
            "groupIdx":groupIdx,
            "itemIdx": itemIdx,
            "reuseCount": curReuseCount,
            "currentUses": curReuseCount,
            "currentValue": "na"
          }
        )

        self.sensorsSortedByNotification[self.notificationPrefix+curNotifcation] = curElement
      }
    }
  },

  notificationReceived: function (notification, payload) {
    const self = this
    if (notification === "CHANGED_PROFILE") {
      self.currentProfile = payload.to
    }
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
  },
})
