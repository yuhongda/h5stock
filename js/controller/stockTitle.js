define(['views/stockTitle','modules/stockData'],function( HTML , stockData ){
	var T = {
		status : false
		,init : function(  D  ){
			T.parentElement = D.stockContent;
			T.Dome = $(HTML);
			T.name = T.Dome.find('.name');
		}
		,resize : function( D  ){
			stockData.getData(function( d ){
				T.update( d.display.stockname+'['+d.display.stocknum+']')
			});
		}
		,show : function(){
			T.status = true;
			T.parentElement.prepend(T.Dome);
		}
		,hide : function(){
			T.status = false;
			T.Dome.remove();
		}
		,update : function( name ){
			T.name.text( name );
		}
	}
	return T;
});