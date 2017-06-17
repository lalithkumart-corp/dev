/**
 * For Merging two customer groups
 */
var gs = gs || {};

gs.mergecustomer = (function(){
    var baseBillNo, otherBillNo, rawResponse = [], fetchCounter = 0;
    var sel = {
        baseBillNo: '.base-bill-no',
        otherBillNo: '.other-bill-no',
        getBillDetails: '.get-bill-details',
        doMerge: '.do-merge'
    };
    function init(){
        bindEvents();
    }
    function bindEvents(){
        $(sel.getBillDetails).off().on('click', function(){
            baseBillNo = $(sel.baseBillNo).val().trim();
            otherBillNo = $(sel.otherBillNo).val().trim();
            getDetails();
        });        
    }
    function bindSubmitEvent(){
        $(sel.doMerge).off().on('click', function(e){
            var newData = fetchNewDetails();
            merge(newData);
        });
    }
    function getDetails(){
        var obj = {
            aQuery: "SELECT * FROM dev.pledgebook where custid = '"+baseBillNo+"'"
        }
        var callBackObj = application.core.getCallbackObject();
		var request = application.core.getRequestData('../php/executequery.php', obj , 'POST');
		callBackObj.bind('api_response', function(event, response){
            fetchCounter++;
            rawResponse['baseBillDetails'] = JSON.parse(response)[0];
			onFetchComplete();            
		});
		application.core.call(request, callBackObj);

        var obj2 = {
            aQuery: "SELECT * FROM dev.pledgebook where custid = '"+otherBillNo+"'"
        }
        var callBackOb = application.core.getCallbackObject();
		var request = application.core.getRequestData('../php/executequery.php', obj2 , 'POST');
		callBackOb.bind('api_response', function(event, response){
			fetchCounter++;
            rawResponse['otherBillDetails'] = JSON.parse(response)[0];
            onFetchComplete();
		});
		application.core.call(request, callBackOb);
    }
    function onFetchComplete(){
        if(fetchCounter < 2)
            return;
        fetchCounter = 0;
        var mergedResponse = mergeResponseData();
        renderDetails(mergedResponse);
        bindSubmitEvent();
    }
    function mergeResponseData(){
        var parsedData;
        try{
            parsedData = {
                b_cname: rawResponse.baseBillDetails.cname,
                o_cname: rawResponse.otherBillDetails.cname,
                b_fgname: rawResponse.baseBillDetails.fgname,
                o_fgname: rawResponse.otherBillDetails.fgname,
                b_address: rawResponse.baseBillDetails.address,
                o_address: rawResponse.otherBillDetails.address,
                b_address2: rawResponse.baseBillDetails.address2,
                o_address2: rawResponse.otherBillDetails.address2,
                b_place: rawResponse.baseBillDetails.place,
                o_place: rawResponse.otherBillDetails.place,
                b_pincode: rawResponse.baseBillDetails.pincode,
                o_pincode: rawResponse.otherBillDetails.pincode,
                b_mobile: rawResponse.baseBillDetails.mobile,
                o_mobile: rawResponse.otherBillDetails.mobile            
            }
        }catch(e){
            console.error('Error in mergeResponseData function... Please check it');
        }
        return parsedData;
    }
    function renderDetails(myData){
        var property = {
            myData: myData
        }
        var template = _.template(template_htmlstr_merge_cust_group_sub, property);
        $('.view-panel').html(template);
    }
    function fetchNewDetails(){
        var newData = {};
        newData.baseBillNo = baseBillNo;
        newData.otherBillNo = otherBillNo;        
        newData.cname = $('input[name="cname"]:checked').val();
        newData.gname = $('input[name="gname"]:checked').val();
        newData.addr = $('input[name="addr"]:checked').val();
        newData.addr2 = $('input[name="addr2"]:checked').val();
        newData.place = $('input[name="place"]:checked').val();
        newData.pincode = $('input[name="pin"]:checked').val();
        newData.mobile = $('input[name="mobile"]:checked').val();
        return newData;
    }
    function merge(newData){
        var obj = {};
        obj.multiQuery = 'true';
        obj.aQuery = 'SET SQL_SAFE_UPDATES = 0;';
        obj.aQuery += 'update dev.pledgebook set custid="'+newData.baseBillNo+'",cname="'+newData.cname+'", fgname="'+newData.gname+'", address="'+newData.addr+'", address2="'+newData.addr2+'",place="'+newData.place+'", pincode="'+newData.pincode+'", mobile="'+newData.mobile+'" where custid="'+newData.baseBillNo+'";';
        obj.aQuery += 'update dev.pledgebook set custid="'+newData.baseBillNo+'",cname="'+newData.cname+'", fgname="'+newData.gname+'", address="'+newData.addr+'", address2="'+newData.addr2+'",place="'+newData.place+'", pincode="'+newData.pincode+'", mobile="'+newData.mobile+'" where custid="'+newData.otherBillNo+'";';
        obj.aQuery += 'SET SQL_SAFE_UPDATES = 1;';
        var callBackOb = application.core.getCallbackObject();
		var request = application.core.getRequestData('../php/executequery.php', obj , 'POST');
		callBackOb.bind('api_response', function(event, response){
            var title, msg, onHiddenCallBack;            
            var response = JSON.parse(response);
            if(!_.isUndefined(response[0]) && response[0].status == true){
                title = 'Success';
                msg = '<p class="greenColor boldFont">Customer Detail updated Successfully !<p>';
                onHiddenCallBack = clearFields;
                baseBillNo = '';
                otherBillNo = '';
            }else{
                title = 'Error';
                msg = '<p class="red-color boldFont">Error in updating the records...<p>';
            }
            gs.popup.init(
                {
                 title: title,
                 desc: msg ,
                 dismissBtnText: 'Ok',
                 enableHtml: true,
                 onHiddenCallback: onHiddenCallBack
                });
		});
		application.core.call(request, callBackOb);
    }
    function clearFields(){
        $(sel.baseBillNo).val('');
        $(sel.otherBillNo).val('');
        $('.view-panel').html('');
    }

    return{
        init: init
    }
})();