define(['text!views/f10.html'],function( HTML ){
	var F = {
		init : function( nav ){
			F.parentElement = nav.options;
			F.Dome = $(HTML);
			F.parentElement.append(F.Dome);
		}
		,resize : {
			
		}
	}
	return F;
});