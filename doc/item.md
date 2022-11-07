# Items

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| values | The array containing the definitions of the values. | Array | null |
| itemTitle | Specify a string or a array of strings containing title(s) which will be added as element(s) to the item element. | String or Array of String | null |
| itemIcon | Specify one or more icon(s) you want to add to the item elment either as String (which contains the [Fontawesome 4.7](https://fontawesome.com/v4/icons/) or [Iconify](https://icon-sets.iconify.design/) classes of the single icon) or a array of strings which do contain the classes. Look at in the section [Icons](icons.md) for more information. | String or array of Strings | null |
| itemImgIcon | Specify one or more images that should be displayed as icon(s) **instead** of [Fontawesome 4.7](https://fontawesome.com/v4/icons/) or [Iconify](https://icon-sets.iconify.design/) icon(s). This value needs to be either a string which contains the path to the icon or an array of strings containing the paths in each element. Look at in the section [Icons](icons.md) for more information. | String or array of Strings | null |
| itemPositions | Specify in which order the elements should be added to the item element. t=title(s), i=icon(s), e=elements (the value elements), d=dummy (empty element to act as placeholder), [] to create a sub wrapper. Look to [Positions](positions.md) section to get more information. | String | "tie" |
| classes | Specify css classes here that will be configured to each element of the item element. The classes need to be specified space separated in a string. | String | null |
| profiles | Specify a space separated list of profiles if you like this item element only to be displayed if a certain profile is active currently. | Stirng | null |
| automaticWrapperClassPrefix | If a wrapper is specified in the itemPositions option this class will be added to every wrapper. Additionally a class starting with this prefix and a number starting with 0 will be added. | String | null |

The options "itemTitle", "itemIcon", "itemImgIcon", "itemPositions" and "automaticWrapperClassPrefix" can be configured within the or groups or general configuration as well. If they are configured the deepest hirarchical option overrides the other ones.
If for example a "itemTitle" is configured directly in the "config" section but there is one configured in the current item the one of the item will be used. In the following example "Item-1" will use the title "Item" while the second item uses "Item-2".

```json5
        {
            module: "MMM-ValuesByNotification",
            position: "top_left",
            header: "Module-1",
            config: {
                itemTitle: "Item",
                groups: [
                    {
                        items: [
                            {
                                notification: "TEST1",
                                values: [
                                    {
                                        valueTitle: "Value-1",
                                    },
                                ]
                            },
                            {
                                notification: "TEST2",
                                itemTitle: "Item-2",
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
