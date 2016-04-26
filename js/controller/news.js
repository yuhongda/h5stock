define(['text!views/news.html'],function( HTML ){
	var N = {
		init : function( dome ){
			N.parentElement = dome;
			N.Dome = $(HTML);
			dome.append(N.Dome);
		}
		,resize : {
			
		}
	}
	return N;
});