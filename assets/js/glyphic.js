/**
 *	glyphic.js
 *
 *	Replaces text in a DOM element one character at a time.
 *
 *	See also: http://codepen.io/anon/pen/GZXboQ?editors=1100
 */
(function( $ )
{
	/**
	 *	glyphic()
	 *	@param array options
	 *	@return this
	 *
	 *	- define plugin
	 *	- extend default settings with user specified options
	 *	- iterate over elements
	 */
	$.fn.glyphic = function( options ) {

		/**
		 *	Declare global variables.
		 */
		var interval = [];
		var select;
		var params;

		/**
		 *	Stores an alphanumeric string of the selector to reference
		 *	within the interval array.
		 */
		// select = $( this ).selector.replace(/\W/g,'');
		// unique id
		select = Math.floor(Math.random() * 26) + Date.now();

		/**
		 *	Clears the interval(s) for the selector.
		 */
		if( interval && interval[ select ] && interval[ select ].length > 0 )
		{
			for( var i = 0; i < interval[ select ].length; i++ )
			{
				window.clearInterval( interval[ select ][ i ] );
			}
		}
		/**
		 *	The $.extend() method recurses through all nested
		 *	objects to give us a merged version of both the defaults
		 *	and the passed options, giving the passed options precedence.
		 */
		params = $.extend( true, {}, $.fn.glyphic.defaults, options );
		/**
		 *	Loop through the elements.
		 */
		this.each(function()
		{
			/**
			 *	Store the element reference for use within
			 *	the anonymous interval callback.
			 */
			var element = $( this );
			/**
			 *	Get the element's original text.
			 */
			var orig = $( this ).text().split('');
			/**
			 *	Get the element's destination text.
			 */
			var dest = params.input.split('');
			/**
			 *	Set number of cycles to whichever string is longest.
			 */
			var repeat = ( orig.length >= dest.length ) ? orig.length : dest.length ;
			/**
			 *	Sort the order of characters to replace according to mode.
			 */
			var order = sortorder( repeat );
			/**
			 *	Set an interval to loop through the order array one position
			 *	at a time, replacing the original text with the destination text.
			 */
			var index = 0;
			setinterval( function()
			{
				var position;
				/**
				 *	The .shift() method removes the first element from
				 *	an array and returns that element. This method
				 *	changes the length of the array.
				 *
				 *	Note: the assignment operator '=' rather than the
				 *	equality test '=='. This sets the value of position
				 *	to order.shift() and fails the 'if' test when the
				 *	array is null.
				 */
				if( position = order.shift() )
				{
					position = position-1;
					if( !dest[ position ] )
					{
						orig[ position ] = "";
					}
					else
					{
						orig[ position ] = dest[ position ];
					}
				}
				/**
				 *	Update the element.
				 */
				element.text( orig.join('') );
				/**
				 *	Increment the loop index.
				 */
				index++;
				/**
				 *	On complete & callback
				 */
				if( index == repeat && index > 1 )
				{
					// make sure the callback is a function
					if( params.callback && typeof params.callback == 'function')
					{
						// pass scope to the callback
						params.callback.call();
					}
				}
			}, params.delay, repeat+1 );
		});

		/**
		 *	sortorder()
		 *	@param int
		 *	@return array
		 *
		 *	- returns an array sorted according to mode
		 */
		function sortorder( repeat )
		{
			var array = [];
			for( var i = 0; i < repeat; i++ )
			{
				array[i] = i+1;
			}
			switch( params.mode )
			{
				case 'reverse':
					array = array.reverse();
					break;
				case 'random':
					array = shuffle( array );
					break;
				default:
					break;
			}
			return array;
		}
		/**
		 *	shuffle()
		 *	@param array
		 *	@return array
		 *
		 *	- Fisher-Yates shuffle algorithm
		 *	- returns a pseudo-randomly shuffled array
		 */
		function shuffle( array )
		{
			var i = array.length;
			if ( i == 0 ) return false;
			while ( --i )
			{
				var j = Math.floor( Math.random() * ( i + 1 ) );
				var tempi = array[i];
				var tempj = array[j];
				array[i] = tempj;
				array[j] = tempi;
			}
			return array;
		}
		/**
		 *	setinterval()
		 *	@param function
		 *	@param int
		 *	@param int
		 *
		 *	- sets a callback function to repeat as a global interval
		 *	-
		 */
		function setinterval( callback, delay, repetitions )
		{
			/**
			 *	Create an associative array to store the loop indices
			 *	for each selector individually, and set to zero.
			 */
			var counter = [];
			counter[ select ] = 0;
			/**
			 *	Initialise an empty array associated with the selector
			 *	within the interval array.
			 */
			interval[ select ] = [];
			/**
			 *	Push a null value to the select array. Returns the
			 *	new array length.
			 */
			var y = interval[ select ].push( null );
			/**
			 *	Decrement y to give us our array index.
			 */
			if( y > 0 ) y--;
			/**
			 *	Create an interval at new position 'y' in the select array
			 *	of the interval array. The interval function executes 'callback',
			 *	increments the loop counter, checks to see if the loop index
			 *	has reached the 'repetitions' limit, and clears the interval.
			 */
			interval[ select ][ y ] = window.setInterval(function(){
				callback();
				counter[ select ]++;
				if( counter[ select ] == repetitions )
				{
					window.clearInterval( interval[ select ][ y ] );
				}
			}, delay);
		};
		/**
		 *	debug()
		 *	@param object obj
		 *
		 *	- JSON stringify object
		 *	- log to console
		 */
		function debug( obj )
		{
			if( window.console && window.console.log )
			{
				string = JSON.stringify( obj, null, 4 );
				window.console.log( string );
			}
			return;
		}

		/**
		 *	Returns the jQuery reference for chainability.
		 */
		return this;
	}

	/**
	 *	defaults[]
	 *
	 *	- array of default values
	 */
	$.fn.glyphic.defaults = {
		input:'',
		delay:100,
		mode:'',
		callback:'',
	};

}( jQuery ));
