define(['text!views/news.html'],function( HTML ){
	var N = {
		init : function( nav ){
			N.parentElement = nav.options;
			N.Dome = $(HTML);
			N.parentElement.append(N.Dome);
		}
		,resize : {
			
		}
	}
	return N;
});