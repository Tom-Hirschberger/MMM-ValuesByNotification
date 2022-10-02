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
                                        valueIcon: "fa fa-thermometer-full",
                                        valueUnit: "°C",
                                        valueFormat: "Number(${value}).toFixed(2)",
                                        jsonpath: "temperature",
                                    },
                                    {
                                        valueIcon: "fa fa-tint",
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
