;
if(typeof gs == 'undefined'){
    var gs = {};
}
gs.database = {
	schema : "test"
}
if(gs.database.schema == 'dev'){
	setTimeout(function(){
		$('body').append('<h2 class="databaseError" style="text-align: center;color: red;">This is not your workspace. Please change the Database</h2>');
	}, 1000);
}