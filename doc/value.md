# Values

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| valueUnit | Specify the unit of the value here. | String | null |
| naValue | Specify a value that will be displayed if the notification has not been received or the information is to old. | String | "na" |
| valueTitle | Specify a string or a array of strings containing title(s) which will be added as element(s) to the value element. | String or Array of String | null |
| valueIcon | Specify one or more icon(s) you want to add to the value elment either as String (which contains the [Fontawesome 4.7](https://fontawesome.com/v4/icons/) or [Iconify](https://icon-sets.iconify.design/) classes of the single icon) or a array of strings which do contain the classes. Look at in the section [Icons](icons.md) for more information. | String or array of Strings | null |
| valueImgIcon | Specify one or more images that should be displayed as icon(s) **instead** of [Fontawesome 4.7](https://fontawesome.com/v4/icons/) or [Iconify](https://icon-sets.iconify.design/) icon(s). This value needs to be either a string which contains the path to the icon or an array of strings containing the paths in each element. | String or array of Strings | null |
| valueFormat | Specify a pice of javascript code to re-format the value before displaying it. \${value} contains the value (i.e. "Number(${value}).toFixed(2)" will shorten a float value like 10.1234 to 10.12). | String | "\${value}" |
| formatNaValue | Should the naValue be formatted as like it would be a regular value? | Boolean | false |
| jsonpath | Specify a [jsonpath-plus](https://github.com/JSONPath-Plus/JSONPath) path to select a value if your notification contains a json object. | String | null |
| newlineReplacement | Newline characters like \r and \n will be replaced with this string after a possible json is parsed but before the value gets formatted. | String | " " |
| valuePositions | Specify in which order the elements should be added to the value element. t=title(s), i=icon(s), v=value, u=unit, d=dummy (empty element to act as placeholder), [] to create a sub wrapper. Look to [Positions](positions.md) section to get more information. | String | "ti[vu]" |
| valueNaPositions | Specify in which order the elements should be added to the value element if `naValue` is used. t=title(s), i=icon(s), v=value, u=unit, d=dummy (empty element to act as placeholder), [] to create a sub wrapper. Look to [Positions](positions.md) section to get more information. | String | value of `valuePositions` |
| classes | Specify css classes here that will be configured to each element of the value element. The classes need to be specified space separated in a string. | String | null |
| thresholds | Specify a array of thresholds which can be used to add classes or manipulate the icons. Look to the [Thresholds](thresholds.md) section to get more information. | Array | null |
| profiles | Specify a space separated list of profiles if you like this value element only to be displayed if a certain profile is active currently. | Stirng | null |
| automaticWrapperClassPrefix | If a wrapper is specified in the valuePositions option this class will be added to every wrapper. Additionally a class starting with this prefix and a number starting with 0 will be added. | String | null |

The options "valueUnit", "naValue", "valueTitle", "valueIcon", "valueImgIcon", "valueFormat", "formatNaValue", "jsonpath", "newlineReplacement", "valuePositions", "thresholds" and "automaticWrapperClassPrefix" can be configured within the items or groups or general configuration as well. If multiple options are configured the deepest hirarchical option overrides the other ones.
If for example a "naValue" is configured directly in the "config" section but there is one configured in the current item and current value the configured in the value will be used. In the following example "Value-1" will use the "naValue" "n3" while "Value-2" uses "n2". Both values use "valueUnit" "abc".

```json5
        {
            module: "MMM-ValuesByNotification",
            position: "top_left",
            header: "Module-1",
            config: {
                naValue: "n1",
                valueUnit: "abc",
                groups: [
                    {
                        naValue: "n2",
                        items: [
                            {
                                notification: "TEST1",
                                itemTitle: "Item-1",
                                values: [
                                    {
                                        naValue: "n3"
                                        valueTitle: "Value-1",
                                    },
                                    {
                                        valueTitle: "Value-2",
                                    },
                                ]
                            },
                        ]
                    },
                ]
            },
        },
```

## valueFormat examples

Remeber that \${value} contains the actual value!

### Formating a float value to fixed number of fractions

```json
valueFormat: "Number(${value}).toFixed(2)"
```

will lead to a float that is fixed to two fractions.

### Remove prefix of string value

If the value of your notification looks something like:

```text
Temp: 12.0
```

```json
valueFormat: "\"${value}\".substring(6)"
```

will remove the starting "Temp: ".

### Advanced example using a regex to replace and select charcters and modify the value

Lets say you get notifications with the following content:

```text
dummy1
dummy2
value=12
dummy3
```

Cause newlines will be replaced with " " in default (see "newlineReplacement" option) the string will be converted to:

```text
dummy1 dummy2 value=12 dummy3
```

We want to get the "12" behind the "value=" and we want to add numerically a 1 to it:

```json
valueFormat: "Number(\"${value}\".replace(/.*value=(.*?) .*/g,\"$1\")) + 1",
```

The result value will be:

```text
13
```

## jsonpath examples

In my case i get temperature and humidity information of my sensors via MQTT. The information is provided as JSON object with a structure like this:

```json
{
  "temperature": 20.15,
  "humidity": 62.52
}
```

The jsonpath to select the temperature is:

```json
jsonpath="temperture",
```

The jsonpath to select the humidity is:

```json
jsonpath="humidity",
```

That was easy!
