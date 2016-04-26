define([
	'text!views/stock.html'
	,'./price'
	,'./news'
	, './f10'
	, './select'
]
,function( 
	 options 
	,price 
	,news 
	,f10 
	,selector 
){
	var stock = {
		
		init : function( dome ){
			stock.parentElement = dome;
			options = $(options);
			dome.append(options);
			
			
			price.init(options);
			news.init(options);
			f10.init(options);
			selector.init(options);
			
			//分时，新闻，F10，自选
			stock.item = $(price.Dome).add(news.Dome).add(f10.Dome).add(selector.Dome);
			
		}
		,resize : function( D ){
			stock.width = D.width;
			stock.height = D.height;
			stock.updateOption();
			price.resize( D );
		}
		,updateOption : function(){//更新 options 尺寸
			var  width = stock.width
				,parent = stock.parentElement
				,item = stock.item
				,parentHeight = parent.height();
			
			item.css3({width:width+'px',height:parentHeight+'px'});
		}
		,getCode : function(){ //获取股票代码
			
		}
	}
	
	return stock;
});