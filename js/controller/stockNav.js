define([
	'views/stockNav'
	,'./price'
	,'./news'
	,'./f10'
	,'./select'
],function( navHTML , price , news , f10 , selector   ){
	var nav = {
		 status : false
		,init : function( D , stock ){
			nav.parentElement = D.stockContent;
			nav.options = stock.options; // 分时，新闻，F10，自选 的父类
			nav.Dome = $(navHTML);
			nav.setElement( D );
			
			
			nav.navEvent();
		}
		,resize : function( D , stockData ){
			nav.width = D.width;
			nav.height = D.height;
			
			nav.updateItem();
			
			price.resize( D );
			
			news.resize( D );
			f10.resize( D , nav );
			//selector.resize( D );  //自选和新闻暂时取消了
		}
		,setElement : function( D ){
			price.init( D , nav);
			//news.init(nav);
			f10.init(nav);
			//selector.init(nav);
			
			//分时，新闻，F10，自选
			//nav.item = $(price.Dome).add(news.Dome).add(f10.Dome).add(selector.Dome);
			nav.item = $(price.Dome).add(f10.Dome);
			
			nav.li = nav.Dome.find('li')
			nav.cur = nav.Dome.find('.currentLine');
			nav.cur.css({width:100/nav.li.length+'%'});
			
			nav.item.each(function( i , ele ){
				var  left = -i*110
					,left1 = -i*56
				$(this).css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'})
			});
		}
		,updateItem : function(){//更新 options 尺寸
			var  width = nav.width
				,parent = nav.options
				,item = nav.item
				,parentHeight = parent.height();
			
			//item.css3({width:width+'px',height:parentHeight+'px'});
			item.css3({width:width+'px'});
			
			
		}
		,show : function(){ //添加栏目
			nav.status = true;
			nav.Dome.appendTo(nav.parentElement);
		}
		,hide : function(){ //删除栏目
			nav.status = false;
			nav.Dome.remove();
		}
		,navCurrent : 0
		,navEvent : function(){ //栏目 走势 公司新闻 公司资料 自选 切换
			var  li = nav.li
				,cur = nav.cur
				,left = 0 ;
			cur.css({width:100/nav.length+'%'});
			li.each(function( i ){
				this.onclick = function(){
					var  width = nav.width
						,liwidth = width/li.length;
						
					li.removeClass('current');
					$(this).addClass('current');
					left = liwidth*i;
					cur.css3({transform:'translate3d('+left+'px,0,0)'});
					nav.navEffect( i );
				}
			});
		}
		,navEffect : function( index ){
			var  width = nav.width
				,height = nav.height
				,options = nav.options
				,item = nav.item
				,current = item.eq(nav.navCurrent)
				,newCur = item.eq(index)
				,gap = parseInt(item.eq(0).css('margin-right'))
				,time = 1
				,left = 0 ;
			
			nav.navCurrent = index;
			
			options.css3({transitionDuration:time+'s'});
			item.css3({transitionDuration:time+'s'});
			
			left = -index*width-gap*index;
			
			options.css3({transform:'translate3d('+left+'px,0,0)'})
			
			item.each(function( i , ele ){
				var  left = ((index-i)*110)
					,left1 = ((index-i)*56)
				$(this).css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'})
			});
			//栏目更新
			switch( index ){
				case 0 : //走势图
					
					break; 
				case 1 : // 新闻
					break; 
				case 2 : // 公司资料
					break;
				case 3 : // 自选
					selector.update();
					break;
			}
		}
	}
	
	return nav;
});