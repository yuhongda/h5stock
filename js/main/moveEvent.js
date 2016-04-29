define([],function(  ){
	var Tool = {
		setPosition : function( key , val ){ //设置图标位置
			if(!key || !val) return;
			T.set_stor( key  , JSON.stringify(val) )
		}
	} 
	,Mymenu = function( parentElement , elem , key ){
		
		if(this instanceof Mymenu ){
			this.parentElement = parentElement;
			this.elem = elem;
			this.key = key;
			
			var self = this;
			
			T.myAddListener(this.elem,'mousedown', function( e ){
				self.downEvent.call( this , e , self );
			});
			T.myAddListener(this.elem,'mousemove',function( e ){
				self.moveEvent.call( this , e , self );
			});
			T.myAddListener(this.elem,'mouseup',function( e ){
				self.upEvent.call( this , e , self );
			});
		}else{
			return new Mymenu( parentElement , elem , key );
		}
	};
	Mymenu.prototype = {
		downEvent : function(  e , self ){
			e = T.getEvent(e,0,1);
			if(this.setCapture) this.setCapture();
			this.firstX = e.clientX;
			this.firstY = e.clientY;
			
			var  ml = self.parentElement.offset().left
				,my = self.parentElement.offset().top
				,x = this.firstX-self.elem.offset().left - ml
				,y = this.firstY-self.elem.offset().top - my ;
			
			this.left = (e.clientX - ml) - x;
			this.top = (e.clientY - my) - y;
			
			this.moveX = 0;
			this.moveY = 0;
			this._move = true;
			this._ismove = false;
		}
		,moveEvent : function(  e , self ){
			if(!this._move) return;
			e = T.getEvent(e,0,1);
			var  list = self.elem
				,xPoint = e.clientX
				,yPoint = e.clientY
				//,x , y
				,r = 32
				,w = self.parentElement.width() - r
				,h = self.parentElement.height() - r;
			//x = Math.abs( xPoint - this.firstX );
			//y = Math.abs( yPoint - this.firstY );
			
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
		,upEvent : function(  e , self ){
			this._move = false;
			if(this.releaseCapture)this.releaseCapture();
			if(this._ismove){
				this._ismove = false;
				Tool.setPosition(self.key , {left:this.endX,top:this.endY})
			}
		}
	}
	return Mymenu;
});