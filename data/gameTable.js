/*-----------------------------------------------
  Requirements:
-----------------------------------------------*/
var sys = require( 'sys' );

/*-----------------------------------------------
  Game Table Data:

	Author:	Craig Sturdy
	Email:	craig <at> sturd <dot> co <dot> uk

-----------------------------------------------*/

const MAX_PLYR = 3;

exports.gameTable = gameTable;
exports.newGameTable = function()
{
	return new gameTable();
};

function gameTable()
{
	var _count   = 0;
	var _gmSizes = [];
	var _tables  = [];

	_tables[ 0 ] = new Array( MAX_PLYR );
	_gmSizes[ 0 ] = 0;

	// Place newly connected player into
	// tables.
	this.addPlayer = function( id )
	{
		var y = x = 0;

		var space = false;

		// Scan through the tables for an available slot.
		for( var i = 0; i <= _count; ++i )
		{
			if( _gmSizes[ i ] < MAX_PLYR )
			{
				_tables[ i ][ _gmSizes[ i ] ] = id;
				y = i; x = _gmSizes[ i ];
				++_gmSizes[ i ];
				space = true;
				break;
			}
		}

		// If no space found, create a new table and
		// append connected user.
		if( !space )
		{
			++_count;
			_gmSizes[ _count ] = 0;
			_tables[ _count ] = new Array( MAX_PLYR );
			_tables[ _count ][ _gmSizes[ _count ] ] = id;
			y = i; x = _gmSizes[ i ];
			++_gmSizes[ _count ];
		}

		sys.log( "\nConnection established: " + _tables[ y ][ x ] +
				 "\nTable Location: Table: " + y + " |  Position: " + x );
	}

	this.delPlayer = function( id )
	{
		var found = false;
		var row = col = -1;

		// Find the player id within the tables
		for( var i = 0; i < _count; ++i )
		{
			for( var j = 0; j < _gmSizes[ i ]; ++j )
			{
				if( _tables[ i ][ j ] == id )
				{
					row = i; col = j;
					break;
				}
			}
			if( row != -1 && col != -1 )
				break;
		}
		// If the id has been located.  Delete the id reference
		// and re-sort the group if needed.
		if( row != -1 && col != -1 )
		{
			for( var i = col; i < _gmSizes[ row ]; ++i )
			{
				if( ( i + 1 ) < _gmSizes[ row ] )
					_tables[ row ][ i ] = _tables[ row ][ i + 1 ];
			}
			--_gmSizes[ row ];
		}
	}
}
