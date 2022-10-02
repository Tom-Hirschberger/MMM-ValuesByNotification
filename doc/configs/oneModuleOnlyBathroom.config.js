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
										jsonpath: "temperature",
									},
									{
										valueUnit: "%rH",
										jsonpath: "humidity",
									},
								]
							},
						]
					},
				]
			},
		},
