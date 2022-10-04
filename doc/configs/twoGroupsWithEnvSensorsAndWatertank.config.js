        {
            module: "MMM-ValuesByNotification",
            position: "top_right",
            config: {
                animationSpeed: 500,
                updateInterval: 30,
                letClassesBubbleUp: false,
                valuePositions: "tivu",
                classes: "environment",
                naValue: "na.na",
                valueFormat: "Number(${value}).toFixed(1)",
                groups: [
                    {
                        items: [
                            {
                                valueTitle: "Garage",
                                notification: "TEMPERATURE_C_ESPGARAGE",
                                reuseCount: 4,
                                values: [
                                    {
                                        valueIcon: "fa fa-thermometer-full",
                                        valueUnit: "°C",
                                    },
                                ]
                            },
                            {
                                notification: "HUMIDITY_ESPGARAGE",
                                reuseCount: 4,
                                values: [
                                    {
                                        valueIcon: "fa fa-tint",
                                        valueUnit: "%rH",
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        items: [
                            {
                                valueTitle: "Nordseite",
                                notification: "TEMPERATURE_C_ESPNORD",
                                reuseCount: 4,
                                values: [
                                    {
                                        valueIcon: "fa fa-thermometer-full",
                                        valueUnit: "°C",
                                    },
                                ]
                            },
                            {
                                notification: "HUMIDITY_ESPNORD",
                                reuseCount: 4,
                                values: [
                                    {
                                        valueIcon: "fa fa-tint",
                                        valueUnit: "%rH",
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        items: [
                            {
                                valueTitle: "Schlafen",
                                notification: "TEMPERATURE_C_ESPSCHLAFEN",
                                reuseCount: 4,
                                values: [
                                    {
                                        valueIcon: "fa fa-thermometer-full",
                                        valueUnit: "°C",
                                    },
                                ]
                            },
                            {
                                notification: "HUMIDITY_ESPSCHLAFEN",
                                reuseCount: 4,
                                values: [
                                    {
                                        valueIcon: "fa fa-tint",
                                        valueUnit: "%rH",
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        items: [
                            {
                                valueTitle: "Wohnzimmer",
                                notification: "FLOWERCARE_WZ_CALLA",
                                jsonpath: "temperature",
                                reuseCount: 260,
                                values: [
                                    {
                                        valueIcon: "fa fa-thermometer-full",
                                        valueUnit: "°C",
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        items: [
                            {
                                valueTitle: "Bad OG",
                                notification: "FLOWERCARE_BADOG_PALME",
                                reuseCount: 260,
                                jsonpath: "temperature",
                                values: [
                                    {
                                        valueIcon: "fa fa-thermometer-full",
                                        valueUnit: "°C",
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        valueFormat: "${value}",
                        classes: "zisterne",
                        items: [
                            {
                                notification: "ZISTERNE_VALUES",
                                reuseCount: 4,
                                jsonpath: "rounded",
                                naValue: "na",
                                values: [
                                    {
                                        valueTitle: "Zisterne",
                                        valuePositions: "ti[vu]",
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-0.svg",
                                        valueUnit: "l",
                                        thresholds: [
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-100.svg",
                                                type: "gt",
                                                value: 1935,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-90.svg",
                                                type: "gt",
                                                value: 1720,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-80.svg",
                                                type: "gt",
                                                value: 1505,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-70.svg",
                                                type: "gt",
                                                value: 1290,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-60.svg",
                                                type: "gt",
                                                value: 1075,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-50.svg",
                                                type: "gt",
                                                value: 860,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-40.svg",
                                                type: "gt",
                                                value: 645,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-30.svg",
                                                type: "gt",
                                                value: 430,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-20.svg",
                                                type: "gt",
                                                value: 215,
                                            },
                                            {
                                                valueImgIcon: "modules/MMM-ValuesByNotification/icons/wassertank/wassertank-10.svg",
                                                type: "gt",
                                                value: 10,
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
                    }
                ]
            },
        },