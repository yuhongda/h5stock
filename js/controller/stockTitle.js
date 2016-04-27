define(['text!views/stockTitle.html'],function( HTML ){
	var T = {
		init : function(  D  ){
			T.parentElement = D.stockContent;
			T.Dome = $(HTML);
			
		}
		,resize : function(){
			
		}
		,show : function(){
			T.parentElement.prepend(T.Dome);
		}
		,hide : function(){
			T.Dome.remove();
		}
	}
	return T;
});