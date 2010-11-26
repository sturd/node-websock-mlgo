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
		cxt.translate( xPos + 16, yPos + 45 );
		cxt.rotate( cRot * ( Math.PI / 180 ) );
		cxt.translate( -( xPos + 16 ), -( yPos + 28 ) );
		cxt.fillRect( xPos, yPos, 32, 56 );
		cxt.translate( xPos + 16, yPos + 11 );
		cxt.rotate( wRot * ( Math.PI / 180 ) );
		cxt.translate( -( xPos + 16 ), -( yPos + 11 ) );
		cxt.strokeStyle = 'red';
		cxt.lineWidth = 3;
		cxt.beginPath();
		cxt.moveTo( xPos + 16, yPos + 11 );
		cxt.lineTo( xPos + 16, yPos - getTargetDist() );
		cxt.stroke();
		cxt.restore();

		if( getTargetDist() > whlDisp )
		{
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
		}

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
			xVel += 1.0;
		}

		else if( !key[ KEY_UP ] )
		{
			if( xVel > 0 )
				xVel -= 0.5;
		}
		getTargetAngle();
	}

	document.onkeydown = function( e )
	{
		key[ e.keyCode ] = true;
	}

	document.onkeyup = function( e )
	{
		key[ e.keyCode ] = false;
	}

	var getHyp = function()
	{
		return Math.sqrt( ( xVel * xVel ) + ( yVel * yVel ) );
	}

	var getTrnVector = function()
	{
		return getHyp() * 2;
	}

	var getTargetDist = function()
	{
		return whlDisp + getTrnVector();
	}

	var getTargetAngle = function()
	{
		if( cRot < cRot + wRot )
			cRot += 2.5;
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