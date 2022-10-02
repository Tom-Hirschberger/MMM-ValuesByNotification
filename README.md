# MMM-ValuesByNotification
Need a MagicMirror² module which is able to display information which is send by a other module like [MMM-MQTTbridge](https://github.com/sergge1/MMM-MQTTbridge) or [MMM-CommandToNotification](https://github.com/Tom-Hirschberger/MMM-CommandToNotification)?  
The information is provided as a simple message or as an JSON-Object?  
You want to re-format the message before displaying it or want to select single values within the JSON-Object?  
You need more than one instance and do want to style the instances different?  
Do you want to style the elements or change displayed icons based on thresholds?


Then this is the module you need!  

BUT i think i created a monster. The configuration can be very tricky!
Look a the <a href="doc/screenshots">screenshots</a> and at the provided configuration <a href="doc/configs">examples</a>.

<img src="doc/screenshots/twoModulesWarning.png" alt="Screen showing two intances of the module with differnt style" width="600px"/>

<a href="doc/configs/twoModulesOneWithAlert.config.js" target="_blank">Example-Config</a>  
<a href="doc/configs/twoModulesOneWithAlert.custom.css" target="_blank">Example-CSS</a>

In this screenshot you see two instances of the module which are called MODULE-1 and MODULE-2.  
MODULE-1:
* Contains two groups (Group-1 and Group-2)
* Group-1 shows two items (Item-1 and Item-2) which do have added titles
  * Item-1 shows a temperature value with unit °C
  * Item-2 shows a humidity value with unit %rH
* The border of Group-1 is in red color because one of the values reached a threshold (temperature < 10)
* Group-2 shows two Items (Item-1 and Item-2)
  * Item-1 has one title added contains two values which do have an additional icon and title
  * Item-2 has two titles (Item-2 twice) and two values which do have an additional title but no icons

MODULE-2
* Contains one group (Group-1)
* Group-1 has an additional image icon
* The default color of the border of Group-1 has been changed to green
* If a threshold is reached the color of Group-1 changes to red (like Group-1 in MODULE-1)
* Item-1 has no title and shows two values (Value-1 and Value-2)
  * Value-1 shows the temperature with unit °C
  * Value-2 shows the humidity with unit %rH
* Item-2 has two values
* The order of the elements of Item-2 has changed to display the two tiles of Item-2 after the elements containing the values
* The values of Item-2 show an title (Value-1, Value-2), the values with units and an image icon

## Basic features
* Display the content of notifications (either simple values or elements of JSON objects)
* Use JSONPath syntax to select the values in messages sending a JSON object
* Re-format the values with JavaScript functions
* Add titles and/or icons (either fontawesome icons or images)
* Display the title/values/units in different order based on the group or item
* Display a placeholder (not available) value if either the provided information is to old (reused to often) or had not been provided till now
* Group the values into items and groups and add icons either to the values, items or groups
* Change the icons and/or add classes based on thresholds
* Display multiple instances of this module with different styling in different positions

## Basic installation
```
cd ~/MagicMirror/modules
git clone https://github.com/Tom-Hirschberger/MMM-ValuesByNotification.git
cd MMM-ValuesByNotification
npm install
```

## Basic configuration
Add the following code to your ~/MagicMirror/config/config.js:

```
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
								itemTitle: "Item-1",
								values: [
									{
                                        valueTitle: "Value-1",
									},
								]
							},
						]
					},
				]
			},
		},
```
<a href="doc/configs/basicConfiguration.config.js" target="_blank">Basic configuration</a>

Restart your mirror and you should see something like this:  
<img src="doc/screenshots/basicConfiguration.png" alt="Screen showing one intances of the module with one item and one value" width="100px"/>

This very basic example has the following features:
* Display one group which does not have any icon or title
* Display one item in this group which does not have an icon or unit set
