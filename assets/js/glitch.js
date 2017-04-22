/**
 *
 *
 *
 */
(function( $ )
{
	/**
	 *	glitch()
	 *	@param array options
	 *	@return this
	 *
	 *	- define plugin
	 *	- extend default settings with user specified options
	 *	- iterate over elements
	 */
	$.fn.glitch = function( options )
	{
		/**
		 *	Plugin scope variables.
		 */
		var self;
		var canvas;
		var ctx;
		var wrapper;
		var images = [];
		var index = 0;
		var params;
		var src;
		var bugout = false;
		var cycle = 0;
		var base64Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split();

		self = $( this );
		self.css({ "overflow":"hidden" });
		wrapper = this.parent();

		// wrapper.css({ "overflow":"hidden" });
		/**
		 *	The $.extend() method recurses through all nested
		 *	objects to give us a merged version of both the defaults
		 *	and the passed options, giving the passed options precedence.
		 */
		params = $.extend( true, {}, $.fn.glitch.defaults, options );
		/**
		 *	Creates a canvas element, assigns attributes and style from
		 *	the params array, appends it to the outer wrapper, and returns
		 *	a reference to the DOM element.
		 */
		canvas = $( '<canvas />' )
			.attr( params.canvas_attrs )
			.css( params.canvas_css )
			// .appendTo( wrapper )
			.appendTo( $( this ) )
			.get(0);
		/**
		 *	Creates a 2d context on the canvas.
		 */
		ctx = canvas.getContext('2d');
		/**
		 *	Loop through the element references, find images and push
		 *	the image source attribute to the images array, then hide
		 *	the element.
		 */
		this.each(function()
		{
			var element = $( this );
			var element_img = element.find( 'img' );
			element_img.each(function() {
				// console.log( $( this ).attr('src') );
				images.push( $( this ).attr('src') );
				// $( this ).hide();
				$( this ).parent().hide();
			});
			// element.hide();
		});
		/**
		 *	Creates a listener for the resize event.
		 */
		var resize_event_listener = function()
		{
			resize();
			draw();
		}
		if( params.responsive === true )
		{
			window.addEventListener('resize', resize_event_listener, false);
		}
		resize();
		draw();
		/**
		 *	Public methods
		 */
		this.next = function()
		{
			return next();
		}
		this.prev = function()
		{
			return prev();
		}
		this.goto = function( i )
		{
			return goto( i );
		}
		/**
		 *	next()
		 */
		function next()
		{
			if( bugout ) return index;
			src = canvas.toDataURL( "image/jpeg", params.compression );
			index++;
			if( index > images.length-1 )
			{
				index = 0;
			}
			glitchctl();
			return index;
		}
		/**
		 *	prev()
		 */
		function prev()
		{
			if( bugout ) return index;
			src = canvas.toDataURL( "image/jpeg", params.compression );
			index--;
			if( index < 0 )
			{
				index = images.length-1;
			}
			glitchctl();
			return index;
		}
		/**
		 *	goto()
		 */
		function goto( i )
		{
			if( bugout ) return index;
			src = canvas.toDataURL( "image/jpeg", params.compression );
			index = i;
			glitchctl();
			return index;
		}
		/**
		 *	glitchctl()
		 *
		 *	-
		 */
		function glitchctl()
		{
			if( bugout ) return;
			bugout = true;
			glitch();
		}
		/**
		 *	glitch()
		 *
		 *	-
		 */
		function glitch()
		{
			var destination = images[ index ];
			var data = canvas.toDataURL( "image/jpeg", params.compression );

			var chars = base64Map.join("");



			for( var i = 0; i <= params.depth; i++ )
			{
				var k = Math.floor( random_i( 30, data.length-1 ) );
				var char = chars.charAt( Math.floor( random_i( 0, chars.length-1 ) ) );
				data = replaceAt( data, k, char );

				if( i >= params.depth )
				{
					draw( data );

					setTimeout( function()
					{
						draw( src );
						setTimeout( function()
						{
							draw( destination );
							setTimeout( function()
							{
								if( cycle >= params.cycle )
								{
									draw( src );
									cycle = 0;
									bugout = false;
									return;
								}
								src = canvas.toDataURL( "image/jpeg", params.compression );
								glitch();
								cycle++;
							}, ( params.delay / 100) );
						}, ( params.delay / 10) );
					}, ( params.delay ) );
				}
			}
		}
		function replaceAt( string, i, char )
		{
			return string.substr( 0, i ) + char + string.substr( i + char.length );
		}
		function random_i( low, high )
		{
			return( ( high-low ) * Math.random() + 1 );
		}
		/**
		 *	resize()
		 *
		 *	- resize canvas
		 */
		function resize()
		{
			// canvas.width = wrapper.width();
			// canvas.height = wrapper.height();

			canvas.width = self.width();
			canvas.height = self.height();
		}
		/**
		 *	scale()
		 *
		 *	- scale image
		 */
		function scale( image, width, height )
		{
			var width_ratio = width / image.width
			var height_ratio = height / image.height
			var ratio = width_ratio > height_ratio ? width_ratio : height_ratio;
			return ratio;
		}
		/**
		 *	draw()
		 *	@param image data or url
		 *
		 *	- instantiate new Image() class
		 *	-
		 */
		function draw( data )
		{
			data = data ? data : images[ index ] ;
			var image = new Image();
			image.onload = function()
			{
				if( !image.complete )
				{
					draw( data );
				}
				else
				{
					try
					{
						// var ratio = scale( image, wrapper.width(), wrapper.height() );
						var ratio = scale( image, self.width(), self.height() );
						var width = image.width * ratio;
						var height = image.height * ratio;
						// var posx = ( canvas.width - width ) / 2;
						// var posy = ( canvas.height - height ) / 2;
						var posx = 0;
						var posy = 0;

						var posx = -Math.abs( ( width - self.width() ) / 2 );
						var posy = -Math.abs( ( height - self.height() ) / 2 );



						ctx.drawImage( image, posx, posy, width, height );
					}
					catch( error )
					{
						debug( error );
					}
				}
			}
			image.src = data;
		}
		/**
		 *	debug()
		 *	@param object
		 *
		 *	- JSON stringify object
		 *	- log to console
		 */
		function debug( obj )
		{
			if( window.console && window.console.log )
			{
				string = JSON.stringify( obj, null, 4 );
				// window.console.log( string );
			}
		}
		/**
		 *	Returns the element reference for chainability.
		 */
		return this;
	};
	/**
	 *	defaults[]
	 *
	 *	- array of default values
	 */
	$.fn.glitch.defaults = {
		canvas_attrs: {
			class:"",
			id:"",
		},
		canvas_css: {
			display:"block",
			width:"",
			height:"",
		},
		depth:5,
		cycle:3,
		delay:150,
		compression:0.8,
		responsive:true,
	};

}( jQuery ));
