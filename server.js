/*-----------------------------------------------
  Requirements:
-----------------------------------------------*/
var ws  = require( 'websocket-server' ),
	sys = require( 'sys' ),

	ud = require( './data/userdata' ),
	gt = require( './data/gameTable' );

/*-----------------------------------------------
  Main Server Code:

	Author:	Craig Sturdy
	Email:	craig <at> sturd <dot> co <dot> uk

-----------------------------------------------*/

const PORT = 1987;

var usrID = [];
GT = gt.newGameTable();

var server = ws.createServer( { /*debug: true,*/ storage: ud } );

server.addListener( "listening", function(){
	sys.log( "Node Websocket server.  Listening for clients on port " + PORT + "." );
});

// Handle WebSocket Requests
server.addListener( "connection", function( conn )
{
	//conn.storage.set("username", "user_"+conn.id);

	usrID[ usrID.length ] = conn.id;
	sys.log( "Connection established: " + conn.id );

	conn.storage = ud.newUser();

	GT.addPlayer( conn.id );

	conn.addListener("message", function( message ){

		/*server.manager.forEach( function( client )
		{
			client.storage.printParsed();
		} );*/

		// Kill-server
		if( message[ 0 ] == "Q" )
			process.exit();
		else
		{
			conn.storage.update( message );
			//conn.storage.printParsed();
			for( var i = 0; i < usrID.length; ++i )
			{
				if( usrID[ i ] != conn.id )
					server.manager.find( usrID[ i ], function( _conn )
					{ _conn.send( conn.storage.getData() ); } );
			}
		}

		// Kill GT reference
		if( message[ 0 ] == "k" )
		{
			var temp = "";
			for( var i = 1; i < message.length; ++i )
				temp += message[ i ];

			sys.log( temp );
			GT.delPlayer( temp );
		}
	} );
} );

server.addListener( "close", function( conn )
{
	GT.delPlayer( conn.id );
} );

server.listen( PORT );
