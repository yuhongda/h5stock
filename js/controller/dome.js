define([
	'zepto'
	,'pub'
	,'text!views/index.html'
	,'./search'
	,'./stock'
	,'./myMenu'
]
,function(
	 $
	,T 
	,dome 
	,search 
	,stock 
	,myMenu
){
	var D = {
		init : function( obj ){
			
			D.create(obj)
			D.update();
		}
		,create : function( obj ){
			D.config = {
				 dome : null //父元素
				,noBorder : false //是否有边匡 
				,title : true //是否显示标题
				,nav : false //是否显示栏目
			};
			obj = obj || {dome:body};
			$.extend(this.config,obj);
			var ele = this.config.dome;
			ele.append(dome);
			
			D.wapper = $('#Stock-Wapper');
			D.content = D.wapper.find('.stock-content');
			D.trans = D.wapper.find('.trans-dome');
			D.tab = D.wapper.find('.stock-tabs'); //[0,1,2] 
			
			stock.init( D.tab.eq(1) );
			myMenu.init( D ); 
			
			D.tab.each(function( i , ele ){
				var  left = -i*110
					,left1 = -i*56
				$(this).css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'})
			});
			
			T.resize(D.resize);
		}
		,update : function(){
			var  elem =  D.wapper
				,width = elem[0].offsetWidth
				,height = elem[0].clientHeight;
			D.width = width;
			D.height = height;
			elem.attr({'data-width':width,'data-height':height});
		}
		,resize : function(){
			D.update();
			D.goTab(1);
		}
		,updateTab : function(){ //更新最外层 tab //搜索 股票，其他 的宽度
			var  width = D.width
				,trans = D.trans
				,tab = D.tab
				,gap = parseInt(tab.eq(0).css('margin-right'))
				,len = tab.length;
			
			trans.width(width*len+gap*len+999);
			tab.width(width);
		}
		,tabCurrent : 0
		,goTab : function( index ){ //要去的tab 0,1,2  //搜索 股票，其他
			D.updateTab();
			var  width = D.width
				,height = D.height
				,trans = D.trans
				,tab = D.tab
				,gap = parseInt(tab.eq(0).css('margin-right'))
				,left;
				
			left = -index*width-gap*index;
			
			trans.css3({transform:'translate3d('+left+'px,0,0)'});
			tab.each(function( i , ele ){
				var  left = ((index-i)*110)
					,left1 = ((index-i)*56)
				$(this).css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'})
			});
			if(index!=1) return;
			if(D.tabCurrent == index){
				stock.resize( D );
			}else{ // tab 3D切换时，宽度会发生变化。必需要切换完成 才可以获取尺寸
				setTimeout(function(){
					stock.resize( D );
				},550)
				D.tabCurrent = index;
			}
		}
	};
	return D;
});