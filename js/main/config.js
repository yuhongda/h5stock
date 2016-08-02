require.config({
    baseUrl: 'js/',
    paths: {
        'zepto': 'lib/zepto',
        'pub': 'main/global',
		//'text' : 'lib/text'
    },
	shim: {
		'zepto': {
			exports: '$'
		},
		'pub' : {
			deps : ['zepto'] , 
			exports : 'T'
		}
	}
	,urlArgs: "v=" + (new Date()).getTime()
});

//urlArgs: 'v=201604151119'