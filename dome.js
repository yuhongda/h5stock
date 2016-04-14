(function( win , $ ){
	var body = $('body');
	var D = {
		 element : null
		,init : function( ){
			D.confix = {
				 dome : null //父元素
				,noBorder : false //是否有边匡 
				,title : true //是否显示标题
				,nav : false //是否显示栏目
			};
			D.setElement();
			D.update();
			T.resize(D.resize);
			
		}
		,create : function( obj ){
			$(function(){
				obj = obj || {dome:body};
				D.init();
				$.extend(D.confix,obj);
				D.dome = D.confix.dome;
				if(D.confix.noBorder) D.element.elem.addClass('noborder');
				if(D.confix.title){
					D.element.title.elem.show()
				}else{
					D.element.title.elem.hide()
				}
				D.dome.append(D.element.elem);
				
				Main.init();
				Menu.init();
				
				var  arr = ['showTitle'      , 'showNav']
					,val = ['setTitleStatus' , 'setNavStatus']
					,key
				
				for( key in obj ){
					$.each(arr,function( i , ele ){
						if(key == ele){
							Menu[val[i]](obj[key]);
						}
					})
				}
				D.updateDome();
				D.animation();
				D.elementEvent();
				D.navEvent();
				D.resize();
			});
		}
		,resizeTime : 0
		,resize : function(){
			clearTimeout(D.resizeTime);
			D.resizeTime = setTimeout(function(){
				D.update();
				D.goTab(D.tabCurrent);
			},300);
		}
		,update : function(){
			var  elem =  D.element.elem
				,width = elem[0].offsetWidth
				,height = elem[0].clientHeight;
			D.width = width;
			D.height = height;
			elem.attr({'data-width':width,'data-height':height});
		}
		,setElement : function(){
			var  ele = $(["<article id='Stock-Wapper'>"
					,'<article class="stock-content">' //所有的内容
						,'<div class="trans-dome">'
							,'<section class="stock-tabs">' //搜索
								,'<div class="search">搜索列表'
								,'</div>'
							,'</section>'
							,'<section class="stock-tabs">' //股票
								,'<h2 class="stock-h2">'
									,"<div class='name'></div>"
								,'</h2>'
								,'<div class="options"></div>'
								,"<nav class='stock-nav'>"
									,"<div class='currentLine'></div>"
									,"<li class='current'>走势图</li>"
									,"<li>公司新闻</li>"
									,"<li>公司资料</li>"
									,"<li>自选</li>"
								,"</nav>"
							,'</section>'
							,'<section class="stock-tabs">' //用于其他功能的弹窗操作
							,'</section>'
						,'</div>'
					,'</article>'
					,'<section class="stock-mymenu-nav">' //栏目
						,'<div class="stock-myMenu"></div>'
						,"<div class='stock-column'>"
							,"<div class='stock-list'></div>"
						,"</div>"
						,'<div class="stock-mask"><div class="jian"></div></div>'
					,'</section>'
				,'</article>'].join(''))
				,menu = ele.find('.stock-myMenu')
				,mymenu =  ele.find('.stock-column')
				,mask = ele.find('.stock-mask')
				,stockCnt = ele.find('.stock-content')
				,content = ele.find('.stock-content .stock-tabs').eq(1)
				,title = content.find('.stock-h2')
				,options = content.find(".options")
				,nav = content.find(".stock-nav")
				,_option = $(['<div class="option">'
					,"<section class='stock-data'>"
						,"<ul>"
							,"<li><h3></h3><p></p></li>"
							,"<li></li>"
							,"<li></li>"
						,"</ul>"
					,"</section>"
					,"<div class='stock-menu'>"
						,"<div class='currentLine'></div>"
						,"<li class='current'>分时</li>"
						,"<li>日K</li>"
						,"<li>周K</li>"
						,"<li>月K</li>"
					,"</div>"
					,"<section class='kline'>"
						,"<div class='stock-ma'><li></li><li></li><li></li></div>"
					,"</section>"
				,"</div>"].join(''))
				,top = _option.find('.stock-data')
				,stockNav = _option.find('.stock-menu')
				,ptime = _option.find('.kline')
				,ma = ptime.find('.stock-ma')
				,pic = $(["<article class='stock-pic'>"
					,"<div class='canvassize'>"
						,"<div class='canvasbox'>"
							,'<div class="minute-canvas">'
								,"<div class='top-pic'>"
									,"<canvas class='draw'></canvas>"
									,"<canvas class='av ps'></canvas>"
									,"<canvas class='bg ps'></canvas>"
								,'</div>'
								,"<div class='bottom-pic'>"
									,"<canvas class='draw'></canvas>"
									,"<canvas class='bg ps'></canvas>"
								,'</div>'
							,'</div>'
							,'<div class="day-canvas">'
								,"<div class='top-pic'>"
									,"<canvas class='draw'></canvas>"
									,"<canvas class='ma5 ps'></canvas>"
									,"<canvas class='ma10 ps'></canvas>"
									,"<canvas class='ma20 ps'></canvas>"
									,"<canvas class='bg ps'></canvas>"
									//,"<div class='stock-zoom'>"
									//	,"<div class='s-b'>"
									//		,"<div class='v-line'></div>"
									//		,"<div class='h-line'></div>"
									//	,'</div>'
									//	,"<div class='c-b '>"
									//		,"<div class='v-line'></div>"
									//	,'</div>'
									//,'</div>'
								,'</div>'
								,"<div class='bottom-pic'>"
									,"<canvas class='draw'></canvas>"
									,"<canvas class='bg ps'></canvas>"
								,'</div>'
							,'</div>'
							,'<div class="week-canvas">'
								,"<div class='top-pic'>"
									,"<canvas class='draw'></canvas>"
									,"<canvas class='ma5 ps'></canvas>"
									,"<canvas class='ma10 ps'></canvas>"
									,"<canvas class='ma20 ps'></canvas>"
									,"<canvas class='bg ps'></canvas>"
								,'</div>'
								,"<div class='bottom-pic'>"
									,"<canvas class='draw'></canvas>"
									,"<canvas class='bg ps'></canvas>"
								,'</div>'
							,'</div>'
							,'<div class="month-canvas">'
								,"<div class='top-pic'>"
									,"<canvas class='draw'></canvas>"
									,"<canvas class='ma5 ps'></canvas>"
									,"<canvas class='ma10 ps'></canvas>"
									,"<canvas class='ma20 ps'></canvas>"
									,"<canvas class='bg ps'></canvas>"
								,'</div>'
								,"<div class='bottom-pic'>"
									,"<canvas class='draw'></canvas>"
									,"<canvas class='bg ps'></canvas>"
								,'</div>'
							,'</div>'
						,'</div>'
					,'</div>'
				,"</article>"].join(''))
				,time = $(["<time class='stock-time'>"
						,"<ul>"
							,"<li>09:30</li>"
							,"<li>11:30/13:00</li>"
							,"<li>15:00</li>"
						,"</ul>"
					,"</time>"].join(''))			
				,line = $(["<div class='stock-line'>"
						,"<div class='hline' style='display:none'>"
							,"<div class='line'></div>"
							,"<div class='l_num'>0.00</div>"
							,"<div class='r_num'>0.00%</div>"
						,"</div>"
						,"<div class='vline' style='display:none'>"
							,"<div class='line'></div>"
							,"<div class='num'>09:30</div>"
						,"</div>"
						,"<ul class='left'>"
							,"<li class='red'></li>"
							,"<li class='red'></li>"
							,"<li></li>"
							,"<li class='green'></li>"
							,"<li class='green'></li>"
						,"</ul>"
						,"<ul class='right'>"
							,"<li class='red'></li>"
							,"<li class='red'></li>"
							,"<li></li>"
							,"<li class='green'></li>"
							,"<li class='green'></li>"
						,"</ul>"
					,"</div>"].join(''))
				,news = $(["<div class='option'><section class='stock-news'>"
						,"<a>"
							,"<div class='li'>"
								,"<p></p>"
								,"<span></span>"
							,"</div>"
							,"<i></i>"
						,"</a>"
						,"<a class='more'>查看更多新闻<i></i></a>"
					,"</section></div>"].join(''))
				,F10 = $(["<div class='option'><section class='stock-f10'>"
						,"<ul>"
							,"<li>公司名称</li>"
							,"<li></li>"
						,"</ul>"
						,"<ul>"
							,"<li>主营业务</li>"
							,"<li></li>"
						,"</ul>"
						,"<ul>"
							,"<li>最新总股本</li>"
							,"<li></li>"
						,"</ul>"
						,"<ul>"
							,"<li>最新流通A股</li>"
							,"<li></li>"
						,"</ul>"
						,"<ul>"
							,"<li>所属板块</li>"
							,"<li></li>"
						,"</ul>"
						,"<ul>"
							,"<a class='more'>查看该公司全部信息<i></i></a>"
						,"</ul>"
					,"</section>"
				,"</div>"].join(''))
				,selector = $(["<div class='option'>"
					,"<section class='select'>"
					,"<ul><li></li></ul>"
					,"</section>"
				,"</div>"].join(''))
				
			
			options.append(_option);
			options.append(news);
			options.append(F10);
			options.append(selector);
			
			_option.append(top);
			_option.append(stockNav);
			
			pic.append(line);
			ptime.append(pic);
			ptime.append(time);
			
			_option.append(ptime);

			D.element = {
				 elem : ele
				,stockCnt : { elem : stockCnt }
				,transDome : { elem : ele.find('.trans-dome') }
				,stockTab : { elem : ele.find('.stock-tabs') }
				,search : ele.find('.stock-content .stock-tabs').eq(0) //搜索dome
				,title : {
					 elem : title
					,name : title.find('.name')
				}
				,top : {
					 elem :　top , li : top.find('li')　
					,h3 : top.find('h3')
				}
				,ma : { elem : ma , li : ma.find('li') }
				,stockNav : {elem : stockNav , li : stockNav.find('li') , cur : stockNav.find('.currentLine') }
				,content : { elem : content } //行情图 dome 所有的内容基本都在这里
				,options : { elem : options , item : options.find('.option') }
				,time : { elem : time , li : time.find('li') }
				,line : {
					 elem : line
					,h_line : {
						 elem : line.find('.hline')
						,line : line.find('.hline .line')
						,lnum : line.find('.hline .l_num')
						,rnum : line.find('.hline .r_num')
					}
					,v_line : {
						 elem : line.find('.vline')
						,line : line.find('.vline .line')
						,num : line.find('.vline .num')
					}
					,left : {
						 elem : line.find('.left')
						,li : line.find('.left li')
					}
					,right : {
						 elem : line.find('.right')
						,li : line.find('.right li')
					}
				}
				,canvasBox : {
					 elem : pic
					,box : pic.find('.canvasbox')
					,canvas : {
						 ptime :　{ //分时
							 elem : pic.find('.minute-canvas')
							,top : {
								 box : T.canvas(pic.find('.minute-canvas .top-pic .draw'),0,0) ,
								 av : T.canvas(pic.find('.minute-canvas .top-pic .av'),0,0) ,
								 bg : T.canvas(pic.find('.minute-canvas .top-pic .bg'),0,0)
							 },
							 bottom : {
								 box : T.canvas(pic.find('.minute-canvas .bottom-pic .draw'),0,0) ,
								 bg : T.canvas(pic.find('.minute-canvas .bottom-pic .bg'),0,0)
							 }
						 }
						 ,day : { //日K
							 elem : pic.find('.day-canvas')
							,top : {
								 box : T.canvas(pic.find('.day-canvas .top-pic .draw'),0,0) ,
								 ma5 : T.canvas(pic.find('.day-canvas .top-pic .ma5'),0,0) ,
								 ma10 : T.canvas(pic.find('.day-canvas .top-pic .ma10'),0,0) ,
								 ma20 : T.canvas(pic.find('.day-canvas .top-pic .ma20'),0,0) ,
								 bg : T.canvas(pic.find('.day-canvas .top-pic .bg'),0,0)
							 },
							 bottom : {
								 box : T.canvas(pic.find('.day-canvas .bottom-pic .draw'),0,0) ,
								 bg : T.canvas(pic.find('.day-canvas .bottom-pic .bg'),0,0)
							 }
						 }
						 ,week : { //周K
							 elem : pic.find('.week-canvas')
							,top : {
								 box : T.canvas(pic.find('.week-canvas .top-pic .draw'),0,0) ,
								 ma5 : T.canvas(pic.find('.week-canvas .top-pic .ma5'),0,0) ,
								 ma10 : T.canvas(pic.find('.week-canvas .top-pic .ma10'),0,0) ,
								 ma20 : T.canvas(pic.find('.week-canvas .top-pic .ma20'),0,0) ,
								 bg : T.canvas(pic.find('.week-canvas .top-pic .bg'),0,0)
							 },
							 bottom : {
								 box : T.canvas(pic.find('.week-canvas .bottom-pic .draw'),0,0) ,
								 bg : T.canvas(pic.find('.week-canvas .bottom-pic .bg'),0,0)
							 }
						 }
						 ,month : { //月K
							 elem : pic.find('.month-canvas')
							,top : {
								 box : T.canvas(pic.find('.month-canvas .top-pic .draw'),0,0) ,
								 ma5 : T.canvas(pic.find('.month-canvas .top-pic .ma5'),0,0) ,
								 ma10 : T.canvas(pic.find('.month-canvas .top-pic .ma10'),0,0) ,
								 ma20 : T.canvas(pic.find('.month-canvas .top-pic .ma20'),0,0) ,
								 bg : T.canvas(pic.find('.month-canvas .top-pic .bg'),0,0)
							 },
							 bottom : {
								 box : T.canvas(pic.find('.month-canvas .bottom-pic .draw'),0,0) ,
								 bg : T.canvas(pic.find('.month-canvas .bottom-pic .bg'),0,0)
							 }
						 }
					}
				}
				,nav : { //栏目
					 elem : nav
					,li : nav.find('li')
					,cur : nav.find('.currentLine')
				}
				,menu : { elem : menu }
				,column : { elem : mymenu , list : mymenu.find('.stock-list') }
				,mask : { elem : mask }
			};

		}
		,updateDome : function(){ //初始化 dome
			D.update();
			var  width = D.width
				,height = D.height
				,dome = D.element
				,tab = dome.stockTab.elem
				,item = dome.options.item
				,trans = dome.transDome.elem
				,gap = parseInt(tab.eq(0).css('margin-right'))
				,len = tab.length
				,left
				,index = D.tabCurrent;
			
			item.height(dome.options.elem.height()).each(function( i , ele ){
				var  left = -i*110
					,left1 = -i*56
				$(this).css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'})
			});
			
			trans.width(width*len+gap*len);
			
			left = -index*width-gap*index;
			
			trans.css3({transform:'translate3d('+left+'px,0,0)'});
			tab.width(width).each(function( i , ele ){
				var  left = ((index-i)*110)
					,left1 = ((index-i)*56)
				$(this).css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'})
			});

		}
		,tabCurrent : 1
		,updateTab : function(){ //更新最外层 tab //搜索 股票，其他 的宽度
			var  width = D.width
				,trans = D.element.transDome.elem
				,tab = D.element.stockTab.elem
				,gap = parseInt(tab.eq(0).css('margin-right'))
				,len = tab.length;
			
			trans.width(width*len+gap*len);
			tab.width(width);
			//D.goTab(D.tabCurrent);
		}
		,goTab : function( index ){ //要去的tab 0,1,2  //搜索 股票，其他
			D.tabCurrent = index;
			D.updateTab();
			var  width = D.width
				,height = D.height
				,trans = D.element.transDome.elem
				,tab = D.element.stockTab.elem
				,gap = parseInt(tab.eq(0).css('margin-right'))
				,left;
				
			left = -index*width-gap*index;
			
			trans.css3({transform:'translate3d('+left+'px,0,0)'});
			tab.each(function( i , ele ){
				var  left = ((index-i)*110)
					,left1 = ((index-i)*56)
				$(this).css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'})
			});
			D.updateOption();
		}
		,updateOption : function(){//更新 栏目 走势 公司新闻 公司资料 自选
			var  width = D.width
				,height = D.height
				,box = D.element.canvasBox.box
				,boxlen = 4  // box 中的绘图 分时 日K 周K 月K 共4个
				,boxgap = parseInt(D.element.canvasBox.canvas.ptime.elem.css('margin-right'))
				,options = D.element.options
				,parent = options.elem
				,item = options.item
				,len = item.length
				,gap = parseInt(item.eq(0).css('margin-right'))
				,parentHeight = parent.height();
			
			box.width(width*boxlen+boxgap*boxlen+99);
			parent.width(width*len+gap*len);
			item.css3({width:width+'px',height:parentHeight+'px'});
			if(window.Main){
				setTimeout(Main.resize,350);
			}
			if(window.Menu){
				Menu.resize();
			}
		}
		,navCurrent : 0
		,navEvent : function(){ //栏目 走势 公司新闻 公司资料 自选 切换
			var  nav = D.element.nav.li
				,cur = D.element.nav.cur
				,left = 0 ;
			cur.css({width:100/nav.length+'%'});
			nav.each(function( i ){
				this.onclick = function(){
					var  width = D.width
						,liwidth = width/nav.length;
						
					nav.removeClass('current');
					$(this).addClass('current');
					left = liwidth*i;
					cur.css3({transform:'translate3d('+left+'px,0,0)'});
					D.navEffect( i );
				}
			});
		}
		,navEffect : function( index ){
			var  width = D.width
				,height = D.height
				,options = D.element.options
				,parent = options.elem
				,item = options.item
				,current = item.eq(D.navCurrent)
				,newCur = item.eq(index)
				,gap = parseInt(item.eq(0).css('margin-right'))
				,time = 1
				,left = 0 ;
			
			D.navCurrent = index;
			
			parent.css3({transitionDuration:time+'s'});
			item.css3({transitionDuration:time+'s'});
			
			left = -index*width-gap*index;
			
			parent.css3({transform:'translate3d('+left+'px,0,0)'})
			
			item.each(function( i , ele ){
				var  left = ((index-i)*110)
					,left1 = ((index-i)*56)
				$(this).css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'})
			});

			
		}
		,elementEvent : function(){
			var  nav = D.element.stockNav.li
				,cur = D.element.stockNav.cur
				,width = D.width
				,canvas = D.element.canvasBox.canvas
				,left = 0 
				,j = 0 ;
				
			for( key in canvas ){
				var  left = -j*110
					,left1 = -j*56
				canvas[key].elem.css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'});
				j++;
			};
			
			cur.css({width:100/nav.length+'%'});
			nav.each(function( i ){
				this.onclick = function(){
					var liwidth = D.width/nav.length
					if(this.className.indexOf('current')>-1){
						D.currentCanvasTab = true;
					}else{
						D.currentCanvasTab = false;
					}
					nav.removeClass('current');
					$(this).addClass('current');
					left = liwidth*i;
					cur.css3({transform:'translate3d('+left+'px,0,0)'})
					D.canvasTab( i );
				}
			});
		}
		,currentCanvasTab : false //点击的是否是当前TAB
		,canvasTab : function( index ){ //分时 日K 周K 月K 界面切换
			var  ele = D.element
				,box = ele.canvasBox.box
				,canvas = ele.canvasBox.canvas
				,line = ele.line.elem
				,ma = ele.ma.elem
				,time = ele.time.elem
				,top = ele.top.elem
				,left = -ele.canvasBox.elem.width()*index;
				
			ma.css({width:D.width-20+'px'})
			if(!D.currentCanvasTab){
				Main.clearCanvas( index );
				line.css3({opacity:0,transform:'translateY(-100px)'});
				time.css3({opacity:0});
				ma.css3({opacity:0,transform:'translateY(50px)'});
				top.css3({opacity:0,transform:'scaleY(.5) rotateX(100deg)'});
				setTimeout(function(){
					
					//box.css3({transform:'translate3d('+left+'px,0,0)'});
					
					Main.resize(index);
					
					var j = 0;
					for( i in canvas ){
						var  left = ((index-j)*110)
							,left1 = ((index-j)*56)
						canvas[i].elem.css3({transform:'translate3d(0px,0px, '+left+'px) rotateY('+left1+'deg)'});
						j++;
					};
					
					setTimeout(function(){
						line.css3({opacity:1,transform:'translateY(0)'});
						top.css3({opacity:1,transform:'scaleY(1) rotateX(0deg)'});
						//Main.resize(index);
						setTimeout(function(){
							time.css3({opacity:1});
							index && ma.css3({opacity:1,transform:'translateY(0)'});
						},510);
					},310);
				},310);
			}
		}
		,animation : function(){
			setTimeout(function(){
				var  ele = D.element
					,box = ele.canvasBox.box
					,time = ele.time.elem
					,line = ele.line.elem
					,stockNav = ele.stockNav.elem
					,top = ele.top.elem;
				setTimeout(function(){
					stockNav.css3({opacity:1,transform:'translateY(0)'});
					box.css3({transform:'translateX(0)'});
					setTimeout(function(){
						top.css3({opacity:1,transform:'scaleY(1) rotateX(0deg)'});
						line.css3({opacity:1,transform:'translateY(0)'});
						time.css3({opacity:1,transform:'translateY(0)'});
					},510);
				},300);
			},300);
		}
	};
	win.Dome = D;
})( window , $ );