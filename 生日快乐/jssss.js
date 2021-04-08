var moveX = 0; //X轴方向上移动的距离
			var moveY = 0; //Y轴方向上移动的距离
			var stepX = 4; //图片X轴移动的速度
			var stepY = 4; //图片Y轴移动的速度
			var directionX = 0;
			var directionY = 0;

			function changePos() {
				timer = setInterval(function() {
					var img = document.getElementById("float");
					var height = document.documentElement.clientHeight;
					var width = document.documentElement.clientWidth;
					var imgHeight = document.getElementById("floatImg").height;
					var imgWidth = document.getElementById("floatImg").width;
					//设置飘浮图片距离浏览器左侧位置
					var imgHeight = document.getElementById("floatImg0").height;
					var imgWidth = document.getElementById("floatImg0").width;

					//var imgHeight = document.getElementById("floatImg1").height; 
					var imgWidth = document.getElementById("floatImg1").width;

					img.style.left = parseInt(moveX + document.documentElement.scrollLeft) + "px";

					img.style.top = parseInt(moveY + document.documentElement.scrollTop) + "px";

					if(directionY == 0) {

						moveY += stepY;
					} else {

						moveY -= stepY;
					}
					if(moveY < 0) {

						directionY = 0;
						moveY = 0;
					}
					if(moveY > (height - imgHeight)) {

						directionY = 1;
						moveY = (height - imgHeight);
					}

					if(directionX == 0) {
						moveX += stepX;
					} else {
						moveX -= stepX;
					}
					if(moveX < 0) {

						directionX = 0;
						moveX = 0;
					}
					if(moveX > (width - imgWidth)) {

						directionX = 1;
						moveX = (width - imgWidth);
					}
				}, 30)

			}
			changePos();

			function clearPos1() {
				clearInterval(timer);
			}
window.requestAnimFrame = ( function() {
    return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function( callback ) {
                    window.setTimeout( callback, 1000 / 60 );
                };
})();

var canvas = document.getElementById( 'canvas' ),
        ctx = canvas.getContext( '2d' ),
    
        cw = window.innerWidth,
        ch = window.innerHeight,
  
        fireworks = [],
        
        particles = [],
   
        hue = 120,
        
        limiterTotal = 5,
        limiterTick = 0,
       
        timerTotal = 80,
        timerTick = 0,
        mousedown = false,
       
        mx,
       
        my;
        

canvas.width = cw;
canvas.height = ch;

function random( min, max ) {
    return Math.random() * ( max - min ) + min;
}


function calculateDistance( p1x, p1y, p2x, p2y ) {
    var xDistance = p1x - p2x,
            yDistance = p1y - p2y;
    return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

function Firework( sx, sy, tx, ty ) {

    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
  
    this.tx = tx;
    this.ty = ty;
 
    this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
    this.distanceTraveled = 0;
  
    this.coordinates = [];
    this.coordinateCount = 3;
    
    while( this.coordinateCount-- ) {
        this.coordinates.push( [ this.x, this.y ] );
    }
    this.angle = Math.atan2( ty - sy, tx - sx );
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random( 50, 70 );
   
    this.targetRadius = 1;
}

Firework.prototype.update = function( index ) {
    
    this.coordinates.pop();
    
    this.coordinates.unshift( [ this.x, this.y ] );
    
   
    if( this.targetRadius < 8 ) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }
    

    this.speed *= this.acceleration;
    var vx = Math.cos( this.angle ) * this.speed,
            vy = Math.sin( this.angle ) * this.speed;
   
    this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
    
    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
    if( this.distanceTraveled >= this.distanceToTarget ) {
        createParticles( this.tx, this.ty );
        // remove the firework, use the index passed into the update function to determine which to remove
        fireworks.splice( index, 1 );
    } else {
        // target not reached, keep traveling
        this.x += vx;
        this.y += vy;
    }
}

// draw firework
Firework.prototype.draw = function() {
    ctx.beginPath();
    // move to the last tracked coordinate in the set, then draw a line to the current x and y
    ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
    ctx.lineTo( this.x, this.y );
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();
    
    ctx.beginPath();
    
    ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
    ctx.stroke();
}

function Particle( x, y ) {
    this.x = x;
    this.y = y;
   
    this.coordinates = [];
    this.coordinateCount = 5;
    while( this.coordinateCount-- ) {
        this.coordinates.push( [ this.x, this.y ] );
    }
    // set a random angle in all possible directions, in radians
    this.angle = random( 0, Math.PI * 2 );
    this.speed = random( 1, 10 );
    // friction will slow the particle down
    this.friction = 0.95;
    // gravity will be applied and pull the particle down
    this.gravity = 1;
    // set the hue to a random number +-50 of the overall hue variable
    this.hue = random( hue - 50, hue + 50 );
    this.brightness = random( 50, 80 );
    this.alpha = 1;
    // set how fast the particle fades out
    this.decay = random( 0.015, 0.03 );
}

// update particle
Particle.prototype.update = function( index ) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift( [ this.x, this.y ] );
    // slow down the particle
    this.speed *= this.friction;
    // apply velocity
    this.x += Math.cos( this.angle ) * this.speed;
    this.y += Math.sin( this.angle ) * this.speed + this.gravity;
    // fade out the particle
    this.alpha -= this.decay;
    
    // remove the particle once the alpha is low enough, based on the passed in index
    if( this.alpha <= this.decay ) {
        particles.splice( index, 1 );
    }
}

// draw particle
Particle.prototype.draw = function() {
    ctx. beginPath();
    // move to the last tracked coordinates in the set, then draw a line to the current x and y
    ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
    ctx.lineTo( this.x, this.y );
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}

// create particle group/explosion
function createParticles( x, y ) {
    // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
    var particleCount = 30;
    while( particleCount-- ) {
        particles.push( new Particle( x, y ) );
    }
}

// main demo loop
function loop() {
    // this function will run endlessly with requestAnimationFrame
    requestAnimFrame( loop );
    
    // increase the hue to get different colored fireworks over time
    //hue += 0.5;
  
  // create random color
  hue= random(0, 360 );
    ctx.globalCompositeOperation = 'destination-out';
    // decrease the alpha property to create more prominent trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect( 0, 0, cw, ch );

    ctx.globalCompositeOperation = 'lighter';

    var i = fireworks.length;
    while( i-- ) {
        fireworks[ i ].draw();
        fireworks[ i ].update( i );
    }

    var i = particles.length;
    while( i-- ) {
        particles[ i ].draw();
        particles[ i ].update( i );
    }

    if( timerTick >= timerTotal ) {
        if( !mousedown ) {
            // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
            fireworks.push( new Firework( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
            timerTick = 0;
        }
    } else {
        timerTick++;
    }
    
    // limit the rate at which fireworks get launched when mouse is down
    if( limiterTick >= limiterTotal ) {
        if( mousedown ) {
            // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
            fireworks.push( new Firework( cw / 2, ch, mx, my ) );
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

// mouse event bindings
// update the mouse coordinates on mousemove
canvas.addEventListener( 'mousemove', function( e ) {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
});

// toggle mousedown state and prevent canvas from being selected
canvas.addEventListener( 'mousedown', function( e ) {
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener( 'mouseup', function( e ) {
    e.preventDefault();
    mousedown = false;
});

// once the window loads, we are ready for some fireworks!
window.onload = loop;