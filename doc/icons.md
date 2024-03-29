# Icons and ImgIcons

In this module icons can be added to the groupsWrapper, the groupWrapper, the itemWrapper and the valueWrapper. There are two different kinds of icons. Font icons of [Fontawesome 4.7](https://fontawesome.com/v4/icons/) or [Iconify](https://icon-sets.iconify.design/) or images as icon.
There can be specified either a single icon or an array of icons.
If an array of icons is added they all get wrapped into an wrapper object.
In the following example an array of [Fontawesome 4.7](https://fontawesome.com/v4/icons/) and [Iconfiy](https://icon-sets.iconify.design/) icons is added to Value-1 and a image icon to Item-1:

**If both a imgIcon and a icon is specified the imgIcon is used!**

```json5
  {
   module: "MMM-ValuesByNotification",
   position: "top_left",
   header: "Module-1",
   config: {
    groups: [
     {
      items: [
       {
        notification: "TEST1",
        itemImgIcon: "modules/MMM-ValuesByNotification/icons/tom.jpg"
        values: [
         {
            valueTitle: "Value-1",
            valueIcon: ["fa fa-thermometer-empty", "fluent-emoji:test-tube", "fa fa-address-book"]
         },
        ]
       },
      ]
     },
    ]
   },
  },
```

In this example the "valueImgIcon" is specified in the general configuration while a array of "valueIcon" is specified in the section of Value-1. **BUT the valueIcon array gets ignored cause the general imgIcon is configured!**

```json5
  {
   module: "MMM-ValuesByNotification",
   position: "top_left",
   header: "Module-1",
   config: {
    valueImgIcon: "modules/MMM-ValuesByNotification/icons/tom.jpg"
    groups: [
     {
      items: [
       {
        notification: "TEST1",
        values: [
         {
            valueTitle: "Value-1",
            valueIcon: ["fa fa-thermometer-empty", "fa fa-address-book"]
         },
        ]
       },
      ]
     },
    ]
   },
  },
```

## Font Icons

[Fontawesome 4.7 icons](https://fontawesome.com/v4/icons/) need to be specified by their class either in the option "valueIcon", "itemIcon", "groupIcon" or "groupsIcon".

Simply visit [https://fontawesome.com/v4/icons/](https://fontawesome.com/v4/icons/) and search for the icon(s) you want to display. Copy the "class" part and add it to the configuration.

[Iconify icons](https://icon-sets.iconify.design) need to be specified by their id. Simply visit [https://icon-sets.iconify.design](https://icon-sets.iconify.design), search for the icon you like and copy the id in the details of the icon (i.e. "fluent-emoji:test-tube").

## Image Icons

Image icons can be normal images like jpg, png and even "svg" is supported. They can be configured as "valueImgIcon", "itemImgIcon, "groupImgIcon" and "groupsImgIcon".

**If both a image icon and a font icon are configured the image icon is used!**

The images need to be in reach of the webserver of MagicMirror². So either copy them to the "icons" directory within this module folder and address them like in the example above or place them somewhere in the cloud where they are reachable and add the whole URL.
