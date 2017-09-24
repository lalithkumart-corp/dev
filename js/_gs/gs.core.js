var application = {};

application.core ={
	autocompleter : {
		billClosing : false
	},
	
	bindHomeEvents : function(){
		var aSelf = application.core;
		$("#renderingTemplate").on('click', function(e){
	        var property = {};
	        var template = _.template($("#myTemplate").html(), property);
	        $('.mainContent').html(template);	       
	    });

	    
	    $('.leftMenus li').mouseover(function(e){
	        $(this).find('.dropdownLabel').show();
	        $(this).find('.dropdown').show();
	    });
	    
	    $('.leftMenus li').mouseout(function(e){
	        $(this).find('.dropdownLabel').hide();
	        $(this).find('.dropdown').hide();
	    });

	    $('.websiteName').on('click', function(e){
	    	$('.mainContent').html('');
	    });

		$('#createNewBill').on('click', function(e){
			aSelf.updatePageName('billCreationPage');
			var property = {};
			var template = _.template(template_htmlstr_billCreation, property);
			$('.mainContent').html(template);
			$('.autocomplete-suggestions').remove();
			application.bill.creation.init();
			application.bill.customDate.bindEvents('billCreation');
		});
		$('#getPledgeBook').on('click', function(e){
			aSelf.updatePageName('book');
			gs.pledgeBook.init();
		});

		$('#closeABill').on('click', function(e){
			aSelf.updatePageName('billClosingPage');
			var property = {};
			var template = _.template(template_htmlstr_billClosing, property);
			$('.mainContent').html(template);
			$('.autocomplete-suggestions').remove();
			gs.billClosing.init();
			application.bill.customDate.bindEvents('billClosingPage');
		});

		$('#tallyGenerator').on('click', function(e){
			aSelf.updatePageName('tallyPage');
			var property = {};
			var template = _.template(template_htmlstr_tally, property);
			$('.mainContent').html(template);
			$('.autocomplete-suggestions').remove();
			application.bill.customDate.bindEvents('tallyGenerator');
		});
		

		$('#tokenGenerator').on('click', function(e){
			aSelf.updatePageName('');
			var property = {};
			var template = _.template($('#tokenGeneratorTemplate').html(), property);
			$('.mainContent').html(template);
			$('.autocomplete-suggestions').remove();
			gs.generateToken.init();
		});

		$('#manageOrn').on('click', function(e){
			aSelf.updatePageName('ornamentsPage');
			var property = {};
			var template = _.template(template_htmlstr_ornaments, property);
			$('.mainContent').html(template);
			$('.autocomplete-suggestions').remove();
			gs.ornaments.init();
		});

		$('#tool_receiveAmt').on('click', function(e){
			aSelf.updatePageName('receivePendingAmount');
			var property = {};
			var template = _.template(template_htmlstr_pendingAmt, property);
			$('.mainContent').html(template);
		});

		$('#tool-edit-cust-detail').on('click', function(e){
			aSelf.updatePageName('editCustDetails');
			var property = {};
			var template = _.template(template_htmlstr_edit_cust_details, property);
			$('.mainContent').html(template);
			gs.customer.init();
		});
		
		$('.temporary').on('click', function(e){
			var property = {};
			var template = _.template(template_htmlstr_temporary, property);
			$('.mainContent').html(template);
		});

		$('.merge-cust-id').on('click', function(e){
			var property = {}
			var template = _.template(template_htmlstr_merge_cust_group, property);
			$('.mainContent').html(template);
			gs.mergecustomer.init();
		});
		this.getNecessaryDatas();
	},

	getNecessaryDatas: function(){
		var aSelf = this;
		var callBackObj = gs.api.getCallbackObject();
        var request = gs.api.getRequestData('../php/interest.php', '' , 'POST');
        callBackObj.bind('api_response', function(event, response){
           aSelf.setInterestDetailsInStorage(response);
        });
        gs.api.call(request, callBackObj);
	},

	setInterestDetailsInStorage: function(response){
		localStorage.setItem('interestData', response);
	},

	//this will remove the class which is set for PageName Identification
	removePageName: function(){
		var pageNames = ['book', 'billCreationPage', 'billClosingPage', 'tallyPage', 'ornamentsPage', 'receivePendingAmount'];
		var classes = $('.mainContent').attr('class');
		classList = classes.split(' ');
		_.each(pageNames, function(value, index){
			if(classList.indexOf(value) >= 0){
				$('.mainContent').removeClass(value);
			}
		});
	},

	//updates the class list with the current page name
	updatePageName: function(currentPageName){
		this.removePageName();
		$('.mainContent').addClass(currentPageName);
		$('.databaseError').hide();
	},

	getCurrentPageName: function(){

	},
};
