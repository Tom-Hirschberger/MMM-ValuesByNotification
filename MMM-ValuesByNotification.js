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
  },

  notificationReceived: function (notification, payload) {
    const self = this
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
  },
})
