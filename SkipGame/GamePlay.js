class GamePlay extends Phaser.Scene {
    constructor() {
        console.log("Gameplay constructor triggered");
        super("playGame"); //sets the name to call on game.scene.start("...")
        this.bg;
        //var game = new Phaser.Game(config);
        //this.skipNum = 1; //skip number
        //this.startNum = Phaser.Math.Between(0,10); //starting number for skip counting
        this.numbers = []; //keeps track of our numbers counted 
        this.numShot = []; //keeps count of how many skip numbers we have shot
        this.laser = null;
        this.boxs = [];
        this.rock;
        this.text;
        this.rect;
    }
    
    init(data){
        console.log("Gameplay Init called");
        this.skipNum = data.skipNum;
        this.startNum = data.startNum;
        this.lowNum = this.startNum; //keeps track of the next number that needs to be shot
    }

    

     preload ()
    {
        console.log("Gameplay Preload triggered");
        //preloads assets
        this.load.image('space','assets/planet.png');
        this.load.image('rock','assets/rock.png');
        this.load.image('laser','assets/laser.png');
        // this.load.image('bomb','assets/bomb.png');
        // this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

     create ()
    {
        console.log("Gameplay create triggered");
        //Objects Used
        
        //adds sky and objects in game
        this.bg = this.add.sprite(650, 300, 'space');

       // bg = this.add.image(400,300,'space');
        this.bg.setDisplaySize(1300, 600);

        this.rect = this.add.rectangle(650, 50, 1300, 100, 0x6666ff);
      
        //Adds physics to a shape
        this.physics.add.existing(this.rect);
        //changes the shape to not move on collisions
        this.rect.body.setImmovable(true);
        //creates boxes
        var boxX = 590;
        for (let i = 0; i<7; i++){
            this.boxs.push(this.add.rectangle(boxX,45, 50, 50, 0xffffff));
            this.boxs[i].num = null;
            boxX+=55;
        }
        this.boxs.numLength = 1; //start num added


        this.rock = this.physics.add.group({
            key:"rock",
            repeat:7,
            setXY:{x:90,y:200,stepX:160,stepY:50}
        });
        var style = { font: "32px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: this.rock.width, align: "center" };
        var style1 = { font: "32px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.rock.width, align: "center" };

        
        //populate answer array
        this.numbers.push(this.startNum+this.skipNum);
        while (this.numbers.length < 6){
            var temp = (this.numbers[this.numbers.length-1]+this.skipNum);
            this.numbers.push(temp);
            console.log(temp);
        }
        
        var tempArr = this.numbers;
        //fills two random numbers that don't match the skip count
        if (this.skipNum == 1){
            //logic for 1 skips
            tempArr.push(this.numbers[this.numbers.length-1]+Phaser.Math.Between(5,7));
            if(this.startNum>0)
                tempArr.push(this.startNum-1);
            else
                tempArr.push(this.numbers[this.numbers.length-1]+Phaser.Math.Between(2,3));
        }
        else {
            tempArr.push(Math.round((this.numbers[2]+this.numbers[3])/2));
            tempArr.push(Math.round((this.numbers[4]+this.numbers[5])/2));
        }
        
        //setting text and characteristics for each rock
        this.rock.children.each(function(child){
            //console.log(`Temp Arr is ${tempArr.length} + ${tempArr}`);
            var index = Phaser.Math.Between(0, tempArr.length-1);
            child.num = tempArr[index];                
            child.text = this.add.text(child.x, child.y, `${child.num}`, style1);
            tempArr.splice(index,1);    
            child.setVelocityX(Phaser.Math.FloatBetween(-50,50));
            child.setVelocityY(Phaser.Math.FloatBetween(-50,50));
            child.setCollideWorldBounds(true);
            child.setBounce(1)
        },this);
        
        this.physics.add.collider(this.rock,this.rock);
        this.physics.add.collider(this.rock,this.rect);
       
        this.add.text(50, 30, `We are counting by ${this.skipNum}`, style);
        this.add.text(450, 30, `Start at:  ${this.startNum}`,style);
        //var rock = this.physics.add.sprite(400,300,"rock");
        //
        // alien.displayWidth = 150;
        // alien.displayHeight = 75;

        var scene = this;
        var restartButt = null;
        //Click interaction
        this.input.on('pointerdown', function(pointer){
            var touchX = pointer.x;
            var touchY = pointer.y + 300;
            
            if( restartButt && restartButt.getBounds().contains(pointer.x,pointer.y)){
                scene.scene.start("bootGame");
            }
            scene.laser = scene.add.sprite(pointer.x,touchY,"laser");
            scene.time.delayedCall(50, function(){scene.removeLaser(scene.laser)});
            scene.rock.children.each(function(child){
                if (child.getBounds().contains(pointer.x, pointer.y)){
                    if (child.visible){
                        if(child.num == scene.lowNum+scene.skipNum){
                            //add function to display number added to count.  
                            child.setVisible(false);
                            child.disableBody(true,true);
                            scene.add.text((scene.boxs[scene.boxs.numLength].x-15), scene.boxs[0].y-15, `${scene.lowNum+scene.skipNum}`,style);
                            scene.lowNum+=scene.skipNum;
                            scene.boxs.numLength++;
                            child.text.setVisible(false);
                            //TODO: check if rock was the last one then end the game
                            if(scene.boxs.numLength == 7){
                                var tmpRect = scene.add.rectangle(650, 400, 900, 500, 0xFFFFFF);
                                tmpRect.setAlpha(0.8);
                                scene.add.text(650/2, 200, `Congratulations! You did it!\n Click the button below to go to the menu.`, style);
                                restartButt = scene.add.rectangle(650, 450, 300, 200, 0x0000ff);
                                restartButt.finished = true;
                                var buttText = scene.add.text(650-60, 430, "Click me", style1);
                            }
                        }
                    }
                }
            });
        });   
    }

     removeLaser(temp){
        temp.setVisible(false);   
    }

     update ()
    {
        //changes the texts position on each asteroid
        this.rock.children.each(function(child){
            child.text.x = (child.x-10);
            child.text.y = (child.y-10);
        });
    } 
}