;
/**
 * @summary: A Loader spinner built for Girvi software.
 * @created: 10 April 2017
 * @author: Lalith Kumar
 * @implementation: 
	# To show
		- gs.spinner.show('containerId', 'optionalClassName') <- for adding spinner to particular container
		- gs.spinner.show(); <- for adding spinner to body container
	# To Hide
		- gs.spinner.hide('containerId', 'optionalClassName') <- for removing spinner from a particular container
		- gs.spinner.hide() <- for removing spinner appended to body.
        - gs.spinner.hideAll() <- for removing all spinners in the page.
    # Handling multiple spinners.
        - Triggering multiple spinner is possible. However, a single spinner will get displayed. And the count will be handled using stack.
        - If spinner display called multiple times, then hiding those should also be triggered multiple times, or else use hideAll() method to hide all spinners in the page.
 * @note(hint): if applying spinner to specific container, make sure with the container position to be as 'relative'.
*/
if(typeof gs == 'undefined')
    gs = {};
	
gs.spinner = (function(){
	var stack = [];
	var selectors = {
		overlay : '.spinner-overlay',
		spinner: '.spinner-container',
		body: 'body'
	};
	var classes = {
		overlay: 'spinner-overlay',
		spinner: 'spinner-container',
		msg : 'spinner-text',
		image: 'spinner-image',
		filterSpinner: 'filter-spinner'
	};
	var filePaths ={
		loadingGif: '/images/action-loading.gif'
	};

	function create(params){
		if(params.isFilterInput)
			elmnts = getSpinnerElements('filterInput', params);
		else if(params.onlySpinner)
			elmnts = getSpinnerElements('onlySpinner', params);
		else if(params.background == '')
			elmnts = getSpinnerElements('noOverlay', params);
		else
			elmnts = getSpinnerElements(undefined, params);
		
		return elmnts;
	}

	function getSpinnerElements(option, params){
		var spinnerElm, overlayElm, elmnts;
		var secondaryClass = getSecondaryClass(params.container);
		switch(option){
			case 'filterInput':
			case 'onlySpinner':
				spinnerElm = '<span class="'+ classes.spinner +' '+ params.className +' '+ secondaryClass +' '+ params.background +'"><img class="'+classes.image+'" src="'+ filePaths.loadingGif +'"></span>';
				elmnts = ['', spinnerElm];
				break;
			case 'noOverlay':
				spinnerElm = '<div class="'+ classes.spinner +' '+ params.className +' '+ secondaryClass +' '+ params.background +'"> <p class="'+ classes.msg +'">Loading...</p> <img class="'+classes.image+'" src="'+ filePaths.loadingGif +'"> </div>'
				elmnts = ['', spinnerElm];
				break;
			default:
				overlayElm = '<div class="'+ classes.overlay +' '+ params.className +' '+ secondaryClass +' '+ params.background +'"></div>';
				spinnerElm = '<div class="'+ classes.spinner +' '+ params.className +' '+ secondaryClass +' '+ params.background +'"> <p class="'+ classes.msg +'">Loading...</p> <img class="'+classes.image+'" src="'+ filePaths.loadingGif +'"> </div>'
				elmnts = [overlayElm, spinnerElm];
				break;
		}
		return elmnts;
	}
	
	function append(container, elmnts){
		$(container).append(elmnts[0]); //append overlay to the container
		$(container).append(elmnts[1]); //append spinner to the container
	}

	function remove(container){
		var secondaryClass = getSecondaryClass(container);
		$(container + " ."+ classes.overlay +"."+secondaryClass).remove(); //Remove the Modal background
		$(container + " ."+ classes.spinner +"."+secondaryClass).remove(); //Remove the Spinner
	}

	function adjustStyles(container, action, isFilterInput){
		var secondaryClass = getSecondaryClass(container);
		var overlaySelector = container + ' .'+ classes.overlay +'.'+secondaryClass;
        var spinnerSelector = container + ' .'+ classes.spinner +'.'+secondaryClass;
		switch(action){
			case 'add':
				if(isFilterInput){
					$(container).addClass(classes.filterSpinner);
				}else if(container == 'body'){
					$(overlaySelector + ', ' + spinnerSelector).css('position','fixed');
					//$(selectors.body).css({ height: "100%", overflow: "hidden"});
				}else{
					$(overlaySelector).css('z-index','1000');
					$(spinnerSelector).css('z-index','1001');
					$(container).css('position', 'relative');
				}
				break;
			
			case 'remove':
				if(container == selectors.body) //Re-Adjust the css.
					$(selectors.body).css({ height: "", overflow: ""});
				else if(isFilterInput)
					$(container).removeClass(classes.filterSpinner);
				break;
		}	
	}

	/**
	 * On Action = 'add' spinner:
	  		- Push container id into stack
	  		- Set flag to prevent displaying the spinner again, if the container already has a spinner
	 * On Action = 'remove' Spinner:
	  		- Pop container id from stack
	  		- Set flag, whether to confirm remove spinner from the container. Since, if trying to call spinner for a container multiple times, then removing the spinner also done at the last call only. If it is not last call, then just update the stack.
	 */
	function validateStack(container, action){
		var index = stack.indexOf(container);
		var condition = false;
		switch(action){
			case 'add':
				stack.push(container);
				if(index == -1)
					condition = true;
				break;
			case 'remove':
				if(index != -1){
					stack.splice(index, 1);
					var newIndex = stack.indexOf(container);
					if(newIndex == -1)
						condition = true;
				}
				break;
		}
		return condition;
	}

	function validateContainer(container){
		if(container == "" || typeof container == "undefined") //Handle Empty values and undefined type
			container = selectors.body;
		return container;
	}

	function validateClassName(className){
		if(typeof className == "undefined")
			className = '';
		return className;
	}

	function validateBGFlag(flag){
		if(typeof flag == "undefined")
			flag == '';
		switch(flag){
			case true:
				flag = 'hasBackground'; 
				break;
			case false:
				flag = '';
				break;
			case 'semi':
				flag = 'hasSemiBackground';
				break;
			default:
				flag = 'hasBackground';
				break;
		}
		return flag;
	}

	/** Generate secondary class from the container id/class where the spinner element will get displayed */
	function getSecondaryClass(container){
		var secondaryClass = container.replace(/\.|#|\s/g,'') +'Class';
		return secondaryClass;
	}

	function validateArgument(arg, aCase){
		var validatedArg;
		switch(aCase){
			case 'filter':
			case 'onlySpinner':
				if(_.isUndefined(arg))
					arg = false;
				if(arg == 'false')
					arg = false;
				if(arg == 'true')
					arg = true;
				validatedArg = arg;
				break;
		}
		return validatedArg;
	}

    /**
	 * @summary: To display the loading spinner with overlay background
     * @param {String} containerId :particular id of a div, to which loading spinner has to shown.
	 * @param {String} background: for overlay. Possible values: true, false and additionally we can pass, 'semi' also for applying white background only for the Loading text.
     * @param {String} options.className :  class name can be added to the spinner& overlay element mainly for adding custom css styles based on this classname.
	 * @param {String} options.isFilterInput : To show the loading spinner image alone in the filter input box.
	 * @note(hint): if applying spinner to specific container, make sure with the container position to be as 'relative'.
     */
	function show(container, background, options){
		if(_.isUndefined(options))
			var options = {};
		container = validateContainer(container);
        className = validateClassName(options.className);
		isFilterInput = validateArgument(options.isFilterInput, 'filter');
		onlySpinner = validateArgument(options.onlySpinner, 'onlySpinner');
		background = validateBGFlag(background);
		
		var elmnts = create({
			className: className,
			container: container,
			background: background,
			isFilterInput: isFilterInput,
			onlySpinner: onlySpinner
		});
		if(!validateStack(container, 'add'))
			return;
		append(container, elmnts);
		adjustStyles(container, 'add', isFilterInput);
		$(selectors.overlay).show(); //Show the Modal background
		$(selectors.spinner).show(); //Show the Spinner
	}

    /**
	 * @summary: To remove the spinner and overlay.
     * @param {String} containerId :particular id of a div, under which the spinner has to be removed.
     */
	function hide(container, options){
		options = options || {};
		container = validateContainer(container);
		isFilterInput = validateArgument(options.isFilterInput, 'filter');
		if(!validateStack(container, 'remove'))
			return;
		remove(container);
		adjustStyles(container, 'remove', isFilterInput);
	}

	/**
	 * To Remove all spinners diplayed on the page.
	 */
	function hideAll(){
		stack = [];
		$(selectors.overlay).remove();
		$(selectors.spinner).remove();
		$(selectors.body).css({ height: "", overflow: ""});
	}

	return {
		show: show,
		hide: hide,
		hideAll: hideAll
	}
})();