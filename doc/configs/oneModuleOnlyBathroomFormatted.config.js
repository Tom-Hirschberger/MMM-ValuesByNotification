		{
			module: "MMM-ValuesByNotification",
			position: "top_left",
			header: "Module-1",
			config: {
				groups: [
					{
						items: [
							{
								notification: "TEST1",
								itemTitle: "Bathroom",
								values: [
									{
										valueUnit: "°C",
										valueFormat: "Number(${value}).toFixed(2)",
										jsonpath: "temperature",
									},
									{
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
