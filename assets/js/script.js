$( document ).ready(function() {

	var glitch = $( ".glitch" ).glitch();

	var array = [
		'not just any full-stack developer',
		'e-commerce enthusiast',
		'mostly coffee',
		'i ♥ LAMP',
		'i\'m seriously',
	];

	setInterval(function(){
		var index = glitch.next();
	}, 3000);

	setInterval(function(){
		var _min = Math.ceil( 0 );
		var _max = Math.floor( array.length );
		var _i = Math.floor( Math.random() * ( _max - _min ) ) + _min;
		// $( '.site-tagline' ).glyphic({ input:array[_i], delay:20, mode:'random' });
	}, 3700);

	/*
	$( "#prev" ).click(function()
	{
		var index = glitch.prev();
	});
	$( "#next" ).click(function()
	{
		var index = glitch.next();
	});
	*/

});
