 var debug = true,
        looping = true,
        updating = true,
        drawing = true,
        clearing = true,
        canvas, ctx, w, h,
        int_w, 
        DATE = 0,
        CLOSE = 1,
        HIGH = 2,
        LOW = 3,
        OPEN = 4,
        VOLUME = 5,
        index = 0,
        frame = 0,
        break_frame = 5, 
        
        //shares = 113.78 * 1000000, 
        shares = 	328.59 * 1000000, 
        old_cap = shares * stock_slice[0][1];
        
function l(s) {

    if (debug)
        console.log(s);

}
  
function init() {

    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    h = canvas.height;
    w = canvas.width;
    
    int_w = w / stock_slice.length;
    
    ctx = canvas.getContext("2d");
    
}

init();

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function animloop(){
  requestAnimFrame(animloop);
  loop();
})();

function loop() {
    
    if (looping) {
        
        if (frame == break_frame) {

            if (clearing)    
                    clear();            
                
            if (updating)
                update();
                
             if (drawing)
                draw();         
                
             frame = 0;
            
        }
        
        frame++;

    }
    
}

function drawRect(x, y, w, h) {
    
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    //ctx.fillStyle = 'yellow';
    ctx.fill();
    //ctx.lineWidth = 7;
    //ctx.strokeStyle = 'black';
    //ctx.stroke();    

}

function clear() {
    
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    ctx.restore();    
    
}

Number.prototype.formatMoney = function(c, d, t){
var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
 

function update() {   

    ctx.fillStyle = "rgba(255, 255, 0, 0.7)";

    var slice = stock_slice[index];
    var top = (slice[VOLUME] - vol_min) / (vol_max - vol_min);        

    drawRect(index*int_w, h - h / 2 * top, 10, h / 2 * top);
     
    index++
    
    if (index >= stock_slice.length) {
        
        //l('Clear');
        index = 0;
       
    }

}

function draw() {
    
    ctx.fillStyle = "rgba(0, 255, 255, 0.5)";

    var slice = stock_slice[index];
    var top = (slice[CLOSE] - stock_min) / (stock_max - stock_min);    
    
    drawRect(index*int_w,  h - h /2 - h / 2 * top, 10, h / 2  * top);
    
    var v_traded = slice[VOLUME] * slice[CLOSE];   
    var mkt_cap = shares * slice[CLOSE];
    
    var change = mkt_cap - old_cap;
    old_cap = mkt_cap;
    
    ctx.fillStyle = "white";
    drawRect(h/2 + 756, h / 2 - 270, 2300, 600);
    
    ctx.fillStyle = "red";
    ctx.font = "bold 128px Arial";
    ctx.fillText("Value traded: " + Math.round(v_traded).formatMoney(2, '.', ','), w/2 - 1024, h/2 - 128);
    ctx.fillText("Market cap: " + Math.round(mkt_cap).formatMoney(2, '.', ','), w/2 - 1024, h/2 );
    ctx.fillText("Change in cap: " + Math.round(change).formatMoney(2, '.', ','), w/2 - 1024, h/2 + 128);
    ctx.fillText("Leveraged change in cap: " + Math.round(change / v_traded).formatMoney(2, '.', ',') + "x", w/2 - 1024, h/2 + 256);    
    
}