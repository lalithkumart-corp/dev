;
if(typeof gs == 'undefined')
	gs = {};

gs.sel = (function(){
	var pledgeBookSel = {
		pledgeBookContainer: '.pledgeBookContainer',
		trashBtn: '.pledgeBookContainer .move_item_to_trash',
		pledgeBookTable: '.pledgeBookContainer .pledgeBookTable',
		selectedRows: '#pendingDetails tbody .selected'
	}

	function getSelectors(page){
		var theSel = '';
		if(_.isUndefined(page))
			return;
		switch(page){
			case 'pledgebook':
				theSel = pledgeBookSel;
				break;
		}
		return theSel;
	}

	return{
		getSelectors: getSelectors
	}
})();