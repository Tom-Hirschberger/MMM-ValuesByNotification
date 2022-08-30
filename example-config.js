		{
			module: "MMM-ValuesByNotification",
			position: "top_center",
			header: "Sensors",
			classes: "pageOne pageTwo",
			config: {
				animationSpeed: 500,
                updateInterval: 30,
				positions: "tivu",
				reuseCount: 1,
				naValue: "na",
				title: null,
				icon: null,
				valueUnit: null,
				valueFormat: "Number(${value}).toFixed(2)",
				jsonPath: null,
				profiles: null,
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
						items: [
							{
								notification: "TEST1",
								reuseCount: 1,
								naValue: "notYet",
								positions: "itvu",
								valueFormat: "${value}",
								valueUnit: "",
								title: "Test1",
								values: [
									{
										title: "Temperatur",
										classes: "temperature",
										icon: "fa fa-thermometer-empty",
										jsonpath: "temperature",
										valueFormat: "Number(${value}).toFixed(2)",
										valueUnit: "°C",
										positions: "tivu",
										naValue: -99,
										profiles: "pageC",
										thresholds: [
											{
												icon: "fa fa-thermometer-full",
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
										positions: "ivut",
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
										positions: "iutv",
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
								icon: "fa fa-font"
							}
						]
					}
				]
			},
		}
