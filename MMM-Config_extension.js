$(document).on('form_loaded', function () {

  /* setup onclick handlers for the delete and deletecurrent buttons
    add is handled by and onchange handler in the schema */
  $('.m_MMM-ValuesByNotification .transformerFunctions [class$="-deletecurrent"]')
  	.each(function(x,i){
			$(i).on('click', function(e){updatevalueTransformerlist('currentdeleted',e)})
		})
	$('.m_MMM-ValuesByNotification .transformerFunctions [class$="-deletelast"]').each(function(x,i){
		$(i).on('click', function(e){updatevalueTransformerlist('deleted',e)})
	})

	/* thresholds are dual type.. need to surface the correct one, base on data
	   both are hidden in CSS  as we can't do this in css yet */

	$('.m_MMM-ValuesByNotification div[class$="threshtype"] option:selected').each(
		// process each
		function(i,t){
			// get its selected option text for this threshold structure
			var selected_option_value=$(t).val(); //.text() contains the visible value from titlemap, .val() contains the enum value
																						// if no title map .text() and .val() are the same
			// look above the select to the next element that encloses select and the custom fields (fieldset)
			// this is all one clause, just split over multiple lines for clarity
			$(t).closest('fieldset')
				// find below the fieldset to find the appropriate div with the right class,
				.find('div[class$="_'+selected_option_value+'"]')  // depends on the htmlClass option in the schema
					// and set its display style property to block,
				  // previously set to display:none by MMM-Config.extension.css
					.css('display','block')
		}
	)

})

function updatevalueTransformerlist(type, event){
		alert(type+ "button pressed")
  let functionNames= []

  let anchor
	if(type !== 'field update'){
		if(type === 'list update')
			anchor=$(event.target).closest('ul').closest('.controls')
		else
			anchor=$(event.target).closest('.controls')

		anchor.find('ul li .transformerFunctionName input').each(function(i,e){
			functionNames.push($(e).val())
		})
		fixvalueTransFormerlists(anchor, functionNames, type, event)
	}
}

function fixvalueTransFormerlists(start, functionNames, trigger, event){
	let deleted
	if(	trigger === 'currentdeleted'){
		// get its name (need to be in context of the)
		deleted= $(event.target).closest('li').find('input[type="text"]').val()
	}
	// this will get ALL the valueTransformer list UL across the entire doc at once
	let listsToFix=start.closest('.moduleConfig').find('.valueTransformerlist ul')
	// loop thru the ul lists
	listsToFix.each(
		function(i,list){
			let mapped_functions=[]
			// get the list of transformers usable (li)
			// save it, order may be different on every list if user changed it
			$(list).find('li input[type="text"]').each(function(t,input){
				// get the name on this li
				let fn = $(input).val()
				mapped_functions.push(fn)
			})
			// if a current item function was deleted
			if(	trigger === 'currentdeleted'){
				// delete it from the list
				deletitemfromlist(list, deleted)
			} else
					// delete last item
					if(mapped_functions.length > functionNames.length && trigger === 'deleted') {
						// get the name of the last entry
						let missing = mapped_functions.filter(x=> !functionNames.includes(x))
						// and where it fit in the array
						let index=mapped_functions.indexOf(missing[0])
						// delete it
						deletitemfromlist(list, missing)
					} else
							// new function added to end, so not yet shown in the usable transformers list
							if(mapped_functions.length <= functionNames.length && trigger === 'list update'){  // catch new function or name change
								// also handle if the function name is changed
								let newentry = functionNames.filter(x=> !mapped_functions.includes(x))  // find the new one
								let oldentry = mapped_functions.filter(x=> !functionNames.includes(x))  // find any old one
									if(newentry.length)
								  	addItemToList(list,newentry[0])
								  if(oldentry.length)
								  	deletitemfromlist(list,oldentry[0])
							}
		}
	)
}

function deletitemfromlist(list, itemname){
		let target= $(list).find('input[type="text"][value="'+itemname+'"]').closest('li').find('[class$="-deletecurrent"]')
		target.trigger("click")
}

function addItemToList(list, itemname){
		let target= $(list).closest('.controls').find('[class$="-addmore"]')
		target.trigger("click")
		// we don't know how long this will take, so wait a short amount of time
		// these fields would be offscreen so the user should never see the actual new field, and then field fill
	  setTimeout(()=>{
	  	// the field was added to the end of the ul we are pointing to
	  	// so find the last li child, its input field, and set its value
	  	$(list).find('li:last-child input[type="text"]').val(itemname)
	  }, 250)
}