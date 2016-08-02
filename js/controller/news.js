define(['views/news'],function( HTML ,dome ){
	var N = {
		init : function( nav ){
			N.parentElement = nav.options;
			N.Dome = $(HTML);
			N.parentElement.append(N.Dome);
		}
		,resize : function(){
			
		}
	}
	return N;
});