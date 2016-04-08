(function( win , $ ){
/**
	1、自选显示或隐藏
	2、买卖
	3、新闻显示或隐藏
	4、公司资料显示或隐藏
	5、买卖5档
	6、资金
	7、F10
	8、搜索
	9、载图分享
	10、分享
**/
var Tool = {
	init : function(){
		 
	}
	,getTitle : function(){
		return JSON.parse(T.get_stor('MyMenuTitle'));
	}
	,setTitle : function( bool ){
		T.set_stor( 'MyMenuTitle'  , bool );
		M.update();
	}
	,getNav : function(){
		return JSON.parse(T.get_stor('MyMenuNav'));
	}
	,setNav : function( bool ){
		T.set_stor( 'MyMenuNav'  , bool );
		M.update();
	}
}
,Mymenu = {
	init : function( elem ){
		Mymenu.elem = elem;
		var obj = Mymenu.getPosition();
		Mymenu.elem.css({left:obj.left+'px',top:obj.top+'px'});
		Mymenu.addEvent();
		Mymenu.resize();
		//T.dele_stor('MyMenuPosition');
	}
	,addEvent : function( ){
		var  list = Mymenu.elem
			,self = Mymenu;
		T.myAddListener(list,'mousedown', self.downEvent);
		T.myAddListener(list,'mousemove',self.moveEvent);
		T.myAddListener(list,'mouseup',self.upEvent);
	}
	,resize : function(){
		
	}
	,getPosition : function(){ //获取图标位置
		
		var size = T.get_stor('MyMenuPosition');
		if( void 0 != size){
			return JSON.parse(size);
		}else{
			Mymenu.setPosition({left:M.width-50,top:M.height-50});
			return arguments.callee(arguments);
		}
	}
	,setPosition : function( val ){ //设置图标位置
		T.set_stor( 'MyMenuPosition'  , JSON.stringify(val) )
	}
	,downEvent : function(  e ){
		e = T.getEvent(e,0,1);
		if(this.setCapture) this.setCapture();
		this.firstX = e.clientX;
		this.firstY = e.clientY;
		this.left = e.clientX - Dome.element.elem.offset().left - Mymenu.elem.width()/2;
		this.top = e.clientY - Dome.element.elem.offset().top - Mymenu.elem.height()/2;
		this.moveX = 0;
		this.moveY = 0;
		this._move = true;
		this._ismove = false;
	}
	,moveEvent : function(  e ){
		if(!this._move) return;
		e = T.getEvent(e,0,1);
		var  list = Mymenu.elem
			,xPoint = e.clientX
			,yPoint = e.clientY
			,x , y
			,r = 32
			,w = M.width - r
			,h = M.height - r;
		x = Math.abs( xPoint - this.firstX );
		y = Math.abs( yPoint - this.firstY );
		
		this._ismove = true;
		
		this.moveX = xPoint - this.firstX;
		this.moveY = yPoint - this.firstY;
		
		this.endX = this.moveX+this.left;
		this.endY = this.moveY+this.top;
		
		if(this.endX<0){
			this.endX = 0;
		}else if(this.endX>w){
			this.endX = w;
		}
		if(this.endY<0){
			this.endY = 0;
		}else if(this.endY>h){
			this.endY = h;
		}
		
		list.css({left:this.endX+'px',top:this.endY+'px'})
		
	}
	,upEvent : function(  e ){
		this._move = false;
		if(this.releaseCapture)this.releaseCapture();
		if(this._ismove){
			this._ismove = false;
			Mymenu.setPosition({left:this.endX,top:this.endY})
		}
	}
} 
,M = {
	init : function(){
		M.resize();
		M.dome = Dome.element
		M.menu = Dome.element.menu.elem
		M.column = Dome.element.column
		M.content = Dome.element.content.elem;
		M.mask = Dome.element.mask.elem;
		
		
		Mymenu.init(M.menu);
		M.addcolumn();
		
		var menuClick = true;
		M.menu.click(function(){
			menuClick = !menuClick;
			if(menuClick){
				M.hide();
			}else{
				M.show();
			}
		});
		M.mask.click(function(){
			M.hide();
			menuClick = true;
		});
		Tool.init();
		M.update();
	}
	,resize : function(){
		M.width = Dome.width;
		M.height = Dome.height;
		Mymenu.resize();
	}
	,getTitleStatus : function(){
		return Tool.getTitle();
	}
	,setTitleStatus : function( val ){
		Tool.setTitle(val);
	}
	,update : function(){ //更新栏目状态
		var  title = Tool.getTitle()
			,nav = Tool.getNav();
		M.navList.removeClass('cur');
		if( title == true ){
			M.navs.title.addClass('cur');
			M.showTitle();
		}else{
			M.hideTitle();
		}
		if( nav == true ){
			M.navs.nav.addClass('cur');
			M.showNav();
		}else{
			M.hideNav();
		}
	}
	,navList : null
	,addcolumn : function(){
		var nav = $(['<div><p>显示标题</p>'
				,'<p>显示栏目</p>'
				,'<p>显示买卖5档</p>'
				,'<p>我要分享</p>'
			,'</div>'].join(''))
			,status
			,name;
		M.navList = nav.find('p');
		M.navs = {
			title : M.navList.eq(0)
			,nav : M.navList.eq(1)
			,maimai : M.navList.eq(2)
			,share : M.navList.eq(2)
		}
		M.column.list.append(nav);
		M.navList.each(function( i ){
			$(this).click(function(){
				M.navCurrent = i;
				switch(i){
					case 0 : { //显示标题
						name = 'Title'
						break;
					}
					case 1 : { //显示栏目
						name = 'Nav'
						break;
					}
					case 2 : { //显示买卖5档
						
						break;
					}
					case 3 : { //我要分享
						
						break;
					}
				};
				if(i==0 || i==1 ){
					status = Tool['get'+name]();
					status = !status;
					Tool['set'+name](status);
				}
			});
		});
		
	}
	,show : function(){//显示栏目信息
		M.content.css3({transform:'translate3d(-40%,0,0)'});
		M.mask.css3({zIndex:89})
		setTimeout(function(){
			M.mask.css3({opacity:1});
		},50);
	}
	,hide : function(){
		M.content.css3({transform:'translate3d(0,0,0)'});
		M.mask.css3({opacity:0})
		setTimeout(function(){
			M.mask.css3({zIndex:1});
		},50);
	}
	,showNav : function(){
		console.log('showNav')
		
	}
	,hideNav : function(){
		console.log('hideNav')
	}
	,showTitle : function(){
		M.dome.title.elem.prependTo(M.dome.content.elem);
		Main.resize();
	}
	,hideTitle : function(){
		M.dome.title.elem.remove();
		Main.resize();
	}
	,select : {//自选
		
	}
	,buy : { //买卖
		show : function(){
			
		}
		,hide : function(){
			
		}
	}
}
win.Menu = M;
})(window , $ );