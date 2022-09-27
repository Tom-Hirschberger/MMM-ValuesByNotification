		{
			module: "MMM-ValuesByNotification",
			position: "top_center",
			header: "Sensors",
			classes: "pageL4 pageC",
			config: {
				animationSpeed: 500,
				updateInterval: 10,
				//valuePositions: "ti[vu]",
				reuseCount: 1,
				naValue: "na",
				valueTitle: null,
				itemTitle: null,
				groupTitle: null,
				valueIcon: null,
				valueUnit: null,
				valueFormat: "Number(${value}).toFixed(2)",
				jsonPath: null,
				profiles: null,
				classes: null,
				thresholds: [
					{
						type: "gt",
						value: 50,
						classes: "warn"
					},
					{
						type: "gt",
						value: 75,
						classes: "critical"
					},
				],
				groups: [
					{
						classes: "test1GroupClass",
						groupTitle: "test1Group",
						valueTitle: "outerValueTitle1",
						items: [
							{
								itemTitle: "testItem",
								notification: "TEST1",
								reuseCount: 6,
								classes: "test1ItemClass",
								naValue: "notYet",
								//valuePositions: "it[vu]",
								valueFormat: "${value}",
								valueUnit: "",
								valueTitle: "middleValueTitle1",
								values: [
									{
										valueTitle: "Temperatur",
										classes: "temperature",
										valueIcon: "fa fa-thermometer-empty",
										jsonpath: "temperature",
										valueFormat: "Number(${value}).toFixed(2)",
										valueUnit: "°C",
										positions: "ti[vu]",
										naValue: -99,
										profiles: "pageC",
										thresholds: [
											{
												valueIcon: "fa fa-thermometer-full",
												type: "gt",
												value: 100,
												classes: "gt100"
											},
											{
												type: "lt",
												value: 50,
												classes: "lt50"
											},
											{
												type: "eq",
												value: 55,
												classes: "eq55"
											},
										]
									},
									{
										title: "Feuchte",
										classes: "moisture, moisture2",
										jsonpath: "moisture",
										valueFormat: "{value}",
										valueUnit: "%rH",
										valuePositions: "i[vu]t",
										thresholds: [
											{
												type: "gt",
												value: 100,
												classes: "gt100"
											},
											{
												type: "lt",
												value: 50,
												classes: "lt50"
											},
											{
												type: "eq",
												value: 55,
												classes: "eq55"
											},
										]
									},
									{
										jsonpath: "battery",
										valueFormat: "{value}",
										valueUnit: "%",
										//valuePositions: "iutv",
										thresholds: [
											{
												type: "lt",
												value: 10,
												classes: "lt10"
											},
											{
												type: "lt",
												value: 25,
												classes: "lt25"
											},
											{
												type: "lt",
												value: 50,
												classes: "lt50"
											},
											{
												type: "lt",
												value: 75,
												classes: "lt75"
											},
											{
												type: "gt",
												value: 75,
												classes: "gt75"
											}
										]
									},
								]
							},
							{
								notification: "Test2",
								reuseCount: 2,
								title: "Test2",
								thresholds: [
									{
										type: "gt",
										value: 200,
										classes: "gt200"
									},
									{
										type: "lt",
										value: 45,
										classes: "lt45"
									},
								]
							}
						]
					},
					{
						profiles: "pageL4",
						items: [
							{
								notification: "Test3",
								reuseCount: 3,
								valueIcon: "fa fa-font"
							}
						]
					}
				]
			},
		}