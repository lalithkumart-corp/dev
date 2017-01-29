if(typeof gs == 'undefined'){
    var gs = {};
}
gs.customer = {
	rawDetails: {},
	currentCid: '',
	init: function(){
		this.bindEvents();
	},
	bindEvents: function(){
		var $customer = gs.customer;
		$('#cust-details-container .search-customer').on('click', function(e){
			$customer.currentCid = $('.custIdVal').val();
			if($customer.currentCid !== '')
				$customer.search();
		});
		$('#updateCustDetails').on('click', function(e){
			$customer.update();
		});
		$('.custIdVal').on('keydown', function(e){
            var key = 'which' in e ? e.which : e.keyCode;
            if(key == 13){
            	$customer.currentCid = $('.custIdVal').val();
				if($customer.currentCid !== '')
					$customer.search();
            }           
        });
		application.bill.creation.bindImageRelations();
	},
	search: function(){
		var $customer = gs.customer;
		var obj = {};
		obj.aQuery= "SELECT * FROM "+gs.database.schema+".pledgebook where custid='"+$customer.currentCid+"'";
		var callBackObj = application.core.getCallbackObject();
		var request = application.core.getRequestData('../php/executequery.php', obj , 'POST');
		callBackObj.bind('api_response', function(event, response){
		  response = JSON.parse(response);
		  $customer.rawDetails = response;
		  var aRecord = response[0];
		  $customer.fillDetails(aRecord);
		});
		application.core.call(request, callBackObj);
	},
	fillDetails: function(aRecord){
		$('.cname_val').val(aRecord.cname);
		$('.fgname_val').val(aRecord.fgname);
		$('.addr1_val').val(aRecord.address);
		$('.addr_old_val').val(aRecord.address_old);
		$('.addr2_val').val(aRecord.address2);
		$('.place_val').val(aRecord.place);
		$('.mobile_val').val(aRecord.mobile);
		$('.mobile2_val').val(aRecord.mobile2);
		$('.mobile3_val').val(aRecord.mobile3);
		var picPath = aRecord.profilepicpath || gs.app.DEFAULT_PROFILE_PIC_PATH;
		$('#cust-details-container .item-image img').attr('src', picPath);
		$('#updateCustDetails').prop("disabled",false);
	},
	clearDetails: function(){
		$('.custIdVal').val('');
		$('.cname_val').val('');
		$('.fgname_val').val('');
		$('.addr1_val').val('');
		$('.addr_old_val').val('');
		$('.addr2_val').val('');
		$('.place_val').val('');
		$('.mobile_val').val('');
		$('.mobile2_val').val('');
		$('.mobile3_val').val('');
		$('#cust-details-container .item-image img').attr('src', gs.app.DEFAULT_PROFILE_PIC_PATH);
		$('#updateCustDetails').prop("disabled",true);
		$('.custIdVal').focus();
	},
	getDetails: function(){
		var $customer = gs.customer;
		var obj = {};
		obj.cname = $('.cname_val').val() || '';
		obj.fgname = $('.fgname_val').val() || '';
		obj.addr1 = $('.addr1_val').val() || '';
		obj.addr_old = $('.addr_old_val').val() || '';
		obj.addr2 = $('.addr2_val').val() || '';
		obj.place = $('.place_val').val() || '';
		obj.mobile = $('.mobile_val').val() || '';
		obj.mobile2 = $('.mobile2_val').val() || '';
		obj.mobile3 = $('.mobile3_val').val() || '';
		obj.profilepicpath = $('#cust-details-container .item-image img').attr('src');
		return obj;
	},
	update: function(){
		var $customer = gs.customer;
		var details = $customer.getDetails();
		var obj = {};
		obj.aQuery = 'SET SQL_SAFE_UPDATES = 0;';
		obj.aQuery += "UPDATE "+gs.database.schema+".pledgebook SET cname='"+details.cname+"', fgname='"+details.fgname+"', address='"+details.addr1+"', address_old='"+details.addr_old+"', address2='"+details.addr2+"', place='"+details.place+"', mobile='"+details.mobile+"', mobile2='"+details.mobile2+"', mobile3='"+details.mobile3+"', profilepicpath='"+details.profilepicpath+"' WHERE custid='"+$customer.currentCid+"';";
		obj.aQuery += 'SET SQL_SAFE_UPDATES = 1;';
		obj.multiQuery = 'true';
		var callBackObj = application.core.getCallbackObject();
		var request = application.core.getRequestData('../php/executequery.php', obj , 'POST');
		callBackObj.bind('api_response', function(event, response){
			gs.popup.init(
                {
                 title: 'Success',
                 desc: '<p class="greenColor boldFont">Customer Detail updated Successfully !<p>' ,
                 dismissBtnText: 'Ok',
                 enableHtml: true,
                 onHiddenCallback: gs.customer.clearDetails
                });
		});
		application.core.call(request, callBackObj);
	}
}