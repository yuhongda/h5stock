define(['text!views/news.html'],function( HTML ){
	var F = {
		init : function( dome ){
			F.parentElement = dome;
			F.Dome = $(HTML);
			dome.append(F.Dome);
		}
		,resize : {
			
		}
	}
	return F;
});