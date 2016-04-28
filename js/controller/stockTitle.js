define(['text!views/stockTitle.html','modules/stockData'],function( HTML , stockData ){
	var T = {
		init : function(  D  ){
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
			T.parentElement.prepend(T.Dome);
		}
		,hide : function(){
			T.Dome.remove();
		}
		,update : function( name ){
			T.name.text( name );
		}
	}
	return T;
});