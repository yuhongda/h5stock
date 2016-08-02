define([
	'views/nav'
	,'./stockTitle'
	,'./stocknav'
	,'main/moveEvent'
	,'./stock'
	,'./search'
],function( HTML , title , nav , Move  , stock , search ){
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
			M.resize();
		}
		,getNav : function(){
			return JSON.parse(T.get_stor('MyMenuNav'));
		}
		,setNav : function( bool ){
			T.set_stor( 'MyMenuNav'  , bool );
			M.resize();
		}
	}
	,G = {
		 title : false  //隐藏标题
		,nav : false //隐藏栏目 
		,init : function( D ){
			G.parent = D;
			G.parentElement = D.wapper;
			G.content = D.content
			G.stockContent = D.stockContent
			G.Dome = $(HTML);
			D.wapper.append(G.Dome);
			
			G.width = D.width;
			G.height = D.height;
			
			G.setElement();
			M.init();
		}
		,resize : function( D ){
			G.width = D.width;
			G.height = D.height;
			M.resize();
		}
		,setElement : function(){
			var dome = G.Dome;
			G.element = {
				 title : $(title)
				,nav : $(nav)
				,column : dome.find('.stock-column')
				,list : dome.find('.stock-list')
				,menu : dome.find('.stock-myMenu')
				,mask : dome.find('.stock-mask')
			}
		}
	}
	,Mymenu = {
		init : function( elem ){
			Mymenu.elem = elem;
			var obj = Mymenu.getPosition();
			Mymenu.elem.css({left:obj.left+'px',top:obj.top+'px'});
			Mymenu.addEvent();
			//T.dele_stor('MyMenuPosition');
		}
		,addEvent : function( ){
			new Move(G.parentElement , Mymenu.elem , 'MyMenuPosition')
		}
		,resize : function(){
			var obj = Mymenu.getPosition()
				,width = G.width-Mymenu.elem.width()-2
				,height = G.height-Mymenu.elem.height()-2;
			if(obj.left>width){
				obj.left = width
			}
			if(obj.top>height){
				obj.top = height;
			}
			Mymenu.elem.css({left:obj.left+'px',top:obj.top+'px'});
		}
		,getPosition : function(){ //获取图标位置
			var size = T.get_stor('MyMenuPosition');
			if( void 0 != size){
				return JSON.parse(size);
			}else{
				Mymenu.setPosition({left:G.width-50,top:G.height-50});
				return arguments.callee(arguments);
			}
		}
		,setPosition : function( val ){ //设置图标位置
			T.set_stor( 'MyMenuPosition'  , JSON.stringify(val) )
		}
	} 
	,M = {
		init : function(){

			Mymenu.init(G.element.menu);
			M.addcolumn();
			
			M.menuClick = true;
			G.element.menu.click(function(){
				M.menuClick = !M.menuClick;
				if(M.menuClick){
					M.hide();
				}else{
					M.show();
				}
			});
			G.element.mask.click(function(){
				M.hide();
				M.menuClick = true;
			});
			M.update();
		}
		,resize : function(){
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
			G.title = title;
			G.nav = nav;
			
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
			G.parent.resize();
		}
		,navList : null
		,addcolumn : function(){
			var nav = $(['<div><p>显示标题</p>'
					,'<p>显示栏目</p>'
					//,'<p>显示买卖5档</p>'
					//,'<p>我要分享</p>'
					,'<p>搜索</p>'
				,'</div>'].join(''))
				,status
				,name;
			M.navList = nav.find('p');
			M.navs = {
				 title : M.navList.eq(0)
				,nav : M.navList.eq(1)
				,maimai : M.navList.eq(2)
				,share : M.navList.eq(3)
				,search : M.navList.eq(4)
			}
			G.element.list.append(nav);
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
						case 2 : { //搜索
							G.parent.goTab(0);
							M.menuClick = true;
							M.hide();
							break;
						}
						case 3 : { //我要分享
							
							break;
						}
						case 4 :{ //显示买卖5档
							
						}
					};
					if(i==0 || i==1 ){
						status = Tool['get'+name]();
						status = !status;
						Tool['set'+name](status);
						M.update();
					}
				});
			});
			
		}
		,show : function(){//显示栏目信息
			G.content.css3({transform:'translate3d(-40%,0,0)'});
			G.element.mask.css3({zIndex:89})
			setTimeout(function(){
				G.element.mask.css3({opacity:1});
			},50);
		}
		,hide : function(){
			G.content.css3({transform:'translate3d(0,0,0)'});
			G.element.mask.css3({opacity:0})
			setTimeout(function(){
				G.element.mask.css3({zIndex:1});
			},50);
		}
		,showNav : function(){
			nav.show();
		}
		,hideNav : function(){
			nav.hide();
		}
		,showTitle : function(){
			title.show();
		}
		,hideTitle : function(){
			title.hide();
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
	return G;
});