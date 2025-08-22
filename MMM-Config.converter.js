/* MMM-ValuesByNotification converter */

const debug=false

const data_items = {
	  base: [
	  	"transformerFunctions",//
	  	"valueTransformers",//
			"groupsPositions",//
			"groupPositions",//
			"itemPositions",//
			"valuePositions",//
			"classes", //
			"thresholds",//
			"groupsIcon", //
			"groupsImgIcon",//
			"groupIcon",  //which is the default font awesome 4.7 icon to use for groups
			"groupImgIcon", //which is the default image icon url to use for groups
			"itemIcon", //which is the default font awesome 4.7 icon to use for items
			"itemImgIcon", //which is the default image icon url to use for items
			"valueIcon", //which is the default font awesome 4.7 icon to use for values
			"valueImgIcon",
			"groupsTitle",
			"groupTitle",
			"itemTitle",
			"valueTitle"
		],

		groups:[
		// group
			"groupIcon",
			"groupImgIcon",
			"classes",
			"profiles",
			"groupPositions",
			"groupTitle"
		],

		// item
		items:[
	    "itemPositions",
			"itemIcon",
			"itemImgIcon",
			"classes",
			"profiles",
			"values",
			"itemTitle"
		],

		//value
		values: [
			"valueTransformers",
			"valueIcon",
			"valueImgIcon",
			"valuePositions",
			"valueNaPositions",
			"thresholds",
			"classes",
			"threshold",
			"profiles",
			"valueTitle"
		],
		// thresholds
		thresholds:[
			"valuePositions",
			"classes",
			"valueImgIcon",
			"valueIcon",
			//"type",
			"value",
			"threshtype"
		]
}

	function clone(x){
		return JSON.parse(JSON.stringify(x,tohandler),fromhandler)
	}
  function tohandler(key, value) {
    if (typeof value === "function") {
      return value + ""; // implicitly `toString` it
    }
    return value;
  }
  function fromhandler(key, value) {
    if (
      value &&
      typeof value == "string" &&
      (value.startsWith("(") || value.startsWith("function(")) &&
      value.endsWith("}")
    ) {
      return eval("(" + value + ")");
    }
    return value;
  }

function fixupImgList(item, type, direction){
	if(direction === 'toForm'){
		if(type.endsWith("ImgIcon")){
			//
			const nf = type.replace('Img','')
			if(item[nf] === undefined){
				item[nf] = []
				item[nf].push(clone(item[type]))
			}
			else{
				if(debug)
					console.log("type of ="+ typeof item[type])
				item[nf].push.apply(item[nf], clone(item[type]))
			}
		  delete item[type]
		} else if(type.endsWith("Icon")){
			if(typeof item[type] === 'string'){
				let x = []
				x.push(item[type])
				item[type]=clone(x)
			}
		}

	} else {
		if(type.endsWith("Icon")){
			if(debug)
				console.log("type=", type)
		  let stringToInsert = "Img";
    	let insertIndex = type.length-4;
    	const nf = type.slice(0, insertIndex) + stringToInsert + type.slice(insertIndex);
    	if(item[type] === undefined)
    		item[type]=new Array()
    	if(typeof item[type] === 'string'){
    			let x = []
    			x.push(clone(item[type]))
    			item[type]=x
    	}
			//const nf = type.splice(type.length-4,0,)
			//const nf = type.slice(0, startIndex) + type.slice(startIndex + deleteCount);
			if(debug)
				console.log("found Icon field=",item[type], " icon field=",item[nf], "nf=",nf)
			// initialize the ImgIcon field here
			item[nf]=new Array()
			// loop thru entries in icon field, has both icon and ImgIcon
			item[nf]=item[type].filter(x=>{
				// if the ImgIcon field doesn't include the item from the Icon field,
				// make it part of the new Icon field
				if(x.includes('/'))
					return true
				else
					return false
			})

			// loop thru entries in icon field, has both icon and ImgIcon
			item[type]=item[type].filter(x=>{
				// if the ImgIcon field doesn't include the item from the Icon field,
				// make it part of the new Icon field
				if(!item[nf].includes(x))
					return true
				else
					return false
			})
			if(item[nf].length===0)
				delete item[nf]
			if(item[type].length===0)
				delete item[type]
		}
	}
}

function fixup_valueTransformerList(list, used){
	let used_functions=[]
	if(debug) console.log("l="+used.length)
	if(used.length<1){
		list.forEach(f=>{
				if(typeof used === 'string' || Array.isArray(used)) {   // convert FROM string to array of objects
					let usedfn= { used:false, name:f}
					if(used && used.includes(f))
						usedfn.used=true
					used_functions.push(usedfn)
			  } else {
			  	let fn_array=[]
			  	used.forEach(fn=>{
			  		if(fn.used)
			  			fn_array.push(fn.name)
			  	})
			  	used_functions= fn_array.join(" ")
			  }
		})
	} else {
		// if string
		if(!Array.isArray(used)){
			if(debug) console.log("used is NOT an array, aka string=", used)
			used.split(" ").forEach(vtn=>{
				used_functions.push({used:true,name:vtn})
			})
			list.forEach(vtn=>{
				if(debug) console.log("checking full function list ", list, " for ",vtn)
				if(!used.includes(vtn)){
					if(debug) console.log("adding unused function to list for selection=", vtn)
				  used_functions.push({used:false,name:vtn})
				}
			})
			if(debug) console.log("used functions =", used_functions)
		} else {
			if(debug) console.log("used IS an array", used)
			used.forEach(usedfn=>{
				if(usedfn.used)
					used_functions.push(usedfn.name)
			})
			used_functions= used_functions.join(' ')
		}
	}

	return used_functions
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function converter(config_data, direction){
	/* fields to convert , and how
		positions to form, = split string to array of strings, from= array join with null to make one string
		config.groupsPositions
		config.groupPositions
		config.itemPositions
		config.valuePositions

		thresholds , convert from object to
		config.thresholds[].forEach()
		      to form,
          valuePositions string to array of chars
          classes string to array of words
          Icon/imgIcon merge to icon Object.assign
		      value typeof string
		          threshtype = string
		          value -> valuestring
		      else typeof number
		          threshtype = number
		          value -> valuenumber

					from form
					valuePositions array of chars to string (join, "")
          classes string to array of words string (join " ")
          Icon.forEach()
              split to Icon/imgIcon  (if contains path '/'), else Icon (push each)
		      threshtype
		          value = valuestring
		      else typeof number
		          value = valuenumber


		classes, string, to = split on space to array , from =array join w space to string
		config.classes

		Icon/ImgIcon to array in Icon, to form, merge arrays to one array in Icon field, from= form two arrays, with path go to ImgIcon, else Icon
		config.groupsIcon
		config.groupsImgIcon
		config.groupIcon
		config.groupImgIcon
		config.itemIcon
		config.itemImgIcon
		config.valueIcon
		config.valueImgIcon

		config.group[].items[].values[] forEach()
		    classes
		    valuePositions
		    valueNaPositions
		    thresholds
		    itemIcons
		    itemPositions
		    profiles


		transformerFunctions, from hash name/function, to array with functioname in editor, from = array to hash
		valueTransformers array to checkbox list of selected vs defined in transformerFunctions
		*/
	let fn_names=[]
	if (direction == 'toForm'){

		Object.keys(data_items).forEach(key=>{

			 switch(key){

			 case 'base':
			 			data_items[key].forEach(type=>{
			 				if(config_data[type]){
				 				switch(type){
				 						case 'transformerFunctions':
											fn_names=Object.keys(config_data[type])
											let fn_array=[]
											fn_names.forEach(f=>{
												let fe = { name:f, function:config_data[type][f]}
												fn_array.push(fe)
											})
											config_data[type] = fn_array
											break;
										case 'valueTransformers':
											config_data[type] = fixup_valueTransformerList(fn_names, config_data[type])
											break;
										case "groupsPositions":
										case "groupPositions":
										case "itemPositions":
										case "valuePositions":
											//console.log("config-type ="+config_data[type]+" type="+type)
											//console.log("type="+typeof config_data[type])
											config_data[type]= config_data[type].split('')
										  break;
										case "groupTitle":
										case "groupTitle":
										case "itemTitle":
										case "valueTitle":
											//console.log("config-type ="+config_data[type]+" type="+type)
											//console.log("type="+typeof config_data[type])
											if(typeof config_data[type] ==='string'){
												let x = []
												x.push(clone(config_data[type]))
												config_data[type]=x
											}
										  break;
										case "classes":
										case "profiles":
											//console.log("2 config-type ="+config_data[type]+" type="+type)
											//console.log("2 type="+typeof config_data[type])
											config_data[type]=config_data[type].split(" ")
											break;
										case "thresholds":
											break;
										default:
											// add the
											if(type.endsWith("Icon")){
												fixupImgList(config_data,type, direction)
											}
											break
								}
							}
						})

			 	break;
			 case "groups":
							if(config_data[key]){
								config_data[key].forEach(group=>{
									// process all of the group specific items
									data_items[key].forEach(type=>{
										if(group[type]){
											switch(type){
												case "classes":
												case "profiles":
													group[type]=group[type].split(" ")
												break;
												case 'groupPositions':
													group[type]=group[type].split("")
													break;
											default:
													if(type.endsWith("ImgIcon")){
														fixupImgList(group,type, direction)
													}
											}
										}
									})

									group.items.forEach(item=>{
										data_items['items'].forEach(type=>{
											if(debug)
												console.log("processing item field ", type)
											if(item[type]){
												switch(type){
													case "itemPositions":
														item[type]= item[type].split('')
													  break;
													case "classes":
													case "profiles":
														item[type]=item[type].split(" ")
														break;
													case "itemTitle":
														if(typeof item[type] ==='string'){
															let x = []
															x.push(clone(item[type]))
															item[type]=x
														}
													  break;
													case 'values':
														item[type].forEach(v=>{
														  data_items[type].forEach(vt=>{
														  	if(debug)
														  		console.log(" item value type ", item, )
														  	if(v[vt]){
														  		switch(vt){
																		case "valuePositions":
																		case "valueNaPositions":
																			v[vt]= v[vt].split('')
																		  break;
																		case "classes":
																		case "profiles":
																			v[vt]=v[vt].split(" ")
																			break;
														  			case "valueImgIcon":
														  			case "valueIcon":
														  					fixupImgList(v,vt, direction)
																		  break;
																		case "valueTitle":
																			if(typeof v[vt]==='string'){
																				let x=[]
																				x.push(clone(v[vt]))
																			  v[vt]=x
																			}
																		  break;
																		case "thresholds":
																				v[vt].forEach(thi=>{  // threshold item
																					if(debug)
																						console.log("processing threshold=", thi, data_items[vt])
																					data_items[vt].forEach(ti=>{
																						if(thi[ti]){
																							if(debug)
																								console.log("threshold item", ti)
																							switch(ti){
																								case 	"valuePositions":
																									if(debug)
																										console.log("valuePositions", thi[ti])
																									thi[ti]=thi[ti].split('')
																								  break;
																								case 	"classes":
																									if(debug)
																										console.log("classes", thi[ti])
																									thi[ti]=thi[ti].split(' ')
																									break;
																								case "valueImgIcon":
																								case "valueIcon":
																									fixupImgList(thi,ti, direction)
																								  break
																								case "value":
																									if(isNumeric(thi[ti])){
																										thi['threshtype']='number'
																										thi['valuenumber']=thi[ti]
																										thi['typenumber']=thi['type']
																									} else {
																										thi['threshtype']='string'
																										thi['valuestring']=thi[ti]
																										thi['typestring']=thi['type']
																									}
																									delete thi[ti]
																									delete thi['type']
																								  break;
																								default:
																									if(debug)
																									  console.log("thi[ti]=",thi[ti])
																								  break;
																							}
																						}
																					})
																				})

																			break;
															  		case "valueTransformers":
															  			if(debug) console.log(" calling tranformerlist for ",v[vt])
																			v[vt] =  fixup_valueTransformerList(fn_names, v[vt])
																			break
																		default:
																		  break
															  	}
																}
															})
														})
													default:
														if(type.endsWith("ImgIcon")){
															fixupImgList(item,type, direction)
														}
														break;
												}

											}
										})
									}) // end of item
								})  // end of group
							} // end of if

			 	break;
			 default:
			 	break;
			 }

		})

		if(debug) console.log("new config =", JSON.stringify(config_data,tohandler, 2))
		return clone(config_data)
	}
	else if (direction == 'toConfig'){

    Object.keys(data_items).forEach(key=>{

			 switch(key){

			 case 'base':
			 			data_items[key].forEach(type=>{
			 				if(config_data[type]){
				 				switch(type){
				 						case 'transformerFunctions':
											let fn_map = {}
											config_data[type].forEach(f=>{
												if(debug) console.log("f=", f)
												fn_map[f.name]=f.function
											})
											config_data[type]=fn_map
											fn_names= Object.keys(fn_map)
											break;
										case 'valueTransformers':
											config_data[type] = fixup_valueTransformerList(fn_names, config_data[type])
											break;
										case "groupsPositions":
										case "groupPositions":
										case "itemPositions":
										case "valuePositions":
											config_data[type]= config_data[type].join('')
										  break;
										case "classes":
										case "profiles":
											config_data[type]=config_data[type].join(" ")
											break;
										case "thresholds":
											break;
										default:
											// add the
											if(type.endsWith("Icon")&& !type.endsWith('ImgIcon')){
												fixupImgList( config_data,type, direction)
											}
											break
								}
							}
						})

			 	break;
			 case "groups":
							if(config_data[key]){
								config_data[key].forEach(group=>{
									// process all of the group specific items
									data_items[key].forEach(type=>{
										if(group[type]){
											switch(type){
												case "classes":
												case "profiles":
													group[type]=group[type].join(" ")
												break;
												case "groupPositions":
													group[type]=group[type].join("")
												break;
											default:
												if(type.endsWith("Icon")&& !type.endsWith('ImgIcon')){
													if(debug)
														console.log("type=", type)
													fixupImgList( group,type, direction)
												}
											}
										}
									})

									group.items.forEach(item=>{
										data_items['items'].forEach(type=>{
											if(debug)
												console.log("processing item field ", type)
											if(item[type]){
												switch(type){
													case "itemPositions":
														item[type]= config_data[type].join('')
													  break;
													case "classes":
													case "profiles":
														item[type]=config_data[type].join(" ")
														break;
													case 'values':
														item[type].forEach(v=>{
														  data_items[type].forEach(vt=>{
														  	if(debug)
														  		console.log(" item value type ", item, )
														  	if(v[vt]){
														  		switch(vt){
																		case "valuePositions":
																		case "valueNaPositions":
																			// make string from chars
																			v[vt]= v[vt].join('')
																		  break;
																		case "classes":
																		case "profiles":
																			// make space separated
																			v[vt]=v[vt].join(" ")
																			break;
														  			case "valueIcon":
																			  fixupImgList(v, vt, direction)
																		  break;
																		case "thresholds":
																				v[vt].forEach(thi=>{  // threshold item
																					if(debug)
																						console.log("processing threshold=", thi, data_items[vt])
																					data_items[vt].forEach(ti=>{
																						if(thi[ti]){
																							if(debug)
																							  console.log("threshold item", ti)
																							switch(ti){
																								case 	"valuePositions":
																									if(debug)
																										console.log("valuePositions", thi[ti])
																									thi[ti]=thi[ti].join('')
																								  break;
																								case 	"classes":
																									if(debug)
																										console.log("classes", thi[ti])
																									thi[ti]=thi[ti].join(' ')
																									break;
																								case "valueIcon":
																									fixupImgList(thi,ti,  direction)
																								  break
																								case "threshtype":
																									if(thi[ti] === 'number'){
																										thi['type']=thi['typenumber']
																										thi['value']=thi['valuenumber']
																										delete thi[ti]
																										delete thi['typenumber']
																										delete thi['valuenumber']
																									} else {
																										thi['value']=thi['valuestring']
																										thi['type']=thi['typestring']
																										delete thi[ti]
																										delete thi['typestring']
																										delete thi['valuestring']
																									}
																									break;
																								default:
																									if(debug)
																										console.log("thi[ti]=",thi[ti])
																								  break;
																							}
																						}
																					})
																				})

																			break;
															  		case "valueTransformers":
															  			if(debug) console.log(" calling tranformerlist for ",v[vt])
																			v[vt] =  fixup_valueTransformerList(fn_names, v[vt])
																			break
																		default:
																		  break
															  	}
																}
															})
														})
													default:
														if(type.endsWith("Icon")&& !type.endsWith('ImgIcon')){
															fixupImgList(item, type, direction)
													  }
													break;
												}
											}
										})
									}) // end of item
								})  // end of group
							} // end of if

			 	break;
			 default:
			 	break;
			 }

		})

		return clone(config_data)
	}
}
exports.converter=converter