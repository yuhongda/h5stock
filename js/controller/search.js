define([
	'text!views/search.html'
],function( HTML  ){
	var search = {
		init : function( D ){
			search.parentElement = D.searchContent;
			search.Dome = $(HTML);
			search.Dome.appendTo(search.parentElement);
			
			search.Dome.find('.tit .back').click(function(){
				D.goTab(1);
			});
		}
		,resize : function(){
			
		}
	}
	return search;
});