/**
 * @author Josh Gibbs - uPaymeiFixit@gmail.com
 *
 * Requires:
 *	hsvToRgb.js
 *	requestAnimationFrame.js
 *	stats.js
 */

/** Constants */
defaults=
{
RADIUSMIN: 20,
RADIUSMAX: 200,
 SPEEDMIN: 100,
 SPEEDMAX: 200,
 QUANTITY: 5,
     BLUR: 100,
      MAX: 20
  };


/** SETUP */

// Setup that needs to be done on resize
onresize = ctxSetup;
function ctxSetup() {
	_WIDTH = innerWidth;
	_HEIGHT = innerHeight;
	ctx.canvas.width = _WIDTH;
	ctx.canvas.height = _HEIGHT;
	ctx.shadowBlur = defaults.BLUR;
	ctx.shadowOffsetX = _WIDTH + defaults.RADIUSMAX;
}

onload = function() {
	// Canvas setup
	ctx = document.createElement( "canvas" ).getContext( "2d" );
	ctx.canvas.innerHTML = "Your browser does not fully support HTML5";
	ctxSetup();
	document.body.appendChild( ctx.canvas );

	// Stats setup
	// stats = new Stats();
	// stats.setMode( 0 );
	// document.body.appendChild( stats.domElement );
	// document.getElementById("stats").style.position = "absolute";
	// document.getElementById("stats").style.top = "0px";

	// Setup for objects
	circle = [];
	while ( circle.push( new Circle(null,null,true) ) < defaults.QUANTITY ) {}
	loop();


	/** INPUT */

	// Event listeners for mouse and touch inputs
	ctx.canvas.addEventListener( "mousedown", function( event ){
		mouseX = event.pageX;
		mouseY = event.pageY;
		mouseDown();
	}, false);
	ctx.canvas.addEventListener( "mousemove", function( event ){
		mouseX = event.pageX;
		mouseY = event.pageY;
	}, false);
	ctx.canvas.addEventListener( "mouseup", function(){
		clearInterval( timer );
	}, false);
	ctx.canvas.addEventListener( "contextmenu", function( event ){
		event.preventDefault();
	}, false);
	ctx.canvas.addEventListener("touchstart", function(){
		mouseX = event.targetTouches[0].pageX;
		mouseY = event.targetTouches[0].pageY;
		mouseDown();
	}, false);
	ctx.canvas.addEventListener("touchmove", function(){
		mouseX = event.targetTouches[0].pageX;
		mouseY = event.targetTouches[0].pageY;
	}, true);
	ctx.canvas.addEventListener("touchend", function(){
		clearInterval( timer );
	}, false);
	document.body.addEventListener("touchcancel", function(){
		clearInterval( timer );
	}, false);
	document.ontouchmove = function( event ){ event.preventDefault(); };

};


/** HELPERS */

// Creates circles on user input
function mouseDown() {
	var pushed = 0;
	if ( !event.button ) {
		timer = setInterval(function() {
			var x = Math.cos( pushed / 5 ) * (50 + pushed);
			var y = Math.sin( pushed / 5 ) * (50 + pushed++);
			circle.push( new Circle( x + mouseX, y + mouseY ) );
			if ( circle.length > defaults.MAX ) {
				circle.shift();
			}
		},100);
	} else {
		timer = setInterval(function(){
			circle.sort(function(a,b){
				return distance(mouseX,mouseY,a.position.x,a.position.y) - distance(mouseX,mouseY,b.position.x,b.position.y);
			});
			circle.shift();
		},100);
	}
}

// Circle constructor
function Circle( x, y, r ) {
	this.radius = Math.random() * ( defaults.RADIUSMAX - defaults.RADIUSMIN ) + defaults.RADIUSMIN;
	this.position ={x: x || Math.random() * ( _WIDTH - this.radius * 2 ) + this.radius,
					y: y || Math.random() * ( _HEIGHT - this.radius * 2 ) + this.radius};
	this.color = hsvToRgb( Math.random(), 1, 1);
	this.alpha = 0;

	this.limit = map(this.radius, defaults.RADIUSMIN, defaults.RADIUSMAX, defaults.SPEEDMIN, defaults.SPEEDMAX);

	this.time = r ? Math.random() * (this.limit / 6) : 0;
}

// Math utils
function map(x, in_min, in_max, out_min, out_max) {
	return (x - in_min) * (out_max - out_min) / ( ( in_max - in_min) || 1 ) + out_min;
}
function distance(x1,y1,x2,y2) {
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}


/** LOOPS */

// Animation loop
function loop() {
	requestAnimationFrame( loop );
	// stats.begin();
	ctx.clearRect(0,0,_WIDTH,_HEIGHT);
	for ( var i = 0; i < circle.length; i++ ) {
		circle[i] = fade( circle[i] );
		circle[i].render();
	}
	// stats.end();
}

// Fade math
function fade( circle ) {
	if ( circle.time > circle.limit ) {
		return new Circle();
	}

	var t = ( circle.time ) / circle.limit;
	circle.alpha = -((2*t-1)*(2*t-1))+1;

	circle.time ++;
	return circle;
}

// Render function
Circle.prototype.render = function() {
	ctx.shadowColor = "rgb(" + this.color + ")";
	ctx.fillStyle = "rgba(0,0,0," + this.alpha + ")";

	ctx.beginPath();
	ctx.arc( this.position.x - _WIDTH - defaults.RADIUSMAX, this.position.y, this.radius, 0, 6.28 );
	ctx.fill();
};
