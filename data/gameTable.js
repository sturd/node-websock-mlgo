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


exports.tableLocator = function( table, slot )
{
	return new tableLocator( table, slot );
}

function tableLocator( table, slot )
{
	this.table = table;
	this.slot  = slot;
}

exports.gameTable = function()
{
	return new gameTable();
};

function gameTable()
{
	var _count   = -1;
	var _gmSizes = [];
	var _tables  = [];

	var addTable = function()
	{
		++_count;
		_gmSizes[ _count ] = 0;
		_tables[ _count ] = new Array( MAX_PLYR );

		for( var i = 0; i < MAX_PLYR; ++i )
			_tables[ _count ][ i ] = '';
	}

	// Place newly connected player into
	// tables.
	this.addPlayer = function( id )
	{
		var tbl = slt = 0;
		var space = false;

		// Scan through the tables for an available slot.
		for( var i = 0; i <= _count; ++i )
		{
			if( _gmSizes[ i ] < MAX_PLYR )
				for( var j = 0; j < MAX_PLYR; ++j )
					if( _tables[ i ][ j ] == '' )
					{
						_tables[ i ][ j ] = id;
						tbl = i; slt = j;
						++_gmSizes[ i ];
						space = true;
						break;
					}
			if( space )
				break;
		}

		// If no space found, create a new table and
		// append connected user.
		if( !space )
		{
			addTable();
			_tables[ _count ][ _gmSizes[ _count ] ] = id;
			tbl = i; slt = _gmSizes[ _count ];
			++_gmSizes[ _count ];
		}
		return new tableLocator( tbl, slt );
	}

	this.delPlayer = function( id )
	{
		var found = false;
		var tbl = slt = -1;

		// Find the player id within the tables
		for( var i = 0; i < _count; ++i )
		{
			for( var j = 0; j < _gmSizes[ i ]; ++j )
				if( _tables[ i ][ j ] == id )
				{
					tbl = i; slt = j;
					_tables[ i ][ j ] = '';
					--_gmSizes[ i ];
					break;
				}
			if( tbl != -1 && slt != -1 )
				break;
		}
	}
}
