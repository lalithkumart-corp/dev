if(typeof gs == 'undefined'){
    var gs = {};
}
gs.popup = {
	selectors: {
		overlay : '.msgModal_overlay',
		container: '.msgModalContainer',
		title: '#msgHeaderText',
		msgBody: '#msgBodyText'
	},
	defaults: {
		text 	: '',
		header 	: ''
	},
	dismissButtonId: 'msgDismissButton',
	enableHtml: true,
	init: function(options){
		var $popup = gs.popup;
		if(_.isUndefined(options))
			var options = {};
		$popup.hide();
		$popup.msgDescription = options.desc || '';
		$popup.msgHeader = options.title || '';
		$popup.buttons = options.buttons || '';
		$popup.callbacks = options.callbacks;
		$popup.onHiddenCallback = options.onHiddenCallback || '';
		$popup.onShownCallback = options.onShownCallback || '';
		$popup.dismissBtnText = options.dismissBtnText || 'Cancel';
		$popup.enableHtml = !_.isUndefined(options.enableHtml)?options.enableHtml:true;
		$popup.animationObj.init(options);	
		$popup.renderPopup();
	},
	renderPopup: function(){
		var $popup = gs.popup;
		var property = {};
		var template = _.template(template_htmlstr_msgBox, property);
		$('body').append(template);
		$popup.addTitle();
		$popup.addDescription();
		$popup.createButtons();		
		$popup.show();
		$popup.bindEvents();
	},
	addTitle: function(){
		var $popup = gs.popup;
		if($popup.enableHtml)
			$($popup.selectors.title).html($popup.msgHeader);
		else
			$($popup.selectors.title).text($popup.msgHeader);
	},
	addDescription: function(){
		var $popup = gs.popup;
		if($popup.enableHtml)
			$($popup.selectors.msgBody).html($popup.msgDescription);
		else
			$($popup.selectors.msgBody).text($popup.msgDescription);
	},
	createButtons: function(){
		var $popup = gs.popup;
		if(!_.isUndefined($popup.buttons)){
			_.each($popup.buttons, function(value, index){
				var aButtonHtml = '<input type="button" id="btn'+index+value+'" value= "'+value+'"/>'
				$('#msgFooterDiv').append(aButtonHtml);
			});
		}

		//add default cancel button
		var dismissBtn = '<input type="button" id="'+$popup.dismissButtonId+'" value="'+$popup.dismissBtnText+'"/>';
		$('#msgFooterDiv').append(dismissBtn);
	},
	bindEvents: function(){
		var $popup = gs.popup;
		if(!_.isUndefined($popup.buttons)){
			_.each($popup.buttons, function(value, index){
				$('#btn'+index+value).on('click', function(event){
					var callBackMeth = $popup.callbacks[index];
					if(!_.isUndefined(callBackMeth))
						callBackMeth();
				});
			});
		}
		

		$('#'+this.dismissButtonId).off().on('click', function(){
			$popup.hide();
		});
	},
	show: function(callback){
		var $popup = gs.popup;
		debugger;
		$($popup.selectors.overlay).show();
		$($popup.selectors.container).show();
		$popup.animationObj.showAnimation();
		$popup.onShown();
	},
	onShown: function(){
		var $popup = gs.popup;
		$popup.setBtnFocus();
		if(!_.isUndefined($popup.onShownCallback) && $popup.onShownCallback !== ''){
			var callBackMeth = $popup.onShownCallback;
			callBackMeth();
		}
	},
	setBtnFocus: function(){
		var $popup = gs.popup;
		console.log($('#'+$popup.dismissButtonId));
		$('#msgFooterDiv input')[0].focus();
	},
	hide: function(){
		var $popup = gs.popup;
		if($($popup.selectors.container).length != -1){			
			$($popup.selectors.container).remove();
			$($popup.selectors.overlay).remove();
			$popup.onHidden();
			$popup.clearObjects();
		}
	},
	onHidden: function(){
		var $popup = gs.popup;
		if(!_.isUndefined($popup.onHiddenCallback) && $popup.onHiddenCallback !== ''){
			var callBackMeth = $popup.onHiddenCallback;
			callBackMeth();
		}
	},
	clearObjects: function(){
		var $popup = gs.popup;
		$popup.msgDescription = '';
		$popup.msgHeader = '';
		$popup.buttons = '';
		$popup.callbacks = [];
		$popup.onHiddenCallback = '';
		$popup.onShownCallback = '';
		$popup.dismissBtnText = 'Cancel';
		$popup.enableHtml = true;
		$popup.animationObj.effect = '';
	},
	animationObj: {
		effect: '',
		init: function(options){
			var $animation = gs.popup.animationObj;
			if(!_.isUndefined(options.animate))
				$animation.effect = options.animate;
		},
		showAnimation: function(){
			var $animation = gs.popup.animationObj;
			switch($animation.effect){
				case 'bounce':
					$animation.bounce();
					break;
				case 'blinkingIn':
					$animation.blinkingIn();
					break;
				case 'blinkingOut':
					$animation.blinkingOut();
					break;
			}
		},
		bounce: function(){
			$(gs.popup.selectors.container).fadeIn(100).animate({top:"-=20px"},100).animate({top:"+=20px"},100).animate({top:"-=20px"},100).animate({top:"+=20px"},100).animate({top:"-=20px"},100).animate({top:"+=20px"},100);
		},
		blinkingIn: function(){
			$(gs.popup.selectors.container).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
		},
		blinkingOut: function(){
			$(gs.popup.selectors.container).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
		}
	},

	//short and quick method to just show a msg
	showMsg: function(title, description, btnText, animate){
		var $popup = gs.popup;
		$popup.hide();
		$popup.msgDescription = description;
		$popup.msgHeader = title;
		$popup.dismissBtnText = btnText;
		$popup.animationObj.effect = animate || '';
		$popup.renderPopup();
	}
}