var spaceout = (function() {        
    var win = window,
        doc = document,

        ctx = doc.getElementById('game').getContext('2d'),
        sfCtx = doc.getElementById('starfield').getContext('2d'),
        screens = doc.getElementById('director').childNodes,

        starsRunning = false,
        gameRunning = false, 
        currentLevel = 0,
        paused = false,
        canPause = false,
        canPost = false,
        lives = 3,
        score = 0,
        audio = true,

        w = 518, 
        h = 346,

        left = false, 
        right = false,
        space = false,
        
		images = {
			brick : 'data:image/png;base64,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',
			ball : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA8klEQVQoz5VSsQ3CMBB0xQQIRkCUpMgGaTMPO1BCaSlLZIY0NIgJUHpQaKIg4Ry+yB8ei0hg6aTkfXc+v9/MdxejkHtUHlBoPUqPTHPlY+ZRRIJvsIE7Cu0PIkEhwkxvLA811uc7kluHzbXD6thgsa9jcW5C/qFAQtI8kLonco80gDUaKmFlwuWHAt1J3PYODsAJ/fDNGlPoU43+YTSSKJBFA57O6JNCbpLk8F40oRlNJ4WMI1EpoIFE5TX02xr94GyANEc3iLWos6VMC3Rn6c5ojM4UUUeJTAag+GMAbDxy9sep+Rg5QRYGoo0EVbjSyH0ByhPw9CsnthIAAAAASUVORK5CYII=',
			paddle : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAOCAYAAAC1i+ttAAACNUlEQVRYw+2YzUtUYRTGXydzRtNUtNCEzEXhQgj6GGhcKEI4C2mRRTh/QCsX/QmBS6VFCzEC3RpEm4Q2jTMyWrhQAgWRNlkaOAOihOPHnTuP57nz3ro6Xs316+IHd95z5y5+HA7PeVX94A8l9AtZAUI6WXIBmfZOpALl2OzqxkcVcJ5ZM5lEqDb/Xlz86e7B11A1ft+LIC6upBYXcsKsEKVTpR/gxXr8DFbHQ1jBaqC0EqsXq1yxRjNZVoPv4iOnsSKd2OntO/oeBYcpdpwHV16t4GZqA7fXsr5iWTOZRHmx2N0nfWj5lEHDyC+v3GGKneCP1vlNhO2cg59Yt24qyYraYrFPY07t/r6F6x/WXbETjtirr38inCv8OWbbvmJZM5mpE8SSO1t7qB/yiL02uvZX6lYejsSFxhuO4MWmFsRViXPGmslMi9jPSmGurgG7j3qx1HwL08HLeJfPI6LlNr5d9YgdK4h9Iy9sywco1JsK0g86nGfWTOZLZR1W2u4eSgWWzFjWXkpT0iFdFollcfuEjs3YMJoZn46lMzZlkVi2Lw/Zzmxrvxn7QsSbTOqYGbsvM5ZjIuZ27KhHLAcuB+9pqeCStWc0fqnAlcoAwCDwT6xEBEYFRoZzsWcX6zYkI6s3bg27wZYhl2HXT2zpwLLRJELHLwhcHrhcccnSLscpNqzXsFNX2kDPjNH850pLokpfwkT1BQIFx/0uYSqef9swmWSwxj56CTNZuIRJa6FZfaGlDgC1uGnWrk4IlgAAAABJRU5ErkJggg==',
			paddleInvert : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAOCAYAAAC1i+ttAAACM0lEQVRYw+2YvUtbYRTGb5KrtiKKkAr1c5EitCB1kFZDE3XJ4CKFzgpiFx2kHQv9E9wE/4BIUDsUHUQIOjRCbAuFDmIH24JVGiVqrUn8SJ6e5+a99mq82s6vww9u3nNzhx+Hw3NeY/tlkyEMC2kBQjKYP4X/3SICuTSqYvPoRc56Zk1nQplU/qm4qJifxaPMHu6+j6NbXEktJpwKCSFMp4Z6gBPzTRTm0gLM7B6MkwPUHf+yxWpN19EumsWHT2HGF3FrZvLiexTcTrFRHiRHG/ElUI1PtbddxbKmM6F0sdiy6Umsh/3Yel7vlDtOsXP8sfqwCgmvz8JNrF3XleBhqljsVMSqrZSY+N5XY4uds8T+HGlAwlf4c8TrdRXLms48uUIs+VhZiu0XDrE/BmrPpFZ6DEvig82vluD7G+voRt46Y01nOkVsD4C2nS2UvZ1By7c1dGb38czjQVzJ3Rysc4jtL4gdkhfK5QMU6kwFd5aXrGfWdObxwQ4aP384lwpMmbGsvZampEO6LBLLYvkVHev3GlrT4dKxdMamLBLL9uUh25lt7TZjx0S8zgQumbElMmM5JiJ2xw44xHLgcvBelwp+m6Va45YKbKkMAAwCf8VKRGBUYGS4Efv/Yu2GZGR1xq1xO9gy5DLsuok9eXVPa0KZyxcELg9crrhkKZdRim1Xa9i1K21utkNr/nGlJWFDXcKE1QUCBcfcLmEOJ1pTOhPM7uYuXsJ0FS5hkkpoWl1oGX8A5bbO/P70qYwAAAAASUVORK5CYII=',
			powerup : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAC40lEQVQ4T5WVbUhTURjHj6up5Wwp6710JS7f8mVLTayYlZkRiERvkNViSKFTo6ypSGxFZVKQKQYRMhA/WR9CyOiL0Hq1nGyZ016mYVG2xK0varp/557Na6nZ9uF373PO8/z/PPeec+8h0BCSJLUQeocvuDR+GCsQ8mPmARCCswz4wveiJajNLoJqowFjZ4RTOWZ4kQY+MFi+FOWZVZCvMXNdQbWJmuqFfJ6glgY+ULdPgwx/I5LFnUgKt7hN06npDSHLEzTRQi+w1UhRllOFFIkJcclvIWkchGKFu0uOHEULqyN4SAVecPWYFilBnYhN70bw0x9UOIF16o/MLE3WDvXOBlZH0EEFczDQugrVBeeQFdKGRNkbhN61U9E4hF+ckBbamGFBbj2G2kJYPUE/Ff6DYYsYFflXIF9tRswOK4JeDLHORM8diMrqYe8xP/cOTC1JmLAJmIaqqHgWRr4FoE6nQaaYdrbegsUP3I8Z2ONAdKYVaeQ1KtWXMErr/tQR/KLBNPrfh6P05DUoVtLONndD/IiauSawoNuByL29kIdZkJfThC5T7AwtvRJuP/7Fdf1ppApN2EBXM9jo7kz0yoE4uiDbgozQFevxqS9sho6Dvl8aeLD1SqEr1UEpMSI+rguh9zwL8NkJ2f53UCw348Sh2/g6sIzXTIfASQPKqN0f50suIGmtBdHbrRC95DobR/ATB2KUVqSL2lFypAZmYzwmhgVMMxt0X/jBbpbgZmUxlAmPkRhhgbjVbRZgcyJqdw9S53egLK8aIx8CwdXPBYHFD+o9DfyO5zokrnEs7HBAltPLFuZodiPMzQngav8HQZsfmioOTxlSIlQ2xGyxYqvwGfQHdLDfl4Cr8waCZhpQDIUq3jAl0MQ+/OMZBvTVS1neWwhu0cCDQeU2TYtsR/muKnTrovmctxBcFnBgEsNBFU4pa/BTt4if8xr2g9UK3EeAlk546FTL4dLO48feMHkE/AbGiv8eXGQH0QAAAABJRU5ErkJggg==',
			laser : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAGCAMAAAAxO9Q+AAAABlBMVEX///9a/f1W92lJAAAADElEQVQI12NgZMAKAQCoAA2h+hhnAAAAAElFTkSuQmCC'
		},

        level,
        brick, 
        ball, 
        paddle, 
        powerup,    

        lasers = [],     
        hasLasers = false,
        maxLasers = 10,
        lastShot = 0,
        fireRate = 300,
        timer = function() {
            return +new Date();
        };
        
    var starfield = {
        settings : {
            maxStars : 180,
            hfov : 100 * Math.PI / 180,
            vfov : 80 * Math.PI / 180,
            hViewDistance : 0,
            vViewDistance : 0,
            maxDistance : 800,
            starSpeed : 3,
            stars : []
        },
        star : function() {
            this.x = (Math.random() * w) - (w / 2);
            this.y = (h / 2) - (Math.random() * h);
            this.z = (Math.random() * starfield.settings.maxDistance);
        
            this.projectedX;
            this.projectedY;
            this.projectedSize;
        },
        drawStars : function() {
            var settings = starfield.settings,
                star,
                i = 0;

            settings.hViewDistance = (w / 2) / Math.tan(settings.hfov / 2);
            settings.vViewDistance = (h / 2) / Math.tan(settings.vfov / 2);
    
            for (; i < settings.maxStars; i++) {
                star = new starfield.star();
                settings.stars.push(star);
            }
        },
        drawField : function() {
            var settings = starfield.settings,
                len = settings.stars.length,
                star,
                i = 0;
                          
            for (; i < len; i++) {
                star = settings.stars[i];
                sfCtx.fillRect(star.projectedX, star.projectedY, star.projectedSize, star.projectedSize);                    
            }
        },
        trackState : function() {
            var settings = starfield.settings,
                len = settings.stars.length,
                star,
                i = 0;
        
            for (; i < len; i++) {
                star = settings.stars[i];
            
                star.z -= settings.starSpeed;
                if (star.z <= 0) star.z = settings.maxDistance;
            
                star.projectedX = (star.x * settings.hViewDistance) / star.z;
                star.projectedY = (star.y * settings.vViewDistance) / star.z;
            
                star.projectedX += w / 2;
                star.projectedY = (h / 2) - star.projectedY;
            
                star.projectedSize = (1 - (star.z / settings.maxDistance)) * 4;
            }
        },
        init : function() {
            sfCtx.fillStyle = '#777';
            starfield.drawStars();
            starsRunning = setInterval(starfield.update, 17);             
        },      
        update : function() {
            sfCtx.clearRect(0, 0, w, h);
            starfield.trackState();
            starfield.drawField();
        }
    };

    var director = {
		levels : [
			[[0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,2,2,2,2,3,0,0],
			 [0,0,0,0,0,0,2,0,0],
			 [0,0,0,0,0,0,2,0,0],
			 [0,0,2,2,2,2,2,0,0],
			 [0,0,0,0,0,0,2,0,0],
			 [0,0,0,0,0,0,2,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,0,2,0,2,0,0,0],
			 [0,0,0,0,2,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0]],

			[[0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,3,0,0,0,0],
			 [0,0,0,2,0,2,0,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,0,0,2,0,0,0,0],
			 [0,0,0,2,0,2,0,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,0,0,2,0,0,0,0],
			 [0,0,0,2,0,2,0,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,0,0,0,0,0,0,0]],

			[[0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,0,2,0,2,0,2,0],
			 [0,0,2,0,2,0,2,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,3,0,0,0,2,0,0],
			 [0,0,2,2,2,2,2,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0]],

			[[0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,0,2,0,2,0,0,0],
			 [0,0,2,2,2,2,2,0,0],
			 [0,0,2,0,0,0,3,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,2,2,2,2,2,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0]],

			[[0,0,0,0,2,0,0,0,0],
			 [0,0,0,0,0,2,0,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,2,0,2,0,0,0,2,0],
			 [0,2,0,0,2,0,0,2,0],
			 [0,2,0,0,0,0,0,3,0],
			 [0,2,0,0,0,0,0,2,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,0,2,0,2,0,0,0],
			 [0,0,0,0,2,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0]],

			[[0,0,0,0,0,0,0,0,0],
			 [0,0,2,2,2,2,0,0,0],
			 [0,0,2,0,0,2,2,0,0],
			 [0,0,2,0,0,2,0,0,0],
			 [0,0,2,0,0,2,0,0,0],
			 [0,2,2,0,0,3,2,2,0],
			 [0,0,2,0,0,2,0,0,0],
			 [0,0,2,0,0,2,0,0,0],
			 [0,0,2,0,0,2,2,0,0],
			 [0,0,2,2,2,2,0,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0]],

			[[0,0,0,2,2,2,0,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,2,0,0,0,0,2,0,0],
			 [0,2,0,0,0,0,2,0,0],
			 [0,2,0,0,2,2,2,2,0],
			 [0,2,0,0,2,0,0,2,0],
			 [0,2,0,0,2,2,2,3,0],
			 [0,2,0,0,0,0,2,0,0],
			 [0,2,0,0,0,0,2,0,0],
			 [0,0,2,0,0,0,2,0,0],
			 [0,0,0,2,2,2,0,0,0],
			 [0,0,0,0,0,0,0,0,0]],

			[[0,0,0,0,2,0,0,0,0],
			 [0,0,0,2,0,2,0,0,0],
			 [0,0,2,0,2,0,2,0,0],
			 [0,2,0,2,0,2,0,2,0],
			 [2,0,2,0,2,0,2,0,2],
			 [0,2,0,2,0,2,0,2,0],
			 [0,0,3,0,2,0,2,0,0],
			 [0,0,0,2,0,2,0,0,0],
			 [0,0,0,0,2,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0]],

			[[2,0,0,0,0,0,0,0,0],
			 [2,2,0,0,0,0,0,0,0],
			 [2,2,2,0,0,0,0,0,0],
			 [2,2,2,2,0,0,0,0,0],
			 [2,2,2,2,2,0,0,0,0],
			 [2,2,2,2,2,2,0,0,0],
			 [2,2,2,2,2,2,2,0,0],
			 [2,2,2,2,2,2,2,2,0],
			 [2,2,2,2,2,2,2,2,2],
			 [2,2,2,3,2,2,2,2,0],
			 [2,2,2,2,2,2,2,0,0],
			 [0,2,0,2,0,2,0,0,0]],

			[[2,0,2,0,2,0,2,0,2],
			 [0,2,0,2,0,2,0,2,0],
			 [2,0,2,0,2,0,2,0,2],
			 [0,2,0,2,0,2,0,2,0],
			 [2,0,2,0,2,0,2,0,2],
			 [0,2,0,2,0,2,0,2,0],
			 [2,0,2,0,2,0,2,0,2],
			 [0,2,0,2,0,2,0,2,0],
			 [2,0,2,0,2,0,2,0,2],
			 [0,2,0,3,0,2,0,2,0],
			 [2,0,2,0,2,0,2,0,2],
			 [0,2,0,2,0,2,0,2,0]]
		],
        startGame : function() {
            var levelScreen = screens[5];
        
            level = new spaceout.level(currentLevel);
            levelScreen.children[0].children[0].innerHTML = 'Level One';
            screens[1].style.display = 'none';
            levelScreen.style.display = 'block';
        
            setTimeout(function() {
                levelScreen.style.display = 'none';
                spaceout.init();
            }, 1000);       
        },
        pauseGame : function() {
            if (canPause) {
                if (!paused) {
                    paused = true;
                    clearInterval(gameRunning);
					clearInterval(starsRunning);
                    screens[3].style.display = 'block';
                } else {   
                    paused = false;
                    gameRunning = setInterval(spaceout.update, 17);
            		starsRunning = setInterval(starfield.update, 17);
                    screens[3].style.display = 'none';                    
                }                  
            }
        },
        nextLevel : function() {
            var levelScreen = screens[5],
                levelText = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        
            clearInterval(gameRunning);
            gameRunning = false;
        
            director.transition();
        
            if (currentLevel < director.levels.length - 1) {
                levelScreen.children[0].children[0].innerHTML = 'Level ' + levelText[currentLevel + 1];
                levelScreen.style.display = 'block';
            
                level = new spaceout.level(++currentLevel);

                setTimeout(function() {
                    levelScreen.style.display = 'none';
                    spaceout.init();
                }, 1000);                    
            } else {
                director.gameOver();
            }       
        },         
        gameOver : function() {
            ball.y = -100;
            canPause = false;
        
            setTimeout(function() {
                clearInterval(gameRunning);
                gameRunning = false;
                ctx.clearRect(0, 0, w, h);            
                spaceout.destroy();
                canPost = true;
           
                if (currentLevel != director.levels.length - 1) {
                    screens[7].children[0].children[0].innerHTML = 'Game Over';
                    screens[7].children[0].style.paddingTop = '60px';
                } else {
                    screens[7].children[0].children[0].innerHTML = 'Thanks for Playing!';
                    screens[7].children[0].style.paddingTop = '40px';
                }
            
                screens[7].children[1].children[0].innerHTML = 'Your Score: ' + score;
                screens[7].style.display = 'block';
                document.getElementById('score').focus();
            }, 800);
        },
        newGame : function() {
            clearInterval(gameRunning);
            gameRunning = false;
            ctx.clearRect(0, 0, w, h);

			paused = false;
			clearInterval(starsRunning);
			starsRunning = setInterval(starfield.update, 17);
			
            spaceout.destroy();
            currentLevel = score = 0;
            lives = 3;

            screens[1].style.display = 'block';
            screens[3].style.display = screens[7].style.display = screens[9].style.display = 'none';                
        },
        transition : function() {
            var trans;
        
            clearInterval(starsRunning); 
            canPause = false;
            hasLasers = false;
        
            trans = setInterval(function() {
                ctx.clearRect(0, 0, w, h);
                starfield.trackState();
                starfield.drawField();
            }, 25);
        
            setTimeout(function() {
                clearInterval(trans);
                starsRunning = setInterval(starfield.update, 17);
                canPause = true;
            }, 1000);
        },
        lostLife : function() {
            ball.y = -100;
            canPause = false;
        
            setTimeout(function() {
                clearInterval(gameRunning);
                gameRunning = false;
                ctx.clearRect(0, 0, w, h);
                lives -= 1;
                hasLasers = false;                
                spaceout.init();
            }, 800);
        },
        highScores : function() {
            screens[1].style.display = 'none';
            screens[7].style.display = 'none';
            screens[9].style.display = 'block';
            gameRunning = true;
        }         
    };

    var utils = {
        bindEvents : function() {
            window.addEventListener('keydown', function(e) {
                switch (e.keyCode) {
                    case 32:
                        space = true;
                        e.preventDefault();
                        break;
                    case 39:
                        right = true;
                        break;
                    case 37:
                        left = true;
                        break;
                    case 80:
                        // pause
                        director.pauseGame();                    
                        break;                          
                    case 27:
                        // esc
                        director.newGame();
                        break;                          
                    case 49:
                        // 1
                        if (!gameRunning && !level) director.startGame();
                        break;
                    case 50:
                        // 2
                        if (!gameRunning && !level) director.highScores();
                        break;
                    case 13:
                        // Enter
                        canPost && utils.submitHighScore();
                        break;
                }   
             }, false);
        
            window.addEventListener('keyup', function(e) {
                switch (e.keyCode) {
                    case 32:
                        space = false;
                        break;
                    case 39:
                        right = false;
                        break;
                    case 37:
                        left = false;
                        break;
				}                  
            }, false);                   
        },
        getHighScores : function() {
			var highScores, li = '', i = 5, j = 0;
	
			if (localStorage.spaceout) {
				highScores = JSON.parse(localStorage.getItem('spaceout'));
			} else {
				highScores = [];
				
				while (i--) {
					highScores[i] = {};
					highScores[i].id = i;
					highScores[i].data = {
						name : 'ABC',
						score : (5 - i) * 100
					}
				}				
			}
			
            for (; j < highScores.length; j++) {
                li += '<li>[' + (j + 1) + '] ' + highScores[j].data.name.toUpperCase() + ' ' + highScores[j].data.score + '</li>';
            }

            li += '<li class="inst">Esc to quit.</li>';
            screens[9].children[1].innerHTML = li;			

			localStorage.spaceout = JSON.stringify(highScores);

        },
        submitHighScore : function() {
			var name = document.getElementById('score').value.replace(/[^a-zA-Z0-9]+/g, '');
				data = {
					id : 0,
					data : {
						name : name.substring(0, 3),
						score : score						
					}
				},
				highScores = JSON.parse(localStorage.getItem('spaceout')), 
				i = 0;

			highScores.push(data);

			console.log(highScores);
			// localStorage.spaceout = JSON.stringify(data);
			
            utils.getHighScores();
            screens[7].children[1].children[3].style.display = 'block';
            canPost = false;

            setTimeout(function() {
                director.highScores();
                screens[7].children[1].children[3].style.display = 'none';                        
            }, 1000);
        },
        imageHelper : function(name) {
            var img = new Image();
            img.src = images[name];
            return img;
        }
	};

    var spaceout = {
        ball : function() {},
        brick : function() {
            this.width = (w / 9) - this.margin;
            this.rowH = this.height + this.margin;
            this.colW = this.width + this.margin;                     
        },
        paddle : function() {
            this.width = w / 6;
            this.height = h / 25;
            this.x = w / 2 - this.width / 2 | 0;
            this.y = h - this.height;
        },
        level : function(num) {
            var template = director.levels[num],
                i, j;
                
            for (i = 0; i < this.rows; i++) {
                if (template[i]) this[i] = [];
                for (j = 0; j < this.cols; j++) {
                    if (template[i][j]) {
                        this[i][j] = template[i][j];
                        this.count++;
                        this.total++;
                    }
                }                        
            }                
        },
        powerup : function() {},
        laser : function() {
            this.x = paddle.x + (paddle.width / 2 - this.width / 2) | 0;
            this.y = h - paddle.height - this.height | 0;         
        },
        drawBall : function() {
            ctx.drawImage(ball.image, ball.x, ball.y, ball.diam, ball.diam);
        },
        drawBricks : function() {
            var row = (ball.y / brick.rowH) | 0,
                col = (ball.x / brick.colW) | 0,
                i, j, k;

            for (i = 0; i < level.rows; i++) {
                ctx.fillStyle = level.colours[i];

                for (j = 0; j < level.cols; j++) {
                    if (level[i][j]) {
                        ctx.fillRect((j * (brick.width + brick.margin) + brick.margin), (i * (brick.height + brick.margin) + brick.margin), brick.width, brick.height);
                        ctx.drawImage(brick.image, (j * (brick.width + brick.margin) + brick.margin), (i * (brick.height + brick.margin) + brick.margin), brick.width, brick.height);
                    }
                }
            }

            if (ball.y < (level.rows * brick.rowH) && row >= 0 && col >= 0) {
                if (level[row][col]) {
                    if (level[row][col] == 3) { 
                        powerup = new spaceout.powerup();
                        powerup.x = (col + 1) * (brick.width + brick.margin) - (brick.width / 2) - (powerup.diam / 2) | 0;
                        powerup.y = (row + 1) * (brick.height);
                    }

                    ball.dy = -ball.dy;
                    level[row][col] = 0;
                    level.count--;
                    score += 10;
                }
            }
                        
            if (level.count <= 0) director.nextLevel();
        },
        drawPaddle : function() {
            if (left && paddle.x >= paddle.moveBy) {
                paddle.x -= paddle.moveBy;
            } else if (right && (paddle.x + paddle.width) <= w - paddle.moveBy) {
                paddle.x += paddle.moveBy;
            }

            if (!hasLasers) {
                ctx.drawImage(paddle.image, paddle.x, paddle.y, paddle.width, paddle.height);
            } else {
                ctx.drawImage(paddle.invert, paddle.x, paddle.y, paddle.width, paddle.height);
            }
        },
        drawPowerup : function() {
            if (powerup) {
                powerup.y += powerup.dy * powerup.vel;

                ctx.drawImage(powerup.image, powerup.x, powerup.y, powerup.diam, powerup.diam);
            
                if (powerup.y + powerup.dy > h) {
                    powerup = null;
                } else if (powerup.y + powerup.dy > (h - paddle.height - powerup.diam)) {
                    if (powerup.x > paddle.x && powerup.x < paddle.x + paddle.width) {
                        hasLasers = true;
                        powerup = null;
                        setTimeout(function() {
                            hasLasers = false;
                        }, 10000);                          
                    }
                }
            }
        },
        drawLasers : function() {
            if (hasLasers) {
                var laserFactory = spaceout.laser,
                    newLaser,
                    laser,
                    i = 0,
                    row,
                    col;

                if (space) {
                    if (timer() - lastShot > fireRate) {
                        lastShot = timer();

                        if (lasers.length < maxLasers) {
                            newLaser = new laserFactory();
                            lasers.push(newLaser);
                        } else {
                            lasers.shift();
                        }
                    }
                }
        
                for (; i < lasers.length; i++) {
                    laser = lasers[i];
                    laser.y += laser.dy * laser.vel;
            
                    row = (laser.y / brick.rowH) | 0;
                    col = (laser.x / brick.colW) | 0;
            
                    ctx.drawImage(laser.image, laser.x, laser.y, laser.width, laser.height);              
            
                    if (laser.y < (level.rows * brick.rowH) && row > 0 && col > 0) {
                        switch (level[row][col]) {
                            case 1:
                                lasers.splice(i, 1);
                                level[row][col] = 0;
                                level.count--;
                                score += 10;
                                break;
                            case 2:
                                lasers.splice(i, 1);
                                level[row][col] = 1;
                                break;                                                          
                            case 3:
                                lasers.splice(i, 1);
                                level[row][col] = 0;
                                level.count--;
                                score += 10;
                                powerup = new spaceout.powerup();
                                powerup.x = (col + 1) * (brick.width + brick.margin) - (brick.width / 2) - (powerup.diam / 2) | 0;
                                powerup.y = (row + 1) * (brick.height);
                                break;                                
                        }
                    }              
                }
            }
        },
        drawScore : function() {
            ctx.fillStyle = 'white';
            ctx.fillText('SCORE: ' + score, 10, 20);
        },
        drawLives : function() {
            ctx.fillText('LIVES: ' + lives, 445, 20);                
        },
        trackState : function() {
            if (ball.x + ball.dx > w - ball.diam || ball.x + ball.dx < 0) {
                ball.dx = -ball.dx;
            }
                        
            if ((ball.y + ball.dy) < 0) {
                ball.dy = -ball.dy;
            } else if ((ball.y + ball.dy) > (h - paddle.height -  ball.diam)) {
                if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    if (ball.x < paddle.x + 20 || ball.x > paddle.x + paddle.width - 20) {
                        ball.dx = 4 * ((ball.x - (paddle.x + paddle.width / 2)) / paddle.width);                            
                    }
                    ball.dy = -ball.dy;
                } else if (ball.y + ball.dy + ball.diam > h) {
                    if (lives > 1) {
                        director.lostLife();
                    } else {
                        setTimeout(function() {
                            director.gameOver();
                        }, 50);                            
                    }
                }
            }

            ball.x += ball.dx * ball.vel;
            ball.y += ball.dy * ball.vel;
        
        },
        init : function() {
            ball = new spaceout.ball();
            brick = new spaceout.brick();
            paddle = new spaceout.paddle();
      
            ball.x = paddle.x + paddle.width / 2;
            ball.y = paddle.y - paddle.height;
        
            lasers = []; 

            ctx.font = '14px monospace';
            canPause = true;
            
            gameRunning = setInterval(spaceout.update, 17);       
        },
        update : function() {
            ctx.clearRect(0, 0, w, h);
            spaceout.drawBall();
            spaceout.drawBricks();
            spaceout.drawPowerup();
            spaceout.drawLasers();
            spaceout.drawPaddle();
            spaceout.drawScore();
            spaceout.drawLives();
            spaceout.trackState();
        },                       
        destroy : function() {
            canPause = false;                 
            brick = ball = paddle = level = null; 
        }
    };
    
    spaceout.ball.prototype = {
        x : 0,
        y : 0,
        dx : 1,
        dy : -1,
        vel : 4,
        diam : 14,
        image : utils.imageHelper('ball')
    };

    spaceout.brick.prototype = {
        margin : 1,
        height : (h / 25),
        image : utils.imageHelper('brick') 
    };

    spaceout.paddle.prototype = {
        moveBy : w / 37,
        image : utils.imageHelper('paddle'),
        invert : utils.imageHelper('paddleInvert')
    };

    spaceout.level.prototype = {
        rows : 12,
        cols : 9,
        colours : ['#800080', '#FF0000', '#8B0000', 'orange', 'yellow', 'lime', 'green', '#00FFFF', '#008080', '#0000FF', '#000080', '#FF00FF'], 
        count : 0,
        total : 0
    };

    spaceout.powerup.prototype = {
        diam : 20,
        x : 0,
        y : 0,
        dy : 1,
        vel : 5,
        image : utils.imageHelper('powerup')
    };

    spaceout.laser.prototype = {
        width : 3,
        height : 6,
        dy : -1,
        vel : 10,
        image : utils.imageHelper('laser')
    };
    
    utils.bindEvents();
    utils.getHighScores();
    starfield.init();
        
    return false;
    
})();