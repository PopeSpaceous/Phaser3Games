/*
Fixes/Additions
TODO:
Add arrows for horizontal navigation
Add Arrow functionality for horizontal nav. 

Add add click in place for drag and drop/accociate with timeline





Check for matching dates
import from textarea
render images. 
tint on end of rectangle for arrows.
Export timeline to URL. 
preview image page before copying URL 
light indicating complete


*/




class Start extends Phaser.Scene {
    constructor() {
        super("bootGame"); //temp       
    }

    init(data){
        // if(data.list){
        //     this.inlist = data.list;
        //     this.word = null;
        //     this.descript = null;
        //     console.log("Start with list");
        // }
        // else if (data.word && data.descript){
        //     console.log("Start desc ->"+data.descript);
        //     this.word = data.word;
        //     this.descript = data.descript;
        //     this.inlist = null;
        // }
        // else {
        //     this.inlist = null;
        //     this.word = null;
        //     this.desc = null;
        //     console.log("Start with none");

        // }
        this.scale.fullscreenTarget = document.getElementById('phaser-example');
    }

    preload(){
        this.load.image('Gameboy', 'https://i.imgur.com/sCJJ9wf.jpeg');
        this.load.image('arrow','assets/LRarrow.png');
        // this.load.image('stars','assets/StarBG.png')
        // this.load.image('screen','assets/fScreen.png')
    }




    // //set to toggle overlay on or off
    // overlay(){
    //     console.log("Overylay Was called");
    //     var el = document.getElementById("overlay");
    //     el.style.display = (el.style.display == "none") ? "block" : "none";

    //     window.scrollTo(0, 0);
    // }

    
    setscale(inSprite){
        //What width of picture you want
        var setWidth = 150;
        
        var ratio = inSprite.displayWidth / setWidth;
        var inHeight = inSprite.displayHeight; 
       
        inSprite.displayWidth = setWidth;
        inSprite.displayHeight = inHeight/ratio;
       
    }

    
    create(){
        var game = this;
        class timeLine{
            constructor(spokes){
                this.recs = [];
                this.placement = [];
                this.cardAssociated = [];
                this.dates = [];
                //create a timeline based on number of spokes
                let flip = 1;  
                //build end start rectangle
                var xPos = 120;
                this.recs.push(game.add.rectangle(xPos, 300, 20,300, 0x000000));
                xPos += 100;
                for(let xx = 0; xx<spokes; xx++){
                    //build line
                    this.recs.push(game.add.rectangle(xPos, 300, 200,20, 0x000000));
                    //build spoke
                    this.recs.push(game.add.rectangle(xPos+50, 300 + flip*10, 20,40, 0x000000));
                    
                    //build placement
                    this.placement.push(game.add.rectangle(xPos+50, 300 + flip*200, 140,140, 0xff80b3));

                    flip = flip>0 ? -1 : 1;
                    xPos+=100;
                    //post: add test box are for sprite to go
                }
                this.recs.push(game.add.rectangle(xPos, 300, 200,20, 0x000000));
                this.recs.push(game.add.rectangle(xPos+100, 300, 20,300, 0x000000))
                //add additional line
                //add end rectangle


            }
        }



        var numGameObjects = 5;
        this.add.rectangle(650,300,1300,600,0x275296);
        var sideRec = this.add.rectangle(1150,300,300,600,0x0099ff);
        sideRec.depth = 1;
        //build line. check if < 4. if greater extend it
        var gameTimeline = new timeLine(5);


        
       
        var histObj = [];
        class Card{
            constructor(inSprite){
                this.cardSprite =  inSprite;
                this.onSide = true;
                this.date = 0; //Change and fix constructor when made
            }
        }
        var startY = 50; 
        for(let x=0; x<numGameObjects;x++){
            
            histObj.push(new Card(this.add.sprite(1151,300,"Gameboy")));
            var that = histObj[x].cardSprite;
            that.setInteractive();
            this.setscale(that);
            startY += (that.displayHeight/2)
            that.y = startY;
            that.depth = 2.1;
            startY += (that.displayHeight/2) + 20;
            this.input.setDraggable(that);
            that.on('drag', function (pointer, dragX, dragY) {
                this.x = dragX;
                this.y = dragY;
                this.depth = 2;
            });
            that.on('dragend', function (pointer) {
                if (this.x > 1000){
                    this.depth = 2.1;
                    this.x = 1151;
                    histObj[x].onSide = true;
                }
                else{
                    this.depth = 0.5
                    histObj[x].onSide = false;
                }
                //check if on timeline, then if in place, run through all others to see if matched. 
            });
        }



        //Creates top and bottom boxes and arrows. Gives the functions of moving Gameboys up and down
        var topArr = this.add.rectangle(1150,30,300,60,0x0099ff).setInteractive();
        topArr.depth=2.5;
        topArr.on('pointerdown',function(){
            histObj.forEach(x=>{
                console.log(JSON.stringify(x));
                if(x.onSide){
                    x.cardSprite.y -= 50;
                }
            })
        });
        var botArr = this.add.rectangle(1150,570,300,60,0x0099ff).setInteractive();
        botArr.depth=2.5;
        botArr.on('pointerdown',function(){
            histObj.forEach(x=>{
                if(x.onSide){
                    x.cardSprite.y += 50;
                }
            })
        });
        var upArr = this.add.sprite(1150,35,"arrow");
        upArr.depth = 2.5;
        upArr.angle = -90;
        var downArr = this.add.sprite(1150,565,"arrow");
        downArr.flipY = true;
        downArr.depth = 2.5;  
        downArr.angle = 90;  
        //Dragable object sets
        
        







    }
}