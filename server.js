/*-----------------------------------------------
  Requirements:
-----------------------------------------------*/
var ws  = require( 'websocket-server' ),
	sys = require( 'sys' ),

	ud = require( './data/userData' ),
	gt = require( './data/gameTable' );

/*-----------------------------------------------
  Main Server Code:

	Author:	Craig Sturdy
	Email:	craig <at> sturd <dot> co <dot> uk

-----------------------------------------------*/

const PORT = 1987;

var usrID = [];
table = gt.gameTable();

var server = ws.createServer( { /*debug: true,*/ storage: true } );

server.addListener( "listening", function(){
	sys.log( "Node Websocket server.  Listening for clients on port " + PORT + "." );
});

// Handle WebSocket Requests
server.addListener( "connection", function( conn )
{
	//conn.storage.set("username", "user_"+conn.id);

	usrID[ usrID.length ] = conn.id;

	conn.storage = ud.newUser();

	var loc = gt.tableLocator( 0, 0 );
	loc = table.addPlayer( conn.id );
	conn.storage.setTable( loc.table );

	/*sys.log( "Connection established: " + conn.id +
			 "\nTable:\t" + loc.table + 
			 "\nSlot:\t"  + loc.slot + "\n" );*/

	conn.addListener("message", function( message ){

		// Kill-server
		if( message[ 0 ] == "Q" )
			process.exit();
		else
		{
			conn.storage.update( message );
			//conn.storage.printParsed();
			
		}

		// Kill table reference
		if( message[ 0 ] == "k" )
		{
			var temp = "";
			for( var i = 1; i < message.length; ++i )
				temp += message[ i ];

			sys.log( temp );
			table.delPlayer( temp );
		}
	} );
} );

server.addListener( "close", function( conn )
{
	table.delPlayer( conn.id );
} );

server.listen( PORT );
