/*
type表示i: 指数; s: 股票; IF:  股指期货 ( 默认为股票 )
*/
(function( w ){
	var doc = document,
	round = Math.round , ceil = Math.ceil , floor = Math.floor , abs = Math.abs , 
	fixed = function( a , n ){if(typeof a=='string') return a; return parseFloat(a).toFixed(n||2)}
	cache = {
		
		// p : 分时{max , min} //价格 最大值，最小值 画分时的时候 按 p.max p.min 作参考
		// k : k线{max,min}
		//,av : {max , min} //均价
		//,zf
		//,zd
		//time 记录移动事件
	}, 
	Tool = {
		 move_draw_top : function( obj , box , color , index ){ //分时上部线
			var  D = obj.arr
				,len = obj.len
				,arr = []
				,lw = obj.lw
				,left , top 
				,num
				,time = 1000/60 
				,add = 1
				,j = 0
				,newData;
			
			if(len>50&&index!=0){
				add = 5;
			}else{
				add = 1;
			}
			for( ; j<add; j++ ){
				newData = D[index]
				if(newData){ //2.5为draw_top中 left:.5 w-.5 +画线的线条占的.5 总共为2 参考线占了 .5 加起来 2.5
					box.cr(0,0,C.w,C.h);
					left = round(index*lw)+2.5
					num = newData[obj.n]
					top = round(C.scale(num))-2.5 ;
					if(index!=0){
						box.l(left,top)
					}else{
						box.b().m(left,top).lw(1)
					}
					box.s(color);
					index++;
				}
			}
			if(newData){
				requestAnimationFrame(function(){
					try{C.move_draw_top( obj , box , color , index );}catch(e){}
				});
			}
		}
		,move_draw_footer : function(  obj , box , border , c , index ){ //分时K线底部线
			var  lw = obj.lw
				,left  , top
				,ft_h = C.canvasBottomHeight
				,n = obj.n
				,color = C.gray
				,w = C.key != 'timePlan'?cache.dk.w/2:0
				,add = 1
				,j = 0
				,newData;
			
			if(obj.arr.length>100&&index!=0){
				add = 5;
			}else{
				add = 1;
			};
			for( ; j<add; j++ ){
				newData = obj.arr[index];
				if(newData){
					left = round(index*lw)+2.5+w
					top = round(ft_h - C.get_ft_h(parseFloat(newData[n]) , obj.max))
					if(c!=undefined) color = parseFloat(newData[c])>0?C.red:C.green
					box.b().m(left,ft_h).l(left,top).lw(border).s(color);
					index++;
				}
			}
			if(newData){
				requestAnimationFrame(function(){
					try{C.move_draw_footer( obj , box , border , c , index );}catch(e){}
				});
			}
		}
		,move_draw_kline : function( obj , box , index ){ //K线图
			var  k,g,d,s , w , left , l
				,len = obj.len , max = obj.max , min = obj.min
				,lw = obj.lw , gap
				,w = obj.w
				,tlw = ceil(w/2)
				,color
				,mg = 2.5;
			if(obj.arr[index]){
				
				l = round(index*lw)+mg
				color = parseFloat(obj.arr[index][9])>0?C.red:C.green
				k = ceil(C.scale(obj.arr[index][1]))-mg
				s = ceil(C.scale(obj.arr[index][2]))-mg-.5
				g = ceil(C.scale(obj.arr[index][3]))-mg+.5
				d = ceil(C.scale(obj.arr[index][4]))-mg+.5
			
				box.sv().b().tl(tlw,0).m(l,g).l(l,d).lw(.9).s(color).rs().sv().b().f(color).fr(l+.5,k+.5,w,round(s-k)).rs();
				index++;
				requestAnimationFrame(function(){
					try{C.move_draw_kline( obj , box , index );}catch(e){}
				});
			}
		}
		,move_draw_ma : function( obj , box , arr , lw , index , color ){ //ma5 ma10 ma20
			var  D = obj.arr
				,left , top;
			
			if(arr[index]){
				box.cr(0,0,C.w,C.h);
				left = round(index*lw)+2.5
				top = round(C.scale( arr[index] ))-2.5 ;
				try{
					if(index!=0){
						box.l(left,top)
					}else{
						box.b().m(left,top).lw(1)
					}
					index++;
					box.s(color);
				}catch(e){
					console.log('没有找到该MA点');
				}
				requestAnimationFrame(function(){
					try{C.move_draw_ma( obj , box , arr , lw , index , color );}catch(e){}
				});
			}
		}
	},
	C = {
		//Key = 'p/k' k线或p分时
		//max
		//min 默认参考线
		 red : '#fa0000'
		,green : '#04ad3a'
		,gray : '#777777'
		,blue : '#005dd8'
		,purple : '#ef00ff'
		,yellow : '#f39900'
		,type : 's' //i: 指数; s: 股票; IF:  股指期货 ( 默认为股票 )
		,line_w : 242 //允许画线条的宽度
		,keyword : '000001'
		,site : 0 //0,1,2,3,4  分时，日K，月K，周K
		,canvasName : [] //["ptime", "day", "week", "month"]
		,canvas : {}
		,add : function(){
			T.myAddListener(C.pic,'mousedown',C.down)
			T.myAddListener(C.pic,'mousemove',C.move)
			T.myAddListener(C.pic,'mouseup',C.up)
		}
		,init : function(){
			var  obj = Dome.element , key 
				,dome = obj.elem;
				
			C.head = obj.top.li;
			C.pic = obj.canvasBox.elem;
			C.MA = obj.ma.li;
			C.footer_time = obj.time.li;
			C.add();
			
			C.marginLeft = dome[0].offsetLeft+ C.pic[0].offsetLeft+parseInt(dome.css('border')||0)*2;//画板与左边的距离
			
			for( key in obj.canvasBox.canvas ){
				C.canvas[key] = obj.canvasBox.canvas[key];
				C.canvasName.push(key); //必需和tab 索引一至
			}
			
			T.myAddListener(obj.elem,'mousedown',C.add)
			
			
			C.l_line = obj.line.left.elem;
			C.l_line.li = obj.line.left.li;
			C.r_line = obj.line.right.elem;
			C.r_line.li = obj.line.right.li;
			
			C.h_line = obj.line.h_line.elem;
			C.h_line.line = obj.line.h_line.line
			C.h_line.lnum = obj.line.h_line.lnum
			C.h_line.rnum = obj.line.h_line.rnum;
			
			C.v_line = obj.line.v_line.elem;
			C.v_line.line = obj.line.v_line.line
			C.v_line.num = obj.line.v_line.num
			
			C.title = obj.title.name;
		}
		,search : function( ){
			clearTimeout(C.search_time);
			C.move_draw_top = null;
			C.move_draw_footer = null;
			C.move_draw_kline = null;
			C.move_draw_ma = null;
			C.search_time = setTimeout(function(){
				C.clearCanvas(C.site);
				C.move_draw_top = Tool.move_draw_top;
				C.move_draw_footer = Tool.move_draw_footer;
				C.move_draw_kline = Tool.move_draw_kline;
				C.move_draw_ma = Tool.move_draw_ma;
				var id = Math.random()*(999)*1000;
				C.canvasBox = C.canvas[C.canvasName[C.site]];
				if(cache.p){
					C.resize();
				}else{
					try{d
						T.js('http://flashdata2.jrj.com.cn/today/js/mQuote/'+C.type+'/'+C.keyword+'.js?stockstarID='+id,function(){
							C.format_date( Data );
							C.resize();
						})
					}catch(e){
						T.js('data.js',function(){
							C.format_date( Data );
							C.resize();
						})
					}
				}
			},300);
		}
		,resize : function(){
			C.w = C.pic[0].clientWidth;
			C.h = C.pic[0].clientHeight;
			
			$.each(C.canvasName,function( i , name){
				Dome.element.canvasBox.canvas[name].elem.css({width:C.w,height:C.h})
			});
			
			var  th = round(C.h*.75)
				,fh = round(C.h - th)
				,isPlan;
			
			C.canvasWidth = C.w;
			C.canvasTopHeight = th;
			C.canvasBottomHeight = fh;
			
			C.h_line.hide()
			C.v_line.hide();
			C.draw_top_border(C.w , th);
			C.draw_ft_border(C.w , fh);
			
			C.get_line();
			
			//G.get_news();
			//G.get_f10();
			isPlan = (C.key == 'timePlan')
			if( isPlan ){
				C.max = cache.p.max
				C.min = cache.p.min
			}else{
				C.max = cache.dk.max
				C.min = cache.dk.min
			}
			C.guides(th);
			
			
			
			C.default_data();
			C.update_footer();
		}
		,clearCanvas : function( i ){ //清除所有
			var  canvas = C.canvas[C.canvasName[i]] 
				,arr
				,kong = $('');
			if(!canvas) return;
			arr = [
				// canvas.bottom.bg || kong
				canvas.bottom.box || kong
				//,canvas.top.bg || kong
				,canvas.top.box || kong
				,canvas.top.ma5 || kong
				,canvas.top.ma10 || kong
				,canvas.top.ma20 || kong
				,canvas.top.av || kong
			];
			$.each(arr,function( i , ele ){
				try{
					var width = ele.canvas.width , height = ele.canvas.height;
					ele.cr(0,0,width,height);
				}catch(e){
					//console.log(ele.selector+':为非');
				}
			});
			
		}
		,default_data : function(){
			var  dis = C.D.display
				,isPlan = (C.key == 'timePlan')
				,d , _d , data
				,top;
				
			d = dis.timePlan
			d = d[d.length-1];
			
			if( isPlan ){
				data = [dis.averagePrice,dis.Economy,dis.time]
				if(C.type=='i'){
					data[0] = d[2]
				}
				_d = [0,1,2]
			}else{
				_d = dis[C.key]
				_d = _d[_d.length-1]
				data = [fixed(dis.close),fixed(dis.open),dis.time]
			}
			
			top = [	
			     dis.transactionPrice
				,dis.fluctuation
				,parseFloat(dis.range)
				,dis.highPrice
				,dis.lowPrice
				,dis.Volume
				,data[0]
				,data[1]
				,data[2]
				,_d[6]
				,_d[7]
				,_d[8]
			]
			top[0]= parseFloat(dis.open) == 0?'停牌':top[0]
			C.update_head(top);
		}
		,format_date : function( Data ){ //时间，价格，均价，换手率，成交量，涨幅，涨跌
			var  D = Data 
				,name = ['timePlan','dailyK','weekK','monthK']
				,dis = D.display;
			if(!dis) return M.search()
			if(typeof dis.timePlan != 'string') return
			function mat( dis ){
				$.each(name,function( n ){
					var arr = [] ;
					$.each(dis[name[n]].split(';'),function( i ){
						arr[i] = this.split(',');
						if( n == 0 ){ //分时
							$.each(arr[i],function( k ){
								if( k!=0 && k!=2  ){//&& k!=5
									if(k==5){
										arr[i][k] = parseFloat(this);
									}else{
										arr[i][k] = parseFloat(this);
									}
								}
							})
						}
					})
					dis[name[n]] = arr;
				})
			}
			mat(dis)
			dis.dailyK = dis.dailyK.slice(20) //20为ma20 需要的数，所以从第20个算起同步百度
			dis.weekK = dis.weekK.slice(20)
			dis.monthK = dis.monthK.slice(20);
			C.D = D;
			Dome.element.title.name.html('<a href="'+dis.stockurl+'">'+dis.stockname + '[' + dis.stocknum +'] 证券之星</a>')
		}
		,guides : function( h ){ //参考线
			function fix(max,min){
				max = parseFloat(max)
				min = parseFloat(min)
				return fixed(min+(max-min)/2)
			}
			function getline( obj ){
				var  max = obj.max , min = obj.min
					,z1 = fixed(max)
					,z3 = obj.close || fix(max,min)
					,z2 = fix(max,z3)
					,z4 = fix(z3,min)
					,z5 = fixed(min)
				return [z1,z2,z3,z4,z5];
			}
			function line( obj ){
				return getline(C.max_min([],0,obj.close,obj.max,obj.min));
			}
			
			C.l_line.height(h)
			C.r_line.css({height:h+'px',display:'none'});
			
			if(C.key !== 'timePlan'){
				var arr = line({max:cache.dk.kaimax,min:cache.dk.kaimin})
				$.each(C.l_line.li,function(i){
					this.innerHTML = arr[i];
				})
			}
			else{
				var  arr1 = line(cache.p)
					,arr2 , m1 , m2 , num
				
				C.r_line.css3({display:'box'},true)
				cache.zf = C.max_min(C.D.display.timePlan , 5 );
				m1 = abs(cache.zf.max);
				m2 = abs(cache.zf.min);
				num = m1>m2?m1:m2
				if(m1>m2){
					cache.zf.min = -num
				}else{
					cache.zf.max = num
				}
				arr2 = getline(cache.zf)
				
				
				$.each(C.l_line.li,function(i){
					this.innerHTML = arr1[i];
				})
				
				$.each(C.r_line.li,function(i){
					this.innerHTML = abs(arr2[i])+'%';
				})
			}
		}
		,set_wh : function( pic , w , h ){
			var lw = round(w/2)+.5;
			pic.canvas.width = w;
			pic.canvas.height = h;
			pic.cr(0,0,w,h).m(lw,0).l(lw,h).lw(1).s('#d2d2d2')
		}
		,draw_top_border : function( w , h ){
			var  l = w-.5, t = h-.5  , lh = round(h/2)-.5 , h4 = h/(Math.ceil(h/80))
				,box;
			
			$.each(C.canvasName,function( i , name ){
				box = C.canvas[name].top.bg;
				C.set_wh(box,w,h);
				box.b().m(.5,.5).l(l,.5).l(l,t).l(.5,t).c().s('#ccc')//.b().m(0,lh).l(w,lh).s('#c2c2c2')
				for(var i=0;i<t;i+=h4){
					if(i!==0&&i!==h){
						var _h = round(i)-.5
						if(_h == lh){
							box.b().m(1,_h).l(l-1,_h).s('#c2c2c2')
						}else{
							for(var k=1;k<l-1;k++){
								if(k%6==0){box.b().m(k,_h).l(k+3,_h).s('#ccc')}
							}
						}
					}
				}
			});
		}
		,draw_ft_border : function( w , h ){
			var box;
			$.each(C.canvasName,function( i , name ){
				box = C.canvas[name].bottom.bg;
				C.set_wh(box,w,h);
				box.b().m(.5,0).l(.5,h-.5).l(w-.5,h-.5).l(w-.5,0).s('#ccc')
			});
		}
		,get_line : function(){ //判断 画 分时，日K，周K，月K等
			var  i = C.site , n = i==0?0:1
				,w = C.canvasWidth
				,th = C.canvasTopHeight
				,fh = C.canvasBottomHeight
				,box = C.canvasBox
				,topBox = box.top.box
				,topAvBox = box.top.av //分时av
				,topMa5Box = box.top.ma5
				,topMa10Box = box.top.ma10
				,topMa20Box = box.top.ma20
				,bottomBox = box.bottom.box;
				
			C.key = ['timePlan','dailyK','weekK','monthK'][i];
			
			/* $.each(C.submenu , function(){
				$(this).hide();
			});
			$.css3(C.submenu[n],{display:'box'},true) */

			C.set_wh(topBox,w,th);
			C.set_wh(bottomBox,w,fh);
			if(n==0){
				C.set_wh(topAvBox,w,th);
			}else{ //日K，周K，月K canvas名称和数量一样
				C.set_wh(topMa5Box,w,th);
				C.set_wh(topMa10Box,w,th);
				C.set_wh(topMa20Box,w,th);
			}
			C[['share','Kline'][n]]();
		}
		,scale : function( n ){ //求分时价格比列
			var h = C.canvasTopHeight-15;
			return h - C.getScale(n,C.min,C.max,h-15)
		}
		,get_ft_h : function( n , max ){return n/max*(C.canvasBottomHeight-5)}
		,sort : function(arr , n , b){
			var a = arr.slice(0);
			function up(c,d){
				if(typeof c == 'string') c = parseFloat(c);
				if(typeof d == 'string') d = parseFloat(d);
				var  v1 = parseFloat(c[n]?c[n]:c)
					,v2 = parseFloat(d[n]?d[n]:d);
				if(b){return v1-v2};
				return v2-v1;
			}
			return a.sort(up);
		}
		,getScale : function(num , min , max , total){return (num-min)/(max-min)*total;}
		,max_min : function( D , n , close , max , min ){
			var  a = [] , len = D.length , zhi 
				,num , m1 , m2
				,lw = (C.w-2)/C.line_w; //允许画线的宽度
			zhi = C.sort(D,n);
			max = max || zhi[0][n]
			min = min || zhi[len-1][n]
			if(close != void 0){
				close = parseFloat(close)
				m1 = max-close;
				m2 = min-close;
				num = m1+m2;
				if(abs(m1)>abs(m2)&&max>close){
					min -= num
				}else{
					max -= num
				}
			}
			return {arr:D,n:n,len:len,lw:lw,max:max,min:min,close:close};
		}
		,share : function(){ //分时
			var  D = Data  //时间，价格，均价，换手率，成交量，涨幅，涨跌
				,dis = D.display
				,plan = dis.timePlan
			C.line_w = 242;
			cache.p = C.max_min(plan , 1 , dis.close);
			if(C.type=='i'){ //i为指数
				cache.p.max = dis.highPrice
				cache.p.min = dis.lowPrice
			}
			C.max = cache.p.max;
			C.min = cache.p.min;
			cache.av = C.max_min(plan , 2 , dis.close , C.max , C.min);
			
			C.draw_line(C.canvasBox.top.box,cache.p, '#005dd8');
			
			if(C.type!='i'){
				clearTimeout(Tool.draw_line_av_time)
				Tool.draw_line_av_time = setTimeout(function(){
					C.draw_line(C.canvasBox.top.av , cache.av , '#f79d00')
				},800);
			};
			clearTimeout(Tool.draw_ftline_time)
			Tool.draw_ftline_time = setTimeout(function(){
				C.draw_ftline(C.max_min(plan , 4))
			},1000);
		}
		,draw_line : function( box , obj , color ){ // 开始画分时线 
			var  index = 0
				,ob = C.max_min([],0,obj.close,obj.max,obj.min);
			C.close = ob.close;
			C.max = ob.max;
			C.min = ob.min;
			try{C.move_draw_top( obj , box , color , index );}catch(e){}
		}
		,draw_ftline : function( obj , border , c ){ //开始画底部线
			var  box = C.canvasBox.bottom.box
				,index = 0
			C.set_wh(box,C.canvasWidth,C.canvasBottomHeight);
			try{C.move_draw_footer( obj , box , border , c , index );}catch(e){}
		}
		,down : function( e ){
			e = T.getEvent(e,0,1);
			if(this.setCapture) this.setCapture();
			C.ismove = true; 
			this.move = false;
			this.x = e.clientX;
			this.y = e.clientY;
			C.h_line.show()
			C.v_line.show()
			C.update(e.clientX);
		}
		,move : function( e ){
			var ee = e.touches ? e.touches[0] : e;
			if(C.ismove){
				if(!this.move){
					var  x = abs(ee.clientX - this.x)
						,y = abs(ee.clientY - this.y);
					if(x>y){
						this.move = true;
					}
				}
				if(this.move == true){
					T.getEvent(e);
					C.update(ee.clientX);
				}
			}
			
		}
		,up : function(){
			this.move = false;
			C.ismove = false;
			if(this.releaseCapture)this.releaseCapture();
			C.h_line.hide();
			C.v_line.hide();
			C.default_data();
		}
		,update : function( x ){
			var  w = C.w-3.5
				,D = C.D.display[C.key] , n , d
				,l = 2.5 , t = 2.5 , len = D.length
				,move_x = x-C.marginLeft //画板与左边距
				,lw = w/C.line_w
				,obj
				,_d
				,isPlan = (C.key == 'timePlan')
				,_w = 0 //cache.dk.w/2 为K线宽高的中间
			
			n = floor(move_x*C.line_w/w);
			
			_w = isPlan?0:cache.dk.w/2
			
			if(!D[n]){ n = n<=0?0:len-1}
			
			
			l = ceil(n*lw+l+_w)
			d = D[n];
			t = C.scale(d[1])-t			
			if(isPlan){
				obj = {l:D[n][1],r:D[n][5],time:D[n][0]}
				_d = [d[1],d[6],d[5],fixed(cache.p.max),fixed(cache.p.min),d[4],d[2],d[3],d[0]]
			}else{
				_d = [d[1],d[10],parseFloat(d[9]),d[3],d[4],d[5],fixed(d[2]),d[1],String(d[0]).slice(2),d[6],d[7],d[8]]
				obj = {l:D[n][1],r:null,time:D[n][0]}
			}
			C.move_line(l,t,obj)
			C.update_head(_d)
		}
		,move_line : function( l , t , d ){
			var w = d.r?38:70
				,vl = l-w/2;
			C.h_line.line.css({top:t+'px'})
			C.h_line.lnum.css({top:(t-7)+'px'})
			C.h_line.rnum.css({top:(t-7)+'px'})
			C.h_line.lnum.text(d.l)
			
			C.h_line.rnum.css({display:(d.r?'block':'none')})
			if(void 0 != d.r){
				C.h_line.rnum.text(d.r+'%')
			}
			
			
			vl = vl<=0?0:vl>=C.w-w?C.w-w:vl;
			C.v_line.line.css({left:l+'px'})
			C.v_line.num.css({left:vl+'px',width:w+'px'})
			C.v_line.num.text(d.time)
		}
		,update_head : function( _d ){ //更新头部的值
			//0分时 1分时下左 2分时下右  3最高 4最低 5成交 6均价 7换手 8时间
			var  name = [] , col
				,cj //成交
				,hs //换手;
				,isPlan = (C.key == 'timePlan');
			if(isPlan){
				name = ['均价','换手']
			}else{
				name = C.ismove?['收盘','开盘']:['昨收','今开']
				var ma = ['MA5','MA10','MA20']
				$.each(C.MA , function( i ){
					this.innerHTML = ma[i]+':'+[_d[9],_d[10],_d[11]][i]
				})
			}
			$.each(C.head , function( i ){
				if( i == 0){
					var p = fixed(_d[0]) , f = _d[1] , di = _d[2] , cls;
					if(f<0){
						cls = 'green>'
					}else if(f>0){
						cls = 'red>'
					}else{
						cls = '>'
					}
					this.innerHTML = '<h3 class='+cls+p+'</h3><p class='+cls+(f>0?'▲':f<0?'▼':'')+f+' '+di+'%</p>';
					
				}else if( i == 1){
					cj = _d[5]
					if(String(cj).length>5) cj = fixed(parseFloat(cj/10000),2)+'万'
					if(String(cj).length>6) cj = fixed(parseFloat(cj),1)+'万'
					if(C.type=='i'&&!isPlan){
						if(parseFloat(cj)>10000){
							cj = fixed(parseFloat(cj)/10000,2)+'亿万'
						}
					}
					this.innerHTML = '<p>最高：<span class="red">'+fixed(_d[3])
									+'</p><p></span>最低：<span class="green">'+fixed(_d[4])
									+'</p><p></span>成交：<span>'+cj+'手<span></p>'
				}else{
					hs = fixed(_d[7]);
					if(C.type=='i'&&isPlan){ hs = '--' }
					this.innerHTML = '<p>'+name[0]+'：<span>'+fixed(_d[6])
									+'</p><p></span>'+name[1]+'：<span>'+hs
									+'</p><p></span>时间：<span>'+_d[8]+'<span></p>'
				}
			})
		}
		,update_footer : function( arr ){
			if(C.key == 'timePlan'){
				$.each(C.footer_time,function( i ){
					this.innerHTML = ['09:30','11:30/13:00','15:00'][i]
				})
			}else{
				var dk = cache.dk;
				$.each(C.footer_time,function( i ){
					this.innerHTML = [dk.from_time,'',dk.to_time][i]
				})
			}
		}
		,drawMa : function( obj , i ){ //绘制 ma5 ma10 ma20
			var  D = obj.arr
					,lw 
					,len = obj.len
					,arr = []
					,z , index = 0
					,color = [C.yellow,C.purple,C.blue][i]
					,box = C.canvasBox.top[['ma5','ma10','ma20'][i]];
			for( var j = 0 ;j<len ; j++){
				z = parseFloat(D[j][obj.n]);
				if( z != 0 ){
					if(!cache.dk.from_time){
						cache.dk.from_time = D[j][0]
					}
					arr.push( z )
					if( j== (len-1) ){
						cache.dk.to_time = D[j][0]
					}
				}
			}
			var _ca = C.sort(arr);
			len = arr.length;
			lw = (C.w-2)/len;
			try{C.move_draw_ma( obj , box , arr , lw , index , color );}catch(e){};

		}
		,Kline : function(){ //K
			var D = C.D , dis = D.display , kline = dis[C.key]
				,_mx = C.max_min(kline , 3).max , _mi = C.max_min(kline , 4).min
				,_kai = C.max_min(kline , 1)
				,len = kline.length
				,lw = (C.w-2)/len//允许画的宽度 
				,tp = C.canvasBox.top
				,topbox = tp.box
				,topMA5 = tp.ma5
				,topMA10 = tp.ma10
				,topMA20 = tp.ma20
				,bottombox = C.canvasBox.bottom.box;
			C.line_w = len;
			
			cache.dk = {
				 max : _mx
				,min : _mi
				,kaimax : _kai.max
				,kaimin : _kai.min
				,arr : kline
				,len : len
				,lw : lw
				,w : ceil(lw*.6)
				,from_time : null
				,to_time : null
			}
			C.max = _mx;
			C.min = _mi;
			$.each(['dMA5','dMA10','dMA20'],function( i , self ){
				cache[self] = C.max_min(kline , i+6);
				clearTimeout(Tool['ma'+self+'_time']);
				Tool['ma'+self+'_time'] = setTimeout(function(){
					C.drawMa(cache[self],i);
				},i*500);
				C.MA.eq(i).css({color:[C.yellow,C.purple,C.blue][i]})
			});
			
			clearTimeout(Tool.draw_ftline_kline_time);
			Tool.draw_ftline_kline_time = setTimeout(function(){
				C.draw_ftline(C.max_min(kline , 5),lw*.5,9)
			},1000);
			
			/* C.max = _mx;
			C.min = _mi; */
			C.draw_kline(topbox,cache.dk)
			
		}
		,draw_kline : function( box , obj ){ // 开始画K线 
			var index = 0 ;
			try{C.move_draw_kline( obj , box , index );}catch(e){}
		}
	},
	G = {
		 init : function(){
			G.li = $.get('a .li',M.news)
			$.each($.get('a i',M.news),function(){
				this.style.display = 'none'
			})
			G.news_more = $.get('a.more',M.news)
			var arr = [] , li
			$.each($.get('section.f10 ul'),function(){
				li = $.get('li',this)
				if(li && li[1]){arr.push(li[1])}
			})
			G.f10 = arr;
			G.f10_more = $.get('section.f10 ul .more')
		 }
		,atr : function( ele , src , name){
			//var obj = '{"p":"'+name+'"}'
			ele.setAttribute('href',src);
			//ele.setAttribute('data-md',obj);
		}
		,get_news : function( n ){
			G.news = C.D.display.news;
			//<!--需要打点的元素，添加data-md属性，用p标识区分不同的位置。值为json格式-->
			//<a href="#" data-md='{"p":"link"}'>链接或者button</a>
			var link , obj , more;
			$.each(G.news , function( i ){
				link = G.li[i].parentNode;
				if(i<6){
					G.li[i].innerHTML = '<p>'+this[1]+'</p>'+'<span>'+this[0]+'</span>';
					G.atr(link , this[2],'detail');
					G.li[i].nextElementSibling.style.display = 'block'
				}
			});
			G.atr(G.news_more , C.D.display.newsmoreurl , 'detail');
		}
		,get_f10 : function(){
			var dis = C.D.display , arr = dis.informContent , url = dis.informMoreUrl;
			$.each(arr , function( i ){
				if(i<5){
					G.f10[i].innerHTML = this
				}
			});
			G.atr(G.f10_more , dis.informMoreUrl , 'detail');
		}
	}
	M = {
		 tab : 'kline' //,'news','f10'
		//,refresh : $.get('#mohe-mb_stock h2 span')
		//,nav : $.get('#mohe-mb_stock nav li')
		//,news : $.get('article.content .news')
		//,kline : $.get('article.content .kline')
		//,f10 : $.get('article.content .f10')
		,init : function(){
			C.init(); //画图工具
			//G.init(); //新闻工具
			//M.getName();
		}
		,search : function( name , type  ){ //用于搜索
			C.keyword = name || '000001'
			C.type = type || 's'
			C.search()
		}
		,clearCanvas : function( index ){
			C.clearCanvas(index);
		}
		,resize : function( i ){
			C.site = void 0 == i?C.site:i;
			var  ele = Dome.element
				,box = ele.canvasBox.box
				,gap = parseInt(ele.canvasBox.canvas.ptime.elem.css('margin-right'))
				,left = -ele.canvasBox.elem.width()*C.site-gap*C.site;
			box.css3({transform:'translate3d('+left+'px,0,0)'});
			C.search();
		}
		,nav_tab : function( n ){
			var _fn = ['kline','news','f10']
			for(var i=0; i<3; i++){
				$.css(M[_fn[i]],{display:'none'})
			}
			M.tab = _fn[n];
			$.css3(M[M.tab],{display:'box'},true)
		}
		,getName : function(){
			var  type = M.getPara('type')
				,code = M.getPara('code')
			if(!type||type!='i'&&type!='IF'){
				type = 's'
			}
			M.search(code,type);
		}
		,getPara: function(paraName){ 
			var str=window.location.href;
			if (str.indexOf(paraName)!=-1){
				var pos_start=str.indexOf(paraName)+paraName.length+1;
				var pos_end=str.indexOf("&",pos_start);
			
				if (pos_end==-1){
				   return str.substring(pos_start);
				}else{
				   return str.substring(pos_start,pos_end)
				}
			 }
			 else{return '';}
		}
	}
	window.Main = M;
})(window , $);