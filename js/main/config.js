require.config({
    baseUrl: 'js/',
    paths: {
        'zepto': 'lib/zepto',
        'pub': 'main/global',
		'text' : 'lib/text'
		,'a' : 'controller/dome'
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
});

//urlArgs: 'v=201604151119'