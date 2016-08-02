define(['views/f10','modules/stockData' , './stockTitle' ],function( HTML , Data ){
	var F = {
		init : function( nav ){
			F.parentElement = nav.options;
			F.Dome = $(HTML);
			F.parentElement.append(F.Dome);
			F.addData();
		}
		,resize : function( D , nav ){
			var width = D.width; //20为padding
		}
		,addData : function(){
			Data.getData(function( _data ){
				var  list = $('.stock-f10 li')
					,data = _data.display.informContent
					,index = 0;
				list.each(function( i , ele ){
					if((i+1)%2==0){
						$(ele).text(data[index]);
						index++;
					}
				});
			});
		}
	}
	return F;
});