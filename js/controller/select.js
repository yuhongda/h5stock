define([
	'views/select'
	,'./price'
	,'modules/stockData'
],function( HTML , price , Data ){
	var S = {
		init : function( nav ){
			
			S.parentElement = nav.options;
			S.Dome = $(HTML);
			S.list = S.Dome.find('ul.cnt');
			S.parentElement.append(S.Dome);
			
			S.btnParentElemnt = price.element.canvasBox.elem;
			S.selector = $('<div class="add-stock">+自选</div>')
			S.selector.appendTo(S.btnParentElemnt);
			
			setTimeout(function(){
				S.selector.css({opacity:1})
			},1000);
			
			S.selector.click(function( e ){
				e.stopPropagation();
				var self = $(this);
				self.css3({opacity:0,transform:'translate(100px,100px)'});
				setTimeout(function(){
					self.hide();
					S.add();
				},350);
				return false;
			});
			S.get();
		}
		,resize : function(){
			
		}
		,set : function( arr ){
			T.set_stor( 'stockSelect'  , JSON.stringify(arr) );
		}
		,get : function(){
			return JSON.parse(T.get_stor('stockSelect'));
		}
		,del : function(){
			
		}
		,add :function(){
			var  type = Data.type
				,dis = Data.Data.display
				,name = dis.stockname
				,code = dis.stocknum
				,isSelect = false
				,arr = S.get() || [];
				
			$.each(arr,function( i , obj ){
				if( obj.code == code ){
					isSelect = true;
				}
			});
			
			if(isSelect == false){
				arr.push({
					 name : name
					,code : code
					,type : type
					,pl : dis.fluctuation //涨幅
					,vl : dis.lowPrice //总手
				});
				S.set(arr);
			}
			//,transactionPrice : 12.55 //交易价格
			//,highPrice : 12.69  //最高
			//,lowPrice : 12.45  //最低
			//,Volume : 430343   //总手
			//,Economy : '0.77%'  // 收益率
			//,range : '-1.34%' //涨跌幅
			//,fluctuation : '-0.17' //涨跌 差价
			//,averagePrice : 12.57 //平均
		}
		,update : function(){ //每点击一次，便更新
			var  list = S.list
				,sel = S.get()
				,codes = '' , str = '';
			$.each(sel,function( i , obj ){
				codes += obj.code + ','
			});
			
			$.ajax({
				 url : 'http://q.jrjimg.cn/?q=cn|s&n=objInt&c=code,name,np,hp,lp,hlp,pl,tm&i='+codes
				,dataType : 'jsonp'
				,complete : function( ){
					var obj = objInt;
					$.each(obj.HqData,function(i,ele){
						var  code = ele[obj.Column.code]
							,name = ele[obj.Column.name]
							,hp = ele[obj.Column.hp] //最高
							,lp = ele[obj.Column.lp] //最低
							,np = ele[obj.Column.np] //最新
							,tm = ele[obj.Column.tm] //总手
							,hlp = ele[obj.Column.hlp] //涨跌
							,pl = ele[obj.Column.pl]; //涨幅
						
						pl	= pl==0?pl+'%':pl>0?'<span class="red">'+pl+'%</span>':'<span class="green">'+pl+'%</span>'
						//hlp	= hlp==0?hlp:hlp>0?'<span class="red">'+hlp+'</span>':'<span class="green">'+hlp+'</span>'
						tm = (tm/1000).toFixed(2)+'万手'
						
						str += '<ul><li>'+name+'</li>' //名称
							+'<li>'+np+'</li>' 
							+'<li>'+pl+'</li>'
							//+'<li>'+hlp+'</li>'
							+'<li>'+tm+'</li>'
							+'<li><span class="add" data-index='+i+'>-</span></li></ul>';

					});
					list.html(str);
					list.find('.add').unbind().bind('click',function(){
						var index = $(this).attr('data-index')
							,data = obj.HqData[index]
						alert(data[0])
					})
				}
			})
			
		}
	}
	return S;
});