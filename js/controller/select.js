define(['text!views/select.html'],function( HTML ){
	var S = {
		init : function( nav ){
			S.parentElement = nav.options;
			S.Dome = $(HTML);
			S.parentElement.append(S.Dome);
		}
		,resize : function(){
			
		}
	}
	return S;
});