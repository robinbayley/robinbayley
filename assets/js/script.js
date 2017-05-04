$( document ).ready(function() {
	var glitch = $( ".glitch" ).glitch();
	setInterval(function(){
		var index = glitch.next();
	}, 3000);
});
