define(['text!views/select.html'],function( HTML ){
	var S = {
		init : function( dome ){
			S.parentElement = dome;
			S.Dome = $(HTML);
			dome.append(S.Dome);
		}
		,resize : {
			
		}
	}
	return S;
});