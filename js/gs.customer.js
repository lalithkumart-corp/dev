if(typeof gs == 'undefined'){
    var gs = {};
}
gs.customer = {
	rawDetails: {},
	totalCustomerList: {},
	currentCid: '',
	init: function(){
		this.bindEvents();
		this.totalCustomerList = {};
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
        $('.get-cid').on('click', function(e){
        	$customer.initCustomersCidPopup();        	
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
		var $customer = gs.customer;
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
		$customer.rawDetails = {};
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
	},
	initCustomersCidPopup: function(){
		var $customer = gs.customer;
		if(!_.isEmpty($customer.totalCustomerList)){
			$customer.openCIDTable();
		}else{
			var callBackObj = application.core.getCallbackObject();
			var request = application.core.getRequestData('../php/getPledgebook.php', {} , 'POST');
			callBackObj.bind('api_response', function(event, response){
				$customer.totalCustomerList = JSON.parse(response);
				$customer.openCIDTable();
			});
			application.core.call(request, callBackObj);
		}			
	},
	openCIDTable: function(){
		var $customer = gs.customer;
		var customerList = $customer.totalCustomerList;
		var options = {};
		options.title= "Select Customer...";
		options.body = _.template(template_htmlstr_customer_cid_table, {customerList: customerList});
		options.buttons = ['OK'];
		options.onShownCallback = $customer.onPopupShown;
		options.className = "customerCidPopup"
		gs.commonPopup.init(options);
		$customer.bindCidTableEvents();
	},
	onPopupShown: function(){
		gs.customer.asDataTable();
		$('#btn0OK').prop('disabled',true);
	},
	asDataTable: function(){
		var $customer = gs.customer;
		$('#customerCidListTable thead tr#filterData th').not(":eq(0)").each( function () {
        	var title = $('#customerCidListTable thead tr#filterData th').eq( $(this).index() ).text();
        	$(this).html( '<input type="text" class="'+title+'" onclick="event.stopPropagation();" placeholder="'+title+'" />' );
    	});
    	$("#customerCidListTable thead input[type='text']").on( 'keyup change', function () {
	        table
	            .column( $(this).parent().index()+':visible' )
	            .search( this.value )
	            .draw();
	    });

		var table = $("#customerCidListTable").on( 'init.dt', function () {
               $customer.tableComplete();
            }).DataTable({
                paging: false,
                scrollY: 400,
                scrollCollapse: true,
                     aoColumns : [
                      { "sWidth": "4%"},
                      { "sWidth": "8%"},
                      { "sWidth": "18%"},
                      { "sWidth": "18%"},
                      { "sWidth": "34%"}
                    ]
        	});
        $customer.table = table;

        $('#customerCidListTable tbody').on( 'click', 'td.sorting_1', function () {
                $('#customerCidListTable tbody .cidSelected').removeClass('cidSelected');
                $(this).parent().addClass('cidSelected');
                $('#btn0OK').prop('disabled', false);
        });
       
	},
	tableComplete: function(){
		var $customer = gs.customer;
		if(typeof $customer.table != 'undefined' && !_.isEmpty($customer.table)){
            $customer.table.draw();
        }else{
            setTimeout(function(){
                $customer.tableComplete();
            },200);
        }
	},
	bindCidTableEvents: function(){
		var $customer = gs.customer;
		$('#btn0OK').on('click', function(){			
			var cid = $('#customerCidListTable tbody tr.cidSelected td:eq(1)').text().trim();
			gs.commonPopup.hide();
			$customer.currentCid = cid;
			$('.custIdVal').val(cid);
			if($customer.currentCid !== '')
					$customer.search();
		});
	}
}