# Thresholds

With the tresholds configuration you are able to override the "valueIcon", "valueImgIcon" and "valuePositions" option of value element if a specific condition mets or you can add "classes" to this and all parent elements in this case.
The decision about the threshold is based on the value (after reformat so be careful with the "valueFormat" option in this case).

The following threshold types are possible:

* lt: checks if the current value is lower than the specified one (only if value is a valid number)
* le: checks if the current value is lower or equal than the specified one (only if value is a valid number)
* gt: checks if the current value is greater than the specified one (only if value is a valid number)
* ge: checks if the current value is greater or equal than the specified one (only if value is a valid number)
* eq: checks if the current value is equal to the specified one (works with strings also)

The thresholds of a value will be specified as a list.

**The first threshold in the list that matches is the one that is used!**

## Configuration

A thresholds needs a type, the value to compare to and at least one of "classes", "valueImgIcon", "valueIcon" configured.

In this example the `valuePositions` are set to only display the value without the unit if the value is equal to "Loading" and the path of the imgIcon of the value is changed to "modules/MMM-ValuesByNotification/icons/tom.jpg" if the value is lower than 15 and a class "lt15" is added to the value element. If the general configuration option "letClassesBubbleUp" is set to "true" (default) the elements of the itemWrapper and groupWrapper as well as the groupsWrapper all get the class added as well. If the value is greater or eqal to 15 but lower than 20 the icon is changed to a fontawesome 4.7 icon and the class "lt20" is added instead. If the value does not met any of the thresholds nothing happens.

```json5
  thresholds: [
      {
          type: "eq",
          value: "Loading",
          valuePositions: "[v]",
      },
      {
          type: "lt",
          value: "15",
          classes: "lt15",
          valueimgIcon: "modules/MMM-ValuesByNotification/icons/tom.jpg"
      },
      {
          type: "lt",
          value: "20",
          classes: "lt20",
          valueIcon: "fa fa-thermometer-empty"
      },
  ]
```

Be sure to add the thresholds in the right order to the array. If we added the threshold vise versa in the example above the case lower than 15 never can happen cause the first threshold "lower than 20" hits first and the other one will not be evaluated anymore.
