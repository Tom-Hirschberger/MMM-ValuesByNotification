        {
            module: "MMM-ValuesByNotification",
            position: "top_left",
            header: "Module-1",
            config: {
                updateInterval: 10,
                reuseCount: 100,
                groups: [
                    {
                        items: [
                            {
                                notification: "TEST1",
                                itemTitle: "Bathroom",
                                values: [
                                    {
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/tom.jpg",
                                        valueUnit: "°C",
                                        valueFormat: "Number(${value}).toFixed(2)",
                                        jsonpath: "temperature",
                                    },
                                    {
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/tom2.jpg",
                                        valueUnit: "%rH",
                                        valueFormat: "Number(${value}).toFixed(1)",
                                        jsonpath: "humidity",
                                    },
                                ]
                            },
                        ]
                    },
                ]
            },
        },
