require.config({
    baseUrl: 'js/',
    paths: {
        'zepto': 'zepto',
        'pub': 'global',
        'Main': 'main',
        'Menu': 'menu',
        'Dome': 'dome'
    },
	shim: {
		'zepto': {
			exports: '$'
		},
		'pub' : {
			deps : ['zepto'] , 
			exports : 'pub'
		},
		'Main' : {
			deps : ['zepto','pub'] , 
			exports : 'Main'
		},
		'Menu' : {
			deps : ['zepto','pub','Main'] , 
			exports : 'Menu'
		},
		'Dome' : {
			deps : ['zepto','pub','Main','Menu'] , 
			exports : 'Dome'
		}
	}
});

//urlArgs: 'v=201604151119'