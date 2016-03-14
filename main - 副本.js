/*
type表示i: 指数; s: 股票; IF:  股指期货 ( 默认为股票 )
*/
(function( w ){
	var doc = document , tool;
	(function(){
		var  navig = navigator
			,ua = navig.userAgent.toLowerCase()
			,v = navig.vendor;
		tool = {
			 ven : v
			,webkit : /webkit|khtml/.test(ua)
			,find : function(val){
				return ua.indexOf(val)>-1
			}
		};
	})();
	var canvas = function(ele , w , h){
		ele.width = w;
		ele.height = h;
		this.canvas = ele;
		this.ctx = ele.getContext('2d');
	}
	canvas.prototype = {
		a: function(a, b, c, d, e, f){this.ctx.arc(a, b, c, d, e, f);return this;}
		,b: function(a){this.ctx.beginPath();return this;}
		,c: function(a){this.ctx.closePath();return this;}
		,cr: function(a, b, c, d){this.ctx.clearRect(a, b, c, d);return this;}
		,l: function(a, b){this.ctx.lineTo(a, b);return this;}
		,m: function(a, b){this.ctx.moveTo(a, b);return this;}
		,f: function(a){if(a){this.fs(a)}this.ctx.fill();return this;}
		,s: function(a){if(a){this.ss(a)}this.ctx.stroke();return this;}
		,fr: function(a, b, c, d){this.ctx.fillRect(a, b, c, d);	return this;}
		,fs: function(a){this.ctx.fillStyle = a;	return this;}
		,sr: function(a, b, c, d){this.ctx.strokeRect(a, b, c, d);return this;}
		,ss: function(a){this.ctx.strokeStyle = a; return this;}
		
		,sv: function(){this.ctx.save();return this;}
		,rs: function(){this.ctx.restore();return this;}
		,tl: function(a, b){this.ctx.translate(a, b);return this;}
		,lw: function(a){this.ctx.lineWidth = a||1;	return this;}
	}
	var $ = {
		 body : doc.body
		,isAndroid : tool.find("android")
		,isIphone : tool.find("iphone")
		,browser : {
			 opera :  tool.find('opera')
			,safari:  tool.webkit && tool.ven.indexOf('Apple')>-1 && tool.find('safari')
			,chrome:  tool.webkit && tool.ven.indexOf('Google')>-1
			,uc:      tool.webkit && tool.find('uc')
			,qq :     tool.find('mqqbrowser')
			,Ip_chorme: tool.find('iphone; u;')
			,webkit : tool.webkit
		}
		,extend : function(a,b){
			for(var i in b){a[i] = b[i]}
			return a;
		}
		,get : function( a , b ){
			var ele = (b||doc).querySelectorAll(a);
			return ele.length>1?ele:ele[0];
		}
		,css : function(ele, css){
			var z, y = ele.style, x;
			for(var i in css){
				z = css[i];
				x = isNaN(z)?z:z+'px';
				switch(i){					
					case 'l' : y.left             = x; break;
					case 't' : y.top              = x; break;
					case 'w' : y.width            = x; break;
					case 'h' : y.height           = x; break;
					default:y[i] = z;
				}
			}
			return ele;
		}
		,css3 : function(e,z,b){
			if(!b){
				$.fors(['Webkit','O','Moz','Ms'],function(){
					var t = this;
					for(var i in z){
						if(t+i in e.style){
							e.style[t+i] = z[i];
						}
					}
				});
			}else{
				$.fors(['-webkit-','-moz-','-o-','-ms-'],function(t){
					var t = this;
					for(var i in z){
						e.style[(i.toLowerCase())] = t+z[i];
					}
				});
			}
		}
		,myAddListener : function(ele, type, fn){
			if($.isIphone || $.isAndroid){
				var mapping = {
					mousedown	: 'touchstart',
					mouseup		: 'touchend',
					mousemove	: 'touchmove'
				};
				type = mapping[type] || type;
			}
			ele.removeEventListener(type, fn, false);
			ele.addEventListener(type, fn, false);
		}
		,getEvent : function(e, def , p){
			e = e || window.event;
			if(!def){
				e.stopPropagation()
			}
			if(!p){
				e.preventDefault()
			}
			e = e.touches ? e.touches[0] : e;
			return e;
		}
		,resize : function(fn){w.onresize = fn;$.myAddListener(w,"orientationchange",fn);}
		,fors : function(arr,fn){
			for(var i=0,len=arr.length;i<len;i++){
				fn.call(arr[i],i);
			}
		}
		,js : function(a,fn){
			a = typeof a=='string'?[a]:a
			var head = doc.head;
			$.fors(a,function(i){				
				var s = doc.createElement("script");
				s.src = this;
				s.onload = function() {fn(i);};				
				head.insertBefore( s, head.firstChild );
			})
		}
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
	},
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
		,submenu : $.get('.kline .ma ul')
		,footer : $.get('.kline time ul li')
		,add : function(){
			$.myAddListener(C.pic,'mousedown',C.down)
			$.myAddListener(C.pic,'mousemove',C.move)
			$.myAddListener(C.pic,'mouseup',C.up)
		}
		,init : function(){
			C.cnt = $.get('article.content');
			C.pic = $.get('article.pic');
			C.add()
			
			var pic = $.get('article.pic canvas') , mas = [];
			C.top = new canvas(pic[0],0,0)
			C.ft = new canvas(pic[1],0,0)
			$.myAddListener($.get('#mohe-mb_stock'),'mousedown',C.add)
			
			C.head = $.get('.kline .data ul li');
			$.fors($.get('.kline .ma ul') , function( i ){
				if(i==1){
					C.MA = $.get('li',this)
				}
			})
			
			C.l_line = $.get('.left',C.pic)
			C.l_line.li = $.get('li',C.l_line)
			C.r_line = $.get('.right',C.pic)
			C.r_line.li = $.get('li',C.r_line)
			
			C.h_line = $.get('.hline',C.pic)
			C.h_line.line = $.get('.line',C.h_line)
			C.h_line.lnum = $.get('.l_num',C.h_line)
			C.h_line.rnum = $.get('.r_num',C.h_line)
			
			C.v_line = $.get('.vline',C.pic)
			C.v_line.line = $.get('.line',C.v_line)
			C.v_line.num = $.get('.num',C.v_line)
			
			//C.title = $.get('h2 .name')
		}
		,search : function( ){
			var id = Math.random()*(999)*1000;
			if(M.tab == 'kline'){
				$.js('http://flashdata2.jrj.com.cn/today/js/mQuote/'+C.type+'/'+C.keyword+'.js?stockstarID='+id,function(){
					C.format_date( Data );
					C.resize();
					//M.load(false);
					C.loading = true;
				})
			}else{
				setTimeout(function(){
					//M.load(false);
				},500)
			}
		}
		,resize : function(){
			C.w = C.pic.clientWidth;
			C.h = C.pic.clientHeight;
			
			var  w = round(C.h*.75)
				,th = round(C.h*.75)
				,fh = round(C.h - th)
				,isPlan;
			
			
			$.css(C.h_line,{display:'none'})
			$.css(C.v_line,{display:'none'})
			C.draw_top(C.w , th);
			C.draw_ft(C.w , fh);
			
			C.get_line();
			G.get_news();
			G.get_f10();
			
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
				$.fors(name,function( n ){
					var arr = [] ;
					$.fors(dis[name[n]].split(';'),function( i ){
						arr[i] = this.split(',');
						if( n == 0 ){ //分时
							$.fors(arr[i],function( k ){
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
			dis.monthK = dis.monthK.slice(20)
			C.D = D;
			//C.title.innerHTML = '<a href="'+dis.stockurl+'">'+dis.stockname + '[' + dis.stocknum +'] 证券之星</a>'
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
			
			$.css(C.l_line,{h:h})
			$.css(C.r_line,{h:h,display:'none'});
			
			if(C.key !== 'timePlan'){
				var arr = line({max:cache.dk.kaimax,min:cache.dk.kaimin})
				$.fors(C.l_line.li,function(i){
					this.innerHTML = arr[i];
				})
			}
			else{
				var  arr1 = line(cache.p)
					,arr2 , m1 , m2 , num
				
				$.css3(C.r_line,{display:'box'},true)
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
				
				
				$.fors(C.l_line.li,function(i){
					this.innerHTML = arr1[i];
				})
				
				$.fors(C.r_line.li,function(i){
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
		,draw_top : function( w , h ){
			var l = w-.5, t = h-.5  , lh = round(h/2)-.5 , h4 = h/4
			C.set_wh(C.top,w,h)
			C.top.b().m(.5,.5).l(l,.5).l(l,t).l(.5,t).c().s('#5182cb')//.b().m(0,lh).l(w,lh).s('#c2c2c2')
			for(var i=0;i<t;i+=h4){
				if(i!==0&&i!==h){
					var _h = round(i)-.5
					if(_h == lh){
						C.top.b().m(1,_h).l(l-1,_h).s('#c2c2c2')
					}else{
						for(var k=1;k<l-1;k++){
							if(k%6==0){C.top.b().m(k,_h).l(k+3,_h).s('#cccccc')}
						}
					}
				}
			}
		}
		,draw_ft : function( w , h ){
			C.set_wh(C.ft,w,h)
			C.ft.b().m(.5,0).l(.5,h-.5).l(w-.5,h-.5).l(w-.5,0).s('#5182cb')
		}
		,get_line : function(){ //判断 画 分时，日K，周K，月K等
			var i = C.site , n = i==0?0:1;
			C.key = ['timePlan','dailyK','weekK','monthK'][i]
			$.fors(C.submenu , function(){
				$.css(this,{display:'none'})
			});
			$.css3(C.submenu[n],{display:'box'},true)
			C.draw = C[['share','Kline'][n]];
			C.draw()
		}
		,scale : function( n ){ //求分时价格比列
			var h = C.top.canvas.height-15;
			return h - $.getScale(n,C.min,C.max,h-15)
		}
		,get_ft_h : function( n , max ){return n/max*(C.ft.canvas.height-5)}
		,max_min : function( D , n , close , max , min ){
			var  a = [] , len = D.length , zhi 
				,num , m1 , m2
				,lw = (C.w-2)/C.line_w; //允许画线的宽度
			zhi = $.sort(D,n);
			max = max || zhi[0][n]
			min = min || zhi[len-1][n]
			if(close != undefined){
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
			
			C.draw_line(cache.p, '#005dd8')
			if(C.type!='i'){C.draw_line(cache.av , '#f79d00')};
			
			C.draw_ftline(C.max_min(plan , 4))
		}
		,draw_ftline : function( obj , bd , c ){
			var  lw = obj.lw
				,left  , top
				,ft_h = C.ft.canvas.height
				,n = obj.n
				,color = C.gray
				,w = C.key != 'timePlan'?cache.dk.w/2:0
			$.fors(obj.arr,function( i ){ 
				left = round(i*lw)+2.5+w
				top = round(ft_h - C.get_ft_h(parseFloat(this[n]) , obj.max))
				if(c!=undefined) color = parseFloat(this[c])>0?C.red:C.green
				C.ft.b().m(left,ft_h).l(left,top).lw(bd).s(color)
			})
		}
		,draw_line : function( obj , color ){ // 开始画线 
			var  D = obj.arr
				,len = obj.len
				,lw = obj.lw
				,left , top 
				,num 
				,ob = C.max_min([],0,obj.close,obj.max,obj.min);
				
			C.close = ob.close;
			C.max = ob.max;
			C.min = ob.min;
			$.fors(D,function( i ){ //2.5为draw_top中 left:.5 w-.5 +画线的线条占的.5 总共为2 参考线占了 .5 加起来 2.5
				left = round(i*lw)+2.5
				num = D[i][obj.n]
				top = round(C.scale(num))-2.5 ;
				if(i==0){
					C.top.b().m(left,top).lw(1)
				}else{
					C.top.l(left,top)
				}
			})
			C.top.s(color);
		}
		,down : function( e ){
			e = $.getEvent(e,0,1);
			if(this.setCapture) this.setCapture();
			C.ismove = true; 
			this.move = false;
			this.x = e.clientX;
			this.y = e.clientY;
			$.css(C.h_line,{display:'block'})
			$.css(C.v_line,{display:'block'})
			C.update(e.clientX);
		}
		,move : function( e ){
			var ee = e.touches ? e.touches[0] : e
			if(C.ismove){
				if(!this.move){
					var  x = abs(ee.clientX - this.x)
						,y = abs(ee.clientY - this.y);
					if(x>y){
						this.move = true;
					}
				}
				if(this.move == true){
					$.getEvent(e);
					C.update(ee.clientX);
				}
			}
			
		}
		,up : function(){
			this.move = false;
			C.ismove = false;
			if(this.releaseCapture)this.releaseCapture();
			$.css(C.h_line,{display:'none'})
			$.css(C.v_line,{display:'none'})
			C.default_data();
		}
		,update : function( x ){
			var  w = C.w-3.5
				,D = C.D.display[C.key] , n , d
				,l = 2.5 , t = 2.5 , len = D.length
				,move_x = x-11 //11为1个边匡l+10个左边距
				,lw = w/C.line_w
				,obj
				,_d
				,isPlan = (C.key == 'timePlan')
				,_w = 0 //cache.dk.w/2 为K线宽高的中间
			
			n = floor(move_x*C.line_w/w);
			_w = isPlan?0:cache.dk.w/2
			
			if(!D[n]){ n = n<=0?0:len-1}
			
			l = ceil(n*lw+l+_w)
			d = D[n]
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
			$.css(C.h_line.line,{t:t})
			$.css(C.h_line.lnum,{t:t-7})
			$.css(C.h_line.rnum,{t:t-7})
			C.h_line.lnum.innerHTML = d.l
			
			$.css(C.h_line.rnum,{display:(d.r?'block':'none')})
			if(d.r){C.h_line.rnum.innerHTML = d.r+'%'}
			
			vl = vl<=0?0:vl>=C.w-w?C.w-w:vl;
			$.css(C.v_line.line,{l:l})
			$.css(C.v_line.num,{l:vl,w:w})
			C.v_line.num.innerHTML = d.time
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
				$.fors(C.MA , function( i ){
					this.innerHTML = ma[i]+':'+[_d[9],_d[10],_d[11]][i]
				})
			}
			$.fors(C.head , function( i ){
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
				$.fors(C.footer,function( i ){
					this.innerHTML = ['09:30','11:30/13:00','15:00'][i]
				})
			}else{
				var dk = cache.dk;
				$.fors(C.footer,function( i ){
					this.innerHTML = [dk.from_time,'',dk.to_time][i]
				})
			}
		}
		,Kline : function(){ //K
			var D = C.D , dis = D.display , kline = dis[C.key]
				,_mx = C.max_min(kline , 3).max , _mi = C.max_min(kline , 4).min
				,_kai = C.max_min(kline , 1)
				,len = kline.length
				,lw = (C.w-2)/len//允许画的宽度 
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
			function d( obj , color){
				var  D = obj.arr
					,lw 
					,len = obj.len
					,arr = []
					,z
					,left , top ;
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
				var _ca = $.sort(arr);
				len = arr.length;
				lw = (C.w-2)/len;
				//C.max = _ca[0];
				//C.min = _ca[len-1];
				for(var i=0; i<len; i++){
					left = round(i*lw)+2.5
					top = round(C.scale( arr[i] ))-2.5 ;
					if(i==0){
						C.top.b().m(left,top).lw(1)
					}else{
						C.top.l(left,top)
					}
				}
				C.top.s(color);
			}
			$.fors(['dMA5','dMA10','dMA20'],function( i ){
				cache[this] = C.max_min(kline , i+6)
				d(cache[this], [C.yellow,C.purple,C.blue][i])
				$.css(C.MA[i],{color:[C.yellow,C.purple,C.blue][i]})
			});
			
			
			C.draw_ftline(C.max_min(kline , 5),lw*.5,9)
			
			/* C.max = _mx;
			C.min = _mi; */
			C.draw_kline(cache.dk)
			
		}
		,draw_kline : function( obj ){
			var  k,g,d,s , w , left , l
				,len = obj.len , max = obj.max , min = obj.min
				,lw = obj.lw , gap
				,w = obj.w
				,tlw = ceil(w/2)
				,color
				,mg = 2.5;
			$.fors( obj.arr , function( i ){
				l = round(i*lw)+mg
				color = parseFloat(this[9])>0?C.red:C.green
				k = ceil(C.scale(this[1]))-mg
				s = ceil(C.scale(this[2]))-mg-.5
				g = ceil(C.scale(this[3]))-mg+.5
				d = ceil(C.scale(this[4]))-mg+.5
				
				C.top.sv().b().tl(tlw,0).m(l,g).l(l,d).lw(.9).s(color).rs().sv().b().f(color).fr(l+.5,k+.5,w,round(s-k)).rs()
			})
		}
	},
	G = {
		 init : function(){
			G.li = $.get('a .li',M.news)
			$.fors($.get('a i',M.news),function(){
				this.style.display = 'none'
			})
			G.news_more = $.get('a.more',M.news)
			var arr = [] , li
			$.fors($.get('section.f10 ul'),function(){
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
			$.fors(G.news , function( i ){
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
			$.fors(arr , function( i ){
				if(i<5){
					G.f10[i].innerHTML = this
				}
			});
			G.atr(G.f10_more , dis.informMoreUrl , 'detail');
		}
	}
	M = {
		 tab : 'kline' //,'news','f10'
		,menu : $.get('.kline menu li')
		//,refresh : $.get('#mohe-mb_stock h2 span')
		,nav : $.get('#mohe-mb_stock nav li')
		,news : $.get('article.content .news')
		,kline : $.get('article.content .kline')
		,f10 : $.get('article.content .f10')
		,init : function(){
			C.init(); //画图工具
			G.init(); //新闻工具
			
			M.current(M.menu,function( i ){
				C.site = i;
				C.resize();
			})
			M.current(M.nav,M.nav_tab)

			$.resize(function(){
				time = setTimeout(function(){
					M.resize();
				},300);
			});
			M.isload();
			
			/* M.refresh.onclick = function(){
				M.search(C.keyword,C.type);
			} */
			M.getName();
		}
		,isload : function(){ //不断判断是否有数据加载 另一个从1-7秒不断刷新在index.html页面
			if(C.loading !== true){
				setTimeout(function(){
					M.resize();
					M.isload();
				},200)
			}
		}
		/* ,load : function( b ){
			if(!M.refresh.icon){
				M.refresh.icon = $.get('i',M.refresh)
			}
			if(b == true){
				M.refresh.icon.className = 'cur'
			}else{
				M.refresh.icon.className = ''
			}
		} */
		,search : function( name , type  ){ //用于搜索
			//M.load(true);
			C.keyword = name || '000001'
			C.type = type || 's'
			C.search()
		}
		,resize : function(){
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
		,current : function( ele , fn ){
			$.fors(ele,function( i ){
				this.onclick = function(){
					$.fors(ele,function(){this.className=''})
					this.className = 'current'
					fn.call(this,i)
				}
			})
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
	M.init();
	w.stockstar = {start:M.resize}
});