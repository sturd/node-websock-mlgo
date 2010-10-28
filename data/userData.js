/*-----------------------------------------------
  Requirements:
-----------------------------------------------*/
var sys = require( 'sys' );

/*-----------------------------------------------
  User data:

	Author:	Craig Sturdy
	Email:	craig <at> sturd <dot> co <dot> uk

-----------------------------------------------*/
exports.userData = userData;
exports.newUser = function()
{
	return new userData();
};

var userData = function()
{
	// ID now attached to connection.storage

	//var _id    = id;	// socket descriptor used as user id
	var _table = 0;		// Table number to allow quick location of user opponents
	var _slot = 0;
	var _scrNm = "";	// user screen name. visible user name
	var _data  = "";	// current player data.  held un-parsed

	// Function to update stored user data
	// for multiplay broadcast.
	this.update = function( data )
	{
		// Data is user data for broadcast.  Store without parsing.
		if( data[ 0 ] == 'x' )
			_data = data;

		if( data[ 0 ] == 'n' )
		{
			// Data requesting change of screen name.
			// Take remaining characters in string as name.
			_scrNm = "";
			for( var i = 1; i < data.length; ++i )
				_scrNm += data[ i ];
		}
	}

	this.setTable = function( table )
	{	   _table = table;		}
	this.setSlot  = function( slot )
	{      _slot = slot;		}

	this.getTable = function()
	{
		return _table;
	}

	// Debug function to print parsed data 
	// to the console on the server side.
	this.printParsed = function()
	{
		var temp = "";
		var xPos = yPos = rot = xVel = yVel = 0;

		var parseVal = function()
		{
			var val = parseInt( temp );
			temp = "";
			return val;
		}

		for( var i = 1; i < _data.length; ++i )
		{
			if( _data[ i ] == 'y' )
				xPos = parseVal();
			else if( _data[ i ] == 'r' )
				yPos = parseVal();
			else if( _data[ i ] == 'i' )
				rot = parseVal();
			else if( _data[ i ] == 'j' )
				xVel = parseVal();
			else
				temp += _data[ i ];


			if( i == _data.length - 1 )
				yVel = parseInt( temp );

		}
		sys.log( "\nScNm:\t" + _scrNm +
			 	 "\nX:\t"    + xPos   + 
			     "\nY:\t"    + yPos   +
			 	 "\nRot:\t"  + rot    +
			 	 "\nxVel:\t" + xVel   +
			 	 "\nyVel:\t" + yVel     );
	}

	// Function to allow access to user data for broadcast
	// to opponents
	this.getData = function()
	{
		return _data;
	}
}
