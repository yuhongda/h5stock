define([
	'views/search'
	,'pub'
	,'modules/stockData'
],function( HTML , T , Data  ){
	var SearchBox = function (param, charset, success, failer){
		SearchBox.focusInstance = this;
		
		this.url = "http://code.jrjimg.cn/code?1=1";
		this.param = param;
		this.charset = charset;
		this.success = success;
		this.failer = failer;
		
		/*
		 * @property {String} 查询延时
		 */
		this.timerDelay = "200"; 
		
		/*
		 * @property {Object} timer
		 */
		
		/*
		 * @property {String} 查询内容
		 */
		this.requestTxt = '';
		
		this.init();
	};
	SearchBox.prototype = {
		init: function (success){
			
		},
		requestData: function(txt) {
			this.requestTxt = txt;
			var self = this;
			
			this.stopRequest();
			
			this.timer = setTimeout(function (){
				var oSrc = self.url + self.param + "&key=" + self.requestTxt + "&d=" + new Date().getTime();
				
				T.getScript([oSrc], function (){
					self.handleResponse(SCodeData);
				}, self.charset);
				
				self.timer = setTimeout(arguments.callee, self.timerDelay);
			}, this.timerDelay);
	    },
	    /**
		 * @ignore
		 */
	    handleResponse : function(data){
	    	if(data.CodeData.length != 0){
	    		this.success(data);
	    	}else{
	    		this.failer(data);
	    	}
	    	this.stopRequest();
	    },
	    
	    stopRequest: function (){
	    	window.clearTimeout(this.timer);
	    	this.timer = null;
	    }
	};
	var search = {
		init : function( D ){
			search.parentElement = D.searchContent;
			search.Dome = $(HTML);
			search.input = search.Dome.find('.input input');
			search.Dome.appendTo(search.parentElement);
			search.list = search.Dome.find('.list');
			
			search.Dome.find('.tit .back').click(function(){
				D.goTab(1);
			});
			var sear = new SearchBox("item=20&type=cn_i,s", 'gb2312', function( _data ){
					search.list.html('')
					var tab = '<div class="th"><ul><li>股票名称</li><li>代码</li></ul></div><div class="cnt">',
						inf = _data.CodeData,
						result = [];
					if(inf.length != 0){
						for(var i=0; i<inf.length; i++){
							result.push( [inf[i]['code'], inf[i]['name'], inf[i]['type'].split('.')[0]] );
						}
					}else{
						result = [];
					}
					
					$.each(result, function(  i , arr ){
						tab += '<ul data-code='+arr[0]+'  data-type='+arr[2]+'>'
								+'<li>'+arr[1]+'</li>'
								+'<li>'+arr[0]+'</li>'
								//+'<li>加自选</li>'
							+'</ul>'
					});
					search.list.append(tab+'</div></div>');
					search.list.find('ul').each(function( i , ele ){
						$(ele).click(function( e ){
							e.stopPropagation();
							var  code = $(this).attr('data-code')
								,type = $(this).attr('data-type');
							if(code){
								Data.search(code,type , function(){
									D.goTab(1);
								});
							}
						})
					});
				}
				,function(){ //无数据
					search.list.html('<div class="error">暂无数据</div>')
				}
			);
			search.input.bind('input',function( e ){
				search.list.html('<div class="error">加载中...</div>')
				sear.requestData($(this).val());
			});
		}
		,resize : function(){
			
		}
	}
	return search;

});