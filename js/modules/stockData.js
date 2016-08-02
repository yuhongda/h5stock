define(['pub'],function( T ) {
	var D = {
		 type : 's' //i: 指数; s: 股票; IF:  股指期货 ( 默认为股票 )
		,keyword : '000001'
		,Data : [] //所有数据
		,search : function( name , type , fn  ){ //用于搜索
			D.keyword = name || '000001'
			D.type = type || 's';
			D.getData(fn);
		}
		,getPrice : function( fn ){
			var id = Math.random()*(999)*1000;
			T.getScript('http://flashdata2.jrj.com.cn/today/js/index/'+D.keyword+'.js?stockstarID='+id,function(){
				fn( window['Min_'+D.keyword] );
			});
		}
		,getData : function( fn ){ //code
			var id = Math.random()*(999)*1000;
			try{
				//哈哈哈中
				T.getScript('http://flashdata2.jrj.com.cn/today/js/mQuote/'+D.type+'/'+D.keyword+'.js?stockstarID='+id,function(){
					D.format_date( Data, fn );
				});
			}catch(e){
				require(['modules/data'],function(){
					D.format_date( Data , fn );
				});
			}
		}
		,format_date : function( Data , fn ){ //时间，价格，均价，换手率，成交量，涨幅，涨跌
			var  name = ['timePlan','dailyK','weekK','monthK']
				,dis = Data.display;
			
			if(typeof dis.timePlan != 'string') return fn.call( D , Data );
			function mat( dis ){
				$.each(name,function( n ){
					var arr = [] , arr1 = dis[name[n]].split(';');
					$.each(arr1,function( i , _arr ){
						arr[i] = _arr.split(',');
						//if( n == 0 ){ //分时
						//	$.each(arr[i],function( k , val ){
						//		if( k!=0 && k!=2  ){//&& k!=5
						//			if(k==5){
						//				arr[i][k] = parseFloat(val);
						//			}else{
						//				arr[i][k] = parseFloat(val);
						//			}
						//		}
						//	})
						//}
					})
					dis[name[n]] = arr;
				})
			}
			mat(dis)
			dis.dailyK = dis.dailyK.slice(20) //20为ma20 需要的数，所以从第20个算起同步百度
			dis.weekK = dis.weekK.slice(20)
			dis.monthK = dis.monthK.slice(20);
			D.Data = Data;
			
			//console.log(D.keyword)
			fn && fn.call( D , Data );
		}
		,getName : function(){
			var  type = M.getPara('type')
				,code = M.getPara('code')
			if(!type||type!='i'&&type!='IF'){
				type = 's'
			}
			//console.log(type+':'+code)
			if( !type || !code ) return;
			D.search(code,type);
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
	return D;
});