var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var key = [];

function Car( x, y, cxt )
{
	var cxt = cnvCxt;

	var xPos = x;
	var yPos = y;
	var accl = 1.0;
	var xVel = 0;
	var yVel = 0;
	var cRot = 90;
	var wRot = 0;

	var whlDisp = 25;

	this.draw = function()
	{
		cxt.save();
			// Translate car body around middle
			// of rear axel
			cxt.translate( xPos + 16, yPos + 45 );
				cxt.rotate( cRot * ( Math.PI / 180 ) );
			cxt.translate( -( xPos + 16 ), -( yPos + 28 ) );

			// TODO: Replace rectangle with pixmap
			cxt.fillRect( xPos, yPos, 32, 56 );


			// Steering visualisation (debug)***********************************
			// Steering calculated around middle of
			// front axel
			cxt.translate( xPos + 16, yPos + 11 );
				cxt.rotate( wRot * ( Math.PI / 180 ) );
			cxt.translate( -( xPos + 16 ), -( yPos + 11 ) );

			if( key[ KEY_UP ] )
				cxt.strokeStyle = 'red';

			else
				cxt.strokeStyle = 'green';

			cxt.lineWidth = 3;

			cxt.beginPath();
				cxt.moveTo( xPos + 16, yPos + 11 );
				cxt.lineTo( xPos + 16, yPos - getTargetDist() );
			cxt.stroke();
			//******************************************************************
		cxt.restore();

		//if( getTargetDist() > whlDisp )
		//{
			if( key[ KEY_LEFT ] )
			{
				// Steer left
				if( wRot > -45 )
					wRot -= 5;
			}
			else if( key[ KEY_RIGHT ] )
			{
				// Steer right 
				if( wRot < 45 )
					wRot += 5;
			}
		//}

		// Power steering effect
		if( !key[ KEY_LEFT ] && !key[ KEY_RIGHT ] )
		{
			if( wRot > 0 )
				wRot -= 2.5;

				else if( wRot < 0 )
					wRot += 2.5;
		}

		if( key[ KEY_UP ] )
		{
			xVel += 0.5 * Math.sin( cRot * ( Math.PI / 180 ) );
			yVel -= 0.5 * Math.cos( cRot * ( Math.PI / 180 ) );
		}

		else if( !key[ KEY_UP ] )
		{
			if( xVel > 0 && yVel > 0 )
			{
				xVel += correctX( false );
				yVel += correctY( false );
			}
			else if( xVel > 0 && yVel < 0 )
			{
				xVel += correctX( false );
				yVel += correctY( true  );
			}
			else if( xVel < 0 && yVel > 0 )
			{
				xVel += correctX( true  );
				yVel += correctY( false );
			}
			else if( xVel < 0 && yVel < 0 )
			{
				xVel += correctX( true  );
				yVel += correctY( true  );
			}

		}
		if( cRot > getTargetAngle() + cRot )
			cRot -= 3;

			else if( cRot < getTargetAngle() + cRot )
				cRot += 3;

		xPos += xVel;
		yPos += yVel;
	}

	document.onkeydown = function( e )
	{
		key[ e.keyCode ] = true;
	}

	document.onkeyup = function( e )
	{
		key[ e.keyCode ] = false;
	}

	// Acquire angular velocity
	var getAngVel = function()
	{
		return Math.sqrt( ( xVel * xVel ) + ( yVel * yVel ) );
	}

	var getTrnVector = function()
	{
		return getAngVel() * 2;
	}

	var getTargetDist = function()
	{
		return whlDisp + getTrnVector();
	}

	var getTargetAngle = function()
	{
		if( wRot != 0 )
		{
			var innerL = 0;
			// Acquire inner angle from wheel rotation
			//if( wRot < 0 )
				innerL = 180 - wRot;
			//else if( wRot > 0 )
			//	innerL = 180 - wRot;

			var Hyp = Math.sqrt( ( sqr( 34 ) + sqr( getTargetDist() ) ) -
								 ( 2 * 34 * getTargetDist() * Math.cos( ( Math.PI / 180 ) * innerL ) ) );

			return Math.asin( 
				( getTargetDist() * Math.sin( 
									( Math.PI / 180  ) * innerL ) ) / Hyp );
		}
		return 0;
	}

	var xAccel = function()
	{
		return ( xVel / 8 ) * Math.sin( cRot * ( Math.PI / 180 ) );
	}

	var yAccel = function()
	{
		return ( yVel / 8 ) * Math.cos( cRot * ( Math.PI / 180 ) );
	}

	var correctX = function( negative )
	{
		if( negative )
		{
			if( xAccel() < 0 )
				return -xAccel();
				
				else if( xAccel() > 0 )
					return xAccel();
			else
				return 0;
		}
		else
		{
			if( xAccel() > 0 )
				return -xAccel();

				else if( xAccel() < 0 )
					return xAccel();
			else
				return 0;
		}
	}
	var correctY = function( negative )
	{
		if( negative )
		{
			if( yAccel() < 0 )
				return -yAccel();

				else if( yAccel() > 0 )
					return yAccel();
			else
				return 0;			
		}
		else
		{
			if( yAccel() > 0 )
				return -yAccel();

				else if( yAccel() < 0 )
					return yAccel();
			else
				return 0;
		}
	}

	this.getAngle = function()
	{
		return cRot;
	}
	this.getXPos = function()
	{
		return xPos;
	}
	this.getYPos = function()
	{
		return yPos;
	}

	this.getPlyrData = function()
	{
		// Function to construct player data for socket transmission
		return "x" + xPos + "y" + yPos +
			   "r" + cRot + "i" + xVel + 
			   "j" + yVel;
	}
}
