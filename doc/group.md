# Group

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| items | The array containing the definitions of the items. | Array | null |
| groupTitle | Specify a string or a array of strings containing title(s) which will be added as element(s) to the group element. | String or Array of String | null |
| groupIcon | Specify one or more icon(s) you want to add to the group elment either as String (which contains the [fontawesome 4.7](https://fontawesome.com/v4/icons/) classes of the single icon) or a array of strings which do contain the classes. Look at in the section [Icons](icons.md) for more information. | String or array of Strings | null |
| groupImgIcon | Specify one or more images that should be displayed as icon(s) **instead** of [fontawesome 4.7](https://fontawesome.com/v4/icons/) icon(s). This value needs to be either a string which contains the path to the icon or an array of strings containing the paths in each element. Look at in the section [Icons](icons.md) for more information. | String or array of Strings | null |
| groupPositions | Specify in which order the elements should be added to the group element. t=title(s), i=icon(s), e=elements (the item elements), d=dummy (empty element to act as placeholder), [] to create a sub wrapper. Look to [Positions](positions.md) section to get more information. | String | "tie" |
| classes | Specify css classes here that will be configured to each element of the group element. The classes need to be specified space separated in a string. | String | null |
| profiles | Specify a space separated list of profiles if you like this group element only to be displayed if a certain profile is active currently. | Stirng | null |

The options "groupTitle", "groupIcon", "groupImgIcon" and "groupPositions" can be configured within the general configuration as well. If they are configured the deepest hirarchical option overrides the other ones.
If for example a "groupTitle" is configured directly in the "config" section but there is one configured in the current group the one of the group will be used. In the following example "Group-1" will use the title "Group" while the second group uses "Group-2".

```json5
        {
            module: "MMM-ValuesByNotification",
            position: "top_left",
            header: "Module-1",
            config: {
                groupTitle: "Group",
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
                                values: [
                                    {
                                        valueTitle: "Value-1",
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        groupTitle: "Gruop-2",
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
