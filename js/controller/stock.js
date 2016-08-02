define([
	'views/stock'
	,'./stockTitle'
	,'./stocknav'
]
,function( 
	 options 
	,title
	,nav
){
	var stock = {
		init : function( D ){
			stock.parentElement = D.stockContent;
			stock.options = $(options); //分时，新闻，F10，自选 的父类
			D.stockContent.append(stock.options);
			
			title.init(D , stock);
			nav.init(D , stock);
			
			stock.child = {
				 title : title
				,content : D.stockContent
				,nav : nav
			}
			
			stock.item = nav.item;
		}
		,resize : function( D ){
			stock.width = D.width;
			stock.height = D.height;
			stock.updateOption();
			
			title.resize( D );
			nav.resize( D );
			
		}
		,updateOption : function(){//更新 options 尺寸
			var  width = stock.width
				,item = stock.item
				,len = item.length
				,gap = parseInt(item.eq(0).css('margin-right'));
			
			stock.options.width(width*len+gap*len+999);
		}
	}
	
	return stock;
});