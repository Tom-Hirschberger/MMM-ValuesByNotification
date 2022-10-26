        {
            module: "MMM-ValuesByNotification",
            position: "top_center",
            header: "FLOWERCARE",
            config: {
                updateInterval: 10,
                reuseCount: 100,
                classes: "flowercare",
                //itemPositions: "[ti]e",
                groups: [
                    {
                        valueFormat: "Number(${value}).toFixed(0)",
                        items: [
                            {
                                itemTitle: "Palme",
                                itemIcon: "fa fa-battery-empty",
                                notification: "FLOWERCARE_OG_PALME",
                                values: [
                                    {
                                        jsonpath: "temperature",
                                        //valueIcon: "fa fa-thermometer-full",
                                        classes: "temperature",
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/temperature-svgrepo-com.svg",
                                    },
                                    {
                                        jsonpath: "moisture",
                                        //valueIcon: "fa fa-tint",
                                        classes: "moisture filter-green",
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/can-water-svgrepo-com.svg",
                                    },
                                    {
                                        jsonpath: "light",
                                        //valueIcon: "fa fa-sun-o",
                                        classes: "light",
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/sun-svgrepo-com.svg",
                                    },
                                    {
                                        jsonpath: "battery",
                                        valuePositions: "",
                                        thresholds: [
                                            {
                                                type: "lt",
                                                value: 5,
                                                classes: "bat-lt5"
                                            },
                                            {
                                                type: "lt",
                                                value: 10,
                                                classes: "bat-lt10"
                                            },
                                        ]
                                    },
                                ]
                            },
                            {
                                itemTitle: "Calla",
                                itemIcon: "fa fa-battery-empty",
                                notification: "FLOWERCARE_EG_CALLA",
                                values: [
                                    {
                                        jsonpath: "temperature",
                                        //valueIcon: "fa fa-thermometer-full",
                                        classes: "temperature",
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/temperature-svgrepo-com.svg",
                                    },
                                    {
                                        jsonpath: "moisture",
                                        //valueIcon: "fa fa-tint",
                                        classes: "moisture",
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/can-water-svgrepo-com.svg",
                                    },
                                    {
                                        jsonpath: "light",
                                        //valueIcon: "fa fa-sun-o",
                                        classes: "light",
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/sun-svgrepo-com.svg",
                                    },
                                    {
                                        valuePositions: "",
                                        jsonpath: "battery",
                                        thresholds: [
                                            {
                                                type: "lt",
                                                value: 5,
                                                classes: "bat-lt5"
                                            },
                                            {
                                                type: "lt",
                                                value: 10,
                                                classes: "bat-lt10"
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
                    },
                ]
            },
        },