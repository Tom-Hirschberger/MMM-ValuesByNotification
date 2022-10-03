        {
            module: "MMM-ValuesByNotification",
            position: "top_left",
            header: "MMM-ValuesByNotification",
            config: {
                updateInterval: 10,
                reuseCount: 100,
                groupsTitle: ["GS_TITLE1", "GS_TITLE2"],
                groupsImgIcon: ["modules/MMM-ValuesByNotification/icons/tom.jpg","modules/MMM-ValuesByNotification/icons/tom2.jpg"],
                groups: [
                    {
                        groupTitle: ["G1_TITLE1", "G1_TITLE2", "G1_TITLE3"],
                        groupIcon: "fa fa-free-code-camp",
                        items: [
                            {
                                notification: "TEST1",
                                itemTitle: ["I1_TITLE1", "I1_TITLE2"],
                                itemIcon: ["fa fa-bath", "fa fa-linode", "fa fa-address-card-o"],
                                values: [
                                    {
                                        valueTitle: "V1_TITLE",
                                        valueIcon: "fa fa-address-book",
                                        jsonpath: "v1",
                                        valueUnit: "U1",
                                    },
                                    {
                                        valueTitle: "V2_TITLE",
                                        valueIcon: "fa fa-eercast",
                                        jsonpath: "v2",
                                        valueUnit: "U2",
                                    },
                                    {
                                        valueTitle: "V3_TITLE",
                                        valueIcon: "fa fa-snowflake-o",
                                        jsonpath: "v3",
                                        valueUnit: "U3",
                                    },
                                ]
                            },
                            {
                                notification: "TEST2",
                                itemTitle: ["I2_TITLE1", "I2_TITLE2"],
                                itemIcon: ["fa fa-bath", "fa fa-bath"],
                                values: [
                                    {
                                        valueTitle: "V1_TITLE",
                                        valueIcon: "fa fa-user-circle-o",
                                        jsonpath: "v1",
                                        valueUnit: "U1",
                                    },
                                    {
                                        valueTitle: "V2_TITLE",
                                        valueImgIcon: "modules/MMM-ValuesByNotification/icons/tom.jpg",
                                        jsonpath: "v2",
                                        valueUnit: "U2",
                                    },
                                ]
                            },
                        ]
                    },

                    {
                        groupTitle: ["G2_TITLE1"],
                        groupIcon: "fa fa-shower",
                        items: [
                            {
                                notification: "TEST3",
                                itemTitle: "I1_TITLE1",
                                itemIcon: "fa fa-bath",
                                values: [
                                    {
                                        valueTitle: "V1_TITLE",
                                        valueIcon: "fa fa-address-book",
                                        jsonpath: "v1",
                                        valueUnit: "U1",
                                    },
                                    {
                                        valueTitle: "V2_TITLE",
                                        valueIcon: "fa fa-address-book",
                                        jsonpath: "v2",
                                        valueUnit: "U2",
                                    },
                                ]
                            },
                        ]
                    },
                ]
            },
        },
