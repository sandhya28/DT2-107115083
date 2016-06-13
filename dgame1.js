var bonus = 0;
var frameindx = 0;
var frameindy = 0;
var noofframesx = 8;
var noofframesy = 1;
var press = 0;
var runner;
var background;
var obstacle = [];
var coin = [];
var gameend;
var gamemusic;
var gameover;
var myscore;
    gamemusic = new sound("gamemusic.mp3");
    gamemusic.play();
    gameover = new component("40px", "Comic Sans MS", "green", 260, 180, "text");
    function startgame() 
    {
        runner = new component(60, 70, "runnerimg.png", 50, 150, "image");
        background = new component(800, 400, "background1.jpg", 0, 0, "background");
        myscore = new component("30px", "Comic Sans MS", "black", 550, 40, "text");
        gameend = new sound("gameend.mp3");
        accelerate(1);
        $('#disp').hide();     
        gamearea.start();
    }

var gamearea = 
{
    canvas : document.createElement("canvas"),
    start : function() 
    {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.count = 0;
        this.setinterval();
        window.addEventListener('keydown', function (e) 
        {
            gamearea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) 
        {
            gamearea.key = false;
        })
    },
    
    setinterval : function()
    {
        this.interval = setInterval(updatearea, 25);
    },
    
    clear : function() 
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
   
    pause : function()
    {
        gameover.text="GAME PAUSED";
        gameover.update();
        clearInterval(this.interval);
    },
    
    stop : function() 
    {
        gameover.text="GAME OVER";
        gameover.update();
        clearInterval(this.interval);
        clearInterval(gamepause);
        setTimeout( function(){
        $("#instructions").hide();
        $('canvas').fadeTo(3000,0.4);
        $("#disp").fadeIn(3000);},1000);
    }   

}


function component(width, height, srce, x, y, type) 
{
    this.type = type;
    this.image = new Image();
    this.image.src = srce;
    this.width = width;
    this.height = height;
    this.speedx = 0;
    this.speedy = 0;    
    this.x = x;
    this.y = y;    
    this.gravity = 0;
    this. gravityspeed = 0;
    this.update = function() 
    {
        ctx = gamearea.context;
        if (type == "text") 
        {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = srce;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        if (type == "background") 
        {
            ctx.drawImage(this.image, 
                          this.x + this.width, 
                          this.y,
                          this.width, this.height);
        } 
        if(type=="image")
        {   
            ctx.clearRect(this.x,this.y,this.width,this.height);
            ctx.drawImage(this.image,
                          frameindx*864/noofframesx,
                          frameindy*122/noofframesy,
                          864/noofframesx,
                          122/noofframesy,
                          this.x,
                          this.y,
                          this.width,
                          this.height
                         );
            if(gamearea.count%8==0)
            {
                if(frameindx==7)
                {
                    frameindx=0;
                }
                else
                    frameindx++;
            }
        }
    }
    
    this.newpos = function() 
    {
        this.x += this.speedx;
        this.y += this.speedy+this.gravity;
        if (this.type == "background") 
        {
            if (this.x == -(this.width)) 
            {
                this.x = 0;
            }
        }

        if(this.type == "image")
        {     
            if(this.y>250)
            {
                this.y=250;
                accelerate(0);
            }
            
            else if(this.y<50)
            {
                this.y=50;
                accelerate(2);
            }
        }
            
    }

    this.collision = function(obs)
    {
        var runnerright=this.x+this.width;
        var runnerleft = this.x;
        var runnertop=this.y;
        var runnerbottom=this.y+this.height;
        var obsleft = obs.x;
        var obsright = obs.x+obs.width;
        var obsbottom= obs.y+obs.height;
        var obstop = obs.y;
        
        if(runnerbottom<obstop||runnertop>obsbottom||runnerright<obsleft||runnerleft>obsright)
            return false;
        return true;
    }
}

function updatearea() 
{
    gamearea.clear();
    background.speedx = -1;
    background.newpos();    
    background.update();
    gamearea.count++;
    if(gamearea.count%500==0)
        obstacle.push(new component(40,40,"coin.png",800,130,"coin"));
    else if(gamearea.count%750==0)
        obstacle.push(new component(40,40,"coin.png",800,110,"coin"));
    else if(gamearea.count%600==0)
        obstacle.push(new component(40,40,"coin.png",800,160,"coin"));
    if(gamearea.count%500==0)
        obstacle.push(new component(50,105,"obs2.jpg",800,240,"obstacle"));
    else if(gamearea.count%1400==0)
        obstacle.push(new component(60,60,"obs3.jpg",800,70,"obstaclecrow"));
    else if(gamearea.count%700==0)
        obstacle.push(new component(65,130,"obs4.png",800,215,"obstacle"));
       
    accelerate(2);
    
    if (gamearea.key && gamearea.key == 38) 
    {
        accelerate(-6); 
    }
    if (gamearea.key && gamearea.key == 40) 
    {
        accelerate(2);
    } 
    if (gamearea.key && gamearea.key == 39) 
    {
        fwdmove();
    }
    
    runner.newpos();    
    runner.update();
    
    myscore.text="SCORE: " + (gamearea.count+bonus*500);
    myscore.update();

    for (var i = 0; i < obstacle.length; i++) 
    {
        obstacle[i].x--;
    
        if(obstacle[i].type=="obstaclecrow")
            obstacle[i].x-=3;
    
        obstacle[i].update();
         
        if(runner.collision(obstacle[i]))
        {
            if(obstacle[i].type=="obstacle"||obstacle[i].type=="obstaclecrow")
            {  
                gamemusic.stop();
                gameend.play();
                gamearea.stop();
                break;
            }   
            else if(obstacle[i].type=="coin")
            {
                obstacle.splice(i,1);
                bonus++;
            }
        }
    }

}

function fwdmove()
{
    background.x--;
    gamearea.count++;

    for (var i = 0; i < obstacle.length; i++) 
    {
        obstacle[i].x--;
        obstacle[i].update();}
    }

function sound(src) 
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function()
    {
        this.sound.play();
    }
    this.stop = function()
    {
        this.sound.pause();
    }    
}

function accelerate(n)
{
     runner.gravity=n;
}

gamepause = setInterval(function()
{
    if(gamearea.key && gamearea.key == 32)
    {
        press++;
        if(press%2!=0)
        {
           gamearea.pause();
        }
        else
            gamearea.setinterval();
    }
},100);

var gameplay = setInterval(function()
    { 
        gamemusic.stop();
        gamemusic.play();
    },13000);

function newgame()
{
    history.go(0);
}