define([],function(  ){
	var Tool = {
		setPosition : function( key , val ){ //设置图标位置
			T.set_stor( key  , JSON.stringify(val) )
		}
	} 
	,Mymenu = function( elem , key ){
		
		if(this instanceof Mymenu ){
			this.elem = elem;
			this.key = key;
			T.myAddListener(this.elem,'mousedown', this.downEvent);
			T.myAddListener(this.elem,'mousemove',this.moveEvent);
			T.myAddListener(this.elem,'mouseup',this.upEvent);
		}else{
			return new Mymenu( elem , key );
		}
	};
	Mymenu.prototype = {
		downEvent : function(  e ){
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
				Tool.setPosition(this.key , {left:this.endX,top:this.endY})
			}
		}
	}
	return Mymenu;
});