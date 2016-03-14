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
			D.animation();
			T.resize(D.resize);
			
		}
		,create : function( obj ){
			obj = obj || {dome:body}
			$.extend(D.confix,obj);
			D.dome = D.confix.dome;
			if(D.confix.noBorder) D.element.elem.addClass('noborder');
			if(D.confix.title){
				D.element.title.elem.show()
			}else{
				D.element.title.elem.hide()
			}
			D.dome.append(D.element.elem);
			D.resize();
			
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
			
			D.elementEvent();
		}
		,resize : function(){
			var  elem =  D.element.elem
				,width = elem[0].offsetWidth
				,height = elem[0].clientHeight;

			D.width = width;
			D.height = height;
			elem.attr({'data-width':width,'data-height':height});
			if(window.Main){
				Main.resize();
			}
			if(window.Menu){
				Menu.resize();
			}
		}
		,setElement : function(){
			var  ele = $("<article id='Stock-Wapper'></article")
				,title = $(['<h2 class="stock-h2">'
						,"<div class='name'></div>"
					,'</h2>'].join(''))
				,content = $(['<article class="stock-content"></article>'].join(''))
				,top = $(["<section class='stock-data'>"
						,"<ul>"
							,"<li><h3></h3><p></p></li>"
							,"<li></li>"
							,"<li></li>"
						,"</ul>"
					,"</section>"].join(''))
				,ma = $("<div class='stock-ma'><li></li><li></li><li></li></div>")
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
				,stockNav = $(["<div class='stock-menu'>"
						,"<div class='currentLine'></div>"
						,"<li class='current'>分时</li>"
						,"<li>日K</li>"
						,"<li>周K</li>"
						,"<li>月K</li>"
					,"</div>"].join(''))
				,ptime = $("<section class='kline'>")
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
				,news = $(["<section class='stock-news'>"
						,"<a>"
							,"<div class='li'>"
								,"<p></p>"
								,"<span></span>"
							,"</div>"
							,"<i></i>"
						,"</a>"
						,"<a>"
							,"<div class='li'>"
								,"<p></p>"
								,"<span></span>"
							,"</div>"
							,"<i></i>"
						,"</a>"
						,"<a>"
							,"<div class='li'>"
								,"<p></p>"
								,"<span></span>"
							,"</div>"
							,"<i></i>"
						,"</a>"
						,"<a>"
							,"<div class='li'>"
								,"<p></p>"
								,"<span></span>"
							,"</div>"
							,"<i></i>"
						,"</a>"
						,"<a>"
							,"<div class='li'>"
								,"<p></p>"
								,"<span></span>"
							,"</div>"
							,"<i></i>"
						,"</a>"
						,"<a class='more'>查看更多新闻<i></i></a>"
					,"</section>"].join(''))
				,F10 = $(["<section class='stock-f10'>"
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
				,"</article>"].join(''))	
				,nav = $(["<nav class='stock-nav'>"
					,"<li class='current'>走势图</li>"
					,"<li>公司新闻</li>"
					,"<li>公司资料</li>"
					,"<li>自选</li>"
				,"</nav>"].join(''))
				,menu = $('<div class="stock-myMenu"></div>')
				,mymenu =  $("<div class='stock-column'>"
					+"<div class='stock-list'></div>"
				+"</div>")
				,mask = $('<div class="stock-mask"><div class="jian"></div></div>');
			
			content.append(title);
			content.append(top);
			content.append(stockNav);
			
			ptime.append(ma);
			pic.append(line);
			ptime.append(pic);
			ptime.append(time);
			
			content.append(ptime);
			menu.appendTo(ele);
			mask.appendTo(ele);
			mymenu.appendTo(ele);
			content.appendTo(ele);
			
			D.element = {
				 elem : ele
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
				,content : { elem : content }
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
				}
				,menu : { elem : menu }
				,column : { elem : mymenu , list : mymenu.find('.stock-list') }
				,mask : { elem : mask }
			};
		}
		,elementEvent : function(){
			var  nav = D.element.stockNav.li
				,cur = D.element.stockNav.cur
				,width = D.width
				,liwidth = width/nav.length
				,left = 0 ;
			cur.css({width:100/nav.length+'%'});
			nav.each(function( i ){
				this.onclick = function(){
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
		,currentCanvasTab : false //点吉的是否是当前TAB
		,canvasTab : function( i ){ //分时 日K 周K 月K 界面切换
			var  ele = D.element
				,box = ele.canvasBox.box
				,line = ele.line.elem
				,ma = ele.ma.elem
				,time = ele.time.elem
				,top = ele.top.elem
				,left = -ele.canvasBox.elem.width()*i;
				
			ma.css({width:D.width-20+'px'})
			if(!D.currentCanvasTab){
				Main.clearCanvas( i );
				line.css3({opacity:0,transform:'translateY(-100px)'});
				time.css3({opacity:0});
				ma.css3({opacity:0,transform:'translateY(50px)'});
				top.css3({opacity:0,transform:'scaleY(.5) rotateX(100deg)'});
				setTimeout(function(){
					box.css3({transform:'translateX('+left+'px)'});
					setTimeout(function(){
						line.css3({opacity:1,transform:'translateY(0)'});
						top.css3({opacity:1,transform:'scaleY(1) rotateX(0deg)'});
						Main.resize(i);
						setTimeout(function(){
							time.css3({opacity:1});
							i && ma.css3({opacity:1,transform:'translateY(0)'});
						},510);
					},310);
				},310);
			}
		}
		,animation : function(){
			var  ele = D.element
				,box = ele.canvasBox.box
				,time = ele.time.elem
				,line = ele.line.elem
				,stockNav = ele.stockNav.elem
				,top = ele.top.elem;
			setTimeout(function(){
				stockNav.css3({opacity:1,transform:'translateY(0)'});
				box.css3({transform:'translateX(0)'});
				top.css3({opacity:1,transform:'scaleY(1) rotateX(0deg)'});
				setTimeout(function(){
					line.css3({opacity:1,transform:'translateY(0)'});
					time.css3({opacity:1,transform:'translateY(0)'});
				},510);
			},300);
		}
	};
	D.init();
	win.Dome = D;
})( window , $ );