		{
			module: "MMM-ValuesByNotification",
			position: "top_left",
			header: "Module-1",
			config: {
				classes: "module1",
				updateInterval: 10,
				reuseCount: 20,
				groups: [
					{
						classes: "group1",
						groupTitle: "Group-1",
						items: [
							{
								itemTitle: "Item-1",
								notification: "TEST1",
								thresholds: [
									{
										type: "lt",
										value: 0,
										classes: "lt0"
									},
								],
								values: [
									{
										valueTitle: "Value-1",
										valueUnit: "°C",
										jsonpath: "temperature",
									},
								]
							},
							{
								itemTitle: "Item-2",
								notification: "TEST2",
								values: [
									{
										valueTitle: "Value-2",
										valueUnit: "%rH",
										jsonpath: "humidity",
									},
								]
							},
						]
					},
					{
						classes: "group2",
						groupTitle: "Group-2",
						items: [
							{
								itemTitle: "Item-1",
								itemIcon: ["fa fa-thermometer-full", "fa fa-tint"],
								itemPositions: "tie",
								notification: "TEST1",
								values: [
									{
										valueTitle: "Value-1",
										valueUnit: "°C",
										jsonpath: "temperature",
									},
									{
										valueTitle: "Value-2",
										valueUnit: "%rH",
										jsonpath: "humidity",
									},
								]
							},
							{
								itemTitle: ["Item-2","Item-2"],
								notification: "TEST2",
								values: [
									{
										valueTitle: "Value-1",
										valueUnit: "°C",
										jsonpath: "temperature",
									},
									{
										valueTitle: "Value-2",
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
		{
			module: "MMM-ValuesByNotification",
			position: "top_right",
			header: "Module-2",
			config: {
				classes: "module2",
				updateInterval: 20,
				reuseCount: 10,
				groups: [
					{
						classes: "group1",
						groupTitle: "Group-1",
						items: [
							{
								itemImgIcon: "modules/MMM-ValuesByNotification/icons/tom.jpg",
								itemPositions: "ie",
								notification: "TEST1",
								values: [
									{
										valueTitle: "Value-1",
										valueUnit: "°C",
										jsonpath: "temperature",
									},
									{
										valueTitle: "Value-2",
										valueUnit: "%rH",
										jsonpath: "humidity",
									},
								]
							},
							{
								itemTitle: ["Item-2.1","Item-2.2"],
								itemImgIcon: ["modules/MMM-ValuesByNotification/icons/tom.jpg", "modules/MMM-ValuesByNotification/icons/tom.jpg"],
								itemPositions: "eit",
								notification: "TEST2",
								values: [
									{
										valueTitle: "Value-1",
										valueUnit: "°C",
										jsonpath: "temperature",
									},
									{
										valueTitle: "Value-2",
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
