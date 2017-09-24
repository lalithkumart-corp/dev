;
if(typeof gs == 'undefined'){
    var gs = {};
}
gs.app = {
	DEFAULT_PROFILE_PIC_PATH: '/uploads/default.jpg'
}
$(document).on('ready',function(){
    application.core.bindHomeEvents();
});