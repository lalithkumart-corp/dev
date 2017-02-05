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
		$('.custIdVal').focus();
	},
	bindEvents: function(){
		var $customer = gs.customer;
		$('#cust-details-container .search-customer').on('click', function(e){
			$customer.currentCid = $('.custIdVal').val();
			if($customer.currentCid !== '')
				$customer.search();
		});
		$('#updateCustDetails').on('click', function(e){
			gs.popup.init(
            {
	             title: 'Confirm !',
	             desc: 'Are you sure to update this customer details ?</br> This will update the customer details in all over his Bills.' ,
	             dismissBtnText: 'No',
	             buttons: ['Update'],
	             callbacks: [$customer.update],
	             enableHtml: true
            });
		});
		$('.custIdVal').off().on('keydown', function(e){
            var key = 'which' in e ? e.which : e.keyCode;
            if(key == 13){
            	$customer.currentCid = $('.custIdVal').val();
				if($customer.currentCid !== '')
					$customer.search();
            }           
        });
        $('.custIdVal').on('keyup', function(e){
        	if($(this).val() !== '')
        		$('.clearCustId').show();
        	else
        		$('.clearCustId').hide();
        });
        $('.get-cid').off().on('click', function(e){
        	$customer.initCustomersCidPopup();        	
        });
        $('#editCustDetails').off().on('click', function(e){
        	$('#cust-details-container .fieldsOverlay').hide();
        	$(this).hide();
        	$('#updateCustDetails').show();
        });
        $('.clearCustId').off().on(' click', function(e){
        	$customer.clearDetails();
        	$('.clearCustId').hide();
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
		  if(_.isUndefined(aRecord)){
  				gs.popup.init(
  	            {
  		             title: 'Alert !',
  		             desc: 'Not Exists! Please check the Customer Id.' ,
  		             dismissBtnText: 'OK',
  		             enableHtml: true,
  		             onHiddenCallback: function(){
					  		             	$('.custIdVal').focus();
					  		             }
  	            });
		  }else
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
		$('#editCustDetails').prop("disabled",false);
		$('#cust-details-container .fieldsOverlay').show();
		gs.customer.fillBillListTables();
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
		$('#editCustDetails').prop("disabled",true);
		$('#cust-details-container .fieldsOverlay').show();
		$('.custIdVal').focus();
		$customer.totalCustomerList = {};
		$('.customerBillListPanel .tab-pane').html('No Bills.');
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
                 onHiddenCallback: gs.customer.toggleButtons
                });
		});
		application.core.call(request, callBackObj);
	},
	toggleButtons: function(){
		$('#editCustDetails').show();
		$('#cust-details-container .fieldsOverlay').show();
        $('#updateCustDetails').hide();
	},
	initCustomersCidPopup: function(){
		gs.spinner.show();
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
		gs.spinner.hide();
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

        $('#customerCidListTable tbody tr').on( 'click', function () {
                $('#customerCidListTable tbody .cidSelected').removeClass('cidSelected');
                $(this).addClass('cidSelected');
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
			$('.clearCustId').show();
			if($customer.currentCid !== '')
					$customer.search();
		});
	},

	fillBillListTables: function(){
		var $customer = gs.customer;
		$customer.createTable('pendingBillList');
		$customer.createTable('closedBillList');
		$customer.createTable('totalBillList');
	},
	createTable: function(category){
		var $customer = gs.customer;
		var data = $customer.rawDetails;
		var container;
		var filteredBills = [];
		switch(category){
			case 'pendingBillList': 
				_.each(data, function(value,index){
					if(value.status == 'open')
						filteredBills.push(value);
				});
				container = '#PENDING';
				break;
			case 'closedBillList':
				_.each(data, function(value,index){
					if(value.status == 'closed')
						filteredBills.push(value);
				});
				container = '#CLOSED';
				break;
			case 'totalBillList': 
				filteredBills = data.slice(0);
				container = '#TOTALBILLS';
				break;
		}
		var property = {};
		property.billList = filteredBills;
		var htmlContent = _.template(template_htmlstr_cust_detail_bill_table, property);
		$(container).html(htmlContent);
		$("[data-toggle = 'item-popover']").popover({trigger: "click"});
	}
}