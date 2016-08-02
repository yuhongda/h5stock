(function( win , $ ){
	var win = window , doc = document;
	requestAnimationFrame = win.requestAnimationFrame ||
							win.mozRequestAnimationFrame ||
							win.webkitRequestAnimationFrame || 
							win.msRequestAnimationFrame || 
							win.oRequestAnimationFrame ||
							win.setImmediate ||
							win.msSetIntermediate || 
							function(callback){setTimeout(callback,1000/60)};
	var T = {
		init : function(){
			T.stopPreventDefault();
			T.addCanvas();
			T.isbrowser();
			T.setCss();
			
		}
		,stopPreventDefault : function(){ //禁止默认事件
			win.getSelection
			? win.getSelection().removeAllRanges()
			: document.selection.empty();
			document.onselectstart = function(){return false};
			document.ondragstart = function(){return false};
			document.orientationchange = function(e){
				e.preventDefault();
				return false;
			}
			document.documentElement.style.webkitTouchCallout = "none"; //禁止弹出菜单
			document.documentElement.style.webkitUserSelect = "none";	//禁止选中 */
			//T.myAddListener([win],'mousedown',function(e){T.getEvent(e)});
			//T.myAddListener([win],'mousemove',function(e){T.getEvent(e)});
			//T.myAddListener([win],'mouseup',function(e){T.getEvent(e)});
		}
		,isbrowser : function(){
			var ua = navigator.userAgent;
			T.isIpad = ua.match(/iPad/i) != null ;
			T.isIphone = !T.isIpad && ((ua.match(/iPhone/i) != null) || (ua.match(/iPod/i) != null)) ;
			T.isIos = T.isIpad || T.isIphone ;
			T.isAndroid = !T.isIos && ua.match(/android/i) != null ;
			T.isMobile = T.isIos || T.isAndroid;
			T.isWeixin = ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
			T.browser = ua;
		}
		,resizefn : []
		,resize : function( fn ){
			T.resizefn.push(fn);
			T.resizeChange();
		}
		,resizeChange : function(){
			$(win).unbind('orientationchange resize',T.resizeChange);
			setTimeout(function(){
				var i = 0 , len = T.resizefn.length;
				for( ; i < len ; i++){
					T.resizefn[i]();
				}
				$(win).bind('orientationchange resize',T.resizeChange);
			},300);
		}
		,getScript : function(a,fn){
			a = typeof a=='string'?[a]:a
			var head = doc.head;
			$.each(a,function(i){				
				var s = doc.createElement("script");
				s.src = this;
				s.onload = function() {fn(i);};				
				head.insertBefore( s, head.firstChild );
			})
		}
		,setCss : function(){
			var css3 = function( self , obj , bool ){
				if(!self) return;
				if(!bool){
					var  i , val 
						,element = '' 
						,value = '' 
						,css3Name = ['Webkit','Moz','O','Ms']
						,str = '';
						
					val = self.currentStyle?self.currentStyle['WebkitAnimation'] : document.defaultView.getComputedStyle(self,false)['WebkitAnimation'];
					
					for( i in obj){
						value = obj[i];
						
						element = i.replace(/^\w/g,function(s){
							return s.toUpperCase();
						});
						var j = 0 , css3Style = '';
						for(  ; j<css3Name.length; j++){
							css3Style = css3Name[j]+element;
							if( css3Style in self.style){
								self.style[css3Style] = value ; 
								setTimeout(function(){
									self.style['WebkitAnimation'] = val ; 
								},1500)
							}else{
								self.style[i] = value ; 
							}
						}
					}
				}else{
					$.each(['-webkit-','-moz-','-o-','-ms-'],function(t){
						var t = this;
						for(var i in obj){
							self.style[(i.toLowerCase())] = t+obj[i];
						}
					});
				}
			};
			$.fn.css3 = function( obj , bool ){
				this.each(function(){
					css3(this,obj , bool)
				})
			}

		}
		,set_stor : function(key,val){
			try{localStorage.setItem(key,val)}catch(e){}
		}
		,get_stor : function(key){
			try{return localStorage.getItem(key)}catch(e){}
		}
		,dele_stor : function(key){
			try{localStorage.removeItem(key)}catch(e){}
		}
		,addCanvas : function(){
			T.canvas = function(ele,w,h){
				if(this instanceof T.canvas){
					var obj = ele[0];
					obj.width = w;
					obj.height = h;
					this.ctx = obj.getContext('2d');
					this.canvas = obj;
				}else{
					return new T.canvas(ele,w,h);
				}
			}
			T.canvas.prototype = {
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
				,ft: function(a, b, c){this.ctx.fillText(a, b, c);return this;}
				,fo: function(a){this.ctx.font = a;return this;}
				,sr: function(a, b, c, d){this.ctx.strokeRect(a, b, c, d);return this;}
				,ss: function(a){this.ctx.strokeStyle = a; return this;}
				
				,sv: function(){this.ctx.save();return this;}
				,rs: function(){this.ctx.restore();return this;}
				,rt: function(a){this.ctx.rotate(a);return this;}
				,tl: function(a, b){this.ctx.translate(a, b);return this;}		
				,lg: function(a,b,c,d, e){
					this.grad = this.ctx.createLinearGradient(a,b,c,d);
					for(var i=0, len=e.length; i<len; i++){
						this.grad.addColorStop(e[i][0], e[i][1]);
					}
					return this;
				}
				,qc: function(a, b, c, d){this.ctx.quadraticCurveTo(a, b, c, d);return this;}
				,lw: function(a){this.ctx.lineWidth = a||1;	return this;}
				,sd: function(a, b, c, d){
					this.ctx.shadowOffsetX = a;
					this.ctx.shadowOffsetY = b;
					this.ctx.shadowColor = c;
					this.ctx.shadowBlur = d;
					return this;
				}
				,toPic : function(){return this.ctx.canvas.toDataURL()}
			}
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
		,myAddListener : function(ele, type, fn){
			if(T.isIphone || T.isAndroid){
				var mapping = {
					mousedown	: 'touchstart',
					mouseup		: 'touchend',
					mousemove	: 'touchmove'
				};
				type = mapping[type] || type;
			}
			ele[0].removeEventListener(type, fn, false);
			ele[0].addEventListener(type, fn, false);
		}
	};
	T.init();
	window.T = T;
})(window,$);