/*
TODO:
-Change some colors
-Test with 15 letters (overflow issue on confirm list, Overlap in asteroid spawn)
Acknowledgement, confirmation of ablility
*/


class GamePlay extends Phaser.Scene {
    constructor() {
        console.log("Gameplay constructor triggered");
        super("playGame"); //sets the name to call on game.scene.start("...")
        this.bg;
        //var game = new Phaser.Game(config);
        //this.skipNum = 1; //skip number
        //this.startNum = Phaser.Math.Between(0,10); //starting number for skip counting
        this.laser = null;
        this.wrong = null;
        this.boxs = [];
        this.rock;
        this.text;
        this.rect;
        this.answerText;
    }
    
    init(data){
        console.log("Gameplay Init called");
        this.dataArr = data.dataArr;
        this.currentLine = data.currentLine;
    }

    

     preload ()
    {
        console.log("Gameplay Preload triggered");
        //preloads assets
        this.load.image('space','assets/planet.png');
        this.load.image('rock','assets/rock.png');
        this.load.image('laser','assets/laser.png');
        this.load.image('wrong','assets/wrong.png');
        this.load.image('screen','assets/fScreen.png')
        // this.load.image('bomb','assets/bomb.png');
        // this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

     create ()
    {
        console.log("Gameplay create triggered");
        //Objects Used
        var answer = "";
        //adds sky and objects in game
        this.bg = this.add.sprite(650, 300, 'space');
        
       // bg = this.add.image(400,300,'space');
        this.bg.setDisplaySize(1300, 600);

        this.rect = this.add.rectangle(650, 50, 1300, 130, 0x6666ff);
        var descRect = this.add.rectangle(225, 50, 450, 130, 0x6688ff);
        var fScreen = this.add.sprite(1250, 50, 'screen');
        //Adds physics to a shape
        this.physics.add.existing(this.rect);
        //changes the shape to not move on collisions
        this.rect.body.setImmovable(true);
        var style = { font: "32px Arial", fill: "#000000",  wordWrap: true, align: "center" };
        var styleWrap = { font: "25px Arial", fill: "#000000", wordWrap: {width: 445, useAdvancedWrap: true}, align: "left" };
        var style1 = { font: "32px Arial", fill: "#ffffff", wordWrap: true, align: "center" };
        var style2 = { font: "40px Monospace", fill: "#000000", wordWrap: true, align: "center" };
        this.answerText = this.add.text(535, 25, answer, style2);
        //creates boxes
        var boxX = 535;
        for (let i = 0; i<this.dataArr[this.currentLine].word.length; i++){
            this.add.text(boxX, 30, ` _`, style2);
            //this.boxs.push(this.add.rectangle(boxX,45, 50, 50, 0xffffff));
            //this.boxs[i].num = null;
            boxX+=44;
        }

        this.rock = this.physics.add.group({
            key:"rock",
            repeat:this.dataArr[this.currentLine].word.length-1,
            setXY:{x:60,y:190,stepX:120,stepY:20},
            setScale: { x: 0.75, y: 0.75}
        });
        

        
        var tmpWord= this.dataArr[this.currentLine].word;
        
        //setting text and characteristics for each rock
        this.rock.children.each(function(child){
            child.body.setSize(child.body.width*0.9,child.body.height*0.9); //sets the collision body size to 90%
            var index = Phaser.Math.Between(0, tmpWord.length-1);
            child.letter = tmpWord[index];   
            child.text = this.add.text(child.x, child.y, `${child.letter}`, style1);
            //Splice the letter out of the word to create random placements of letters
            let extraWord = tmpWord.substring(0,index);
            extraWord+= tmpWord.substring(index+1,tmpWord.length);
            tmpWord=extraWord;
            child.setVelocityX(Phaser.Math.FloatBetween(-100,100));
            child.setVelocityY(Phaser.Math.FloatBetween(-100,100));
            child.rotationVel = Phaser.Math.FloatBetween(-1,1);
            child.setCollideWorldBounds(true);
            child.setBounce(1)
        },this);
        
        this.physics.add.collider(this.rock,this.rock);
        this.physics.add.collider(this.rock,this.rect);
       
        this.add.text(10, 2, `Description:`, style);
        descRect.text = this.add.text(10, 27, `${this.dataArr[this.currentLine].desc}`, styleWrap);
        this.add.text(450, 30, `Word:`,style);

        var scene = this;
        var restartButt = null;
        //Click interaction
        this.input.on('pointerdown', function(pointer){
            var touchX = pointer.x;
            var touchY = pointer.y + 300;
            if (fScreen.getBounds().contains(pointer.x,pointer.y)){
                if (game.scale.isFullscreen)
                {
                    //button.setFrame(0);

                    game.scale.stopFullscreen();
                }
                else
                {
                    //button.setFrame(1);

                    game.scale.startFullscreen();
                }
            }
            if( restartButt && restartButt.getBounds().contains(pointer.x,pointer.y)){
                if(scene.currentLine == scene.dataArr.length-1){
                    scene.scene.start("bootGame");
                }
                else{
                    scene.scene.start("playGame",{dataArr: scene.dataArr, currentLine: scene.currentLine+1});
                }
                
            }
            scene.laser = scene.add.sprite(pointer.x,touchY,"laser");
            scene.time.delayedCall(50, function(){scene.removeLaser(scene.laser)});
            scene.rock.children.each(function(child){
                if (child.getBounds().contains(pointer.x, pointer.y)){
                    if (child.visible){
                        if(scene.dataArr[scene.currentLine].word[answer.length]  == child.letter){
                            //add function to display number added to count. 
                            console.log("Hit child: "+child.letter);
                            answer += child.letter; 
                            child.setVisible(false);
                            child.disableBody(true,true);
                            scene.updateText(answer);
                            child.text.setVisible(false);
                            //see if last rock was shot
                            if(answer.length == scene.dataArr[scene.currentLine].word.length){
                                if(scene.currentLine == scene.dataArr.length-1){
                                let tmpRect = scene.add.rectangle(650, 400, 900, 500, 0xFFFFFF);
                                tmpRect.setAlpha(0.8);
                                scene.add.text(650/2, 200, `Congratulations! You did it!\n Click the button below to go to the menu.`, style);
                                restartButt = scene.add.rectangle(650, 450, 300, 200, 0x0000ff);
                                restartButt.finished = true;
                                var buttText = scene.add.text(650-60, 430, "Click me", style1);
                                }
                                //if finished display back to menu
                                else{
                                //else display next word
                                let tmpRect = scene.add.rectangle(650, 400, 900, 500, 0xFFFFFF);
                                tmpRect.setAlpha(0.8);
                                scene.add.text(650/2, 200, `Congratulations! You did it!\n Click the button below to go to the next word.`, style);
                                restartButt = scene.add.rectangle(650, 450, 300, 200, 0x0000ff);
                                restartButt.finished = true;
                                var buttText = scene.add.text(650-60, 430, "Click me", style1);
                                }
                            }
                        }
                        else{
                            
                            scene.time.delayedCall(100, function(){
                                scene.wrong = scene.add.sprite(pointer.x,pointer.y,"wrong");
                                scene.wrong.setScale(0.60);
                                scene.time.delayedCall(100, function(){scene.removeLaser(scene.wrong)});
                            });
                            
                        }
                    }
                }
            });
        });   
    }

    removeLaser(temp){
        temp.setVisible(false);   
    }

    updateText(answer){
        let tmp = " ";
        for(let i = 0; i<answer.length;i++){
            tmp+=answer[i]+" ";
        }
        this.answerText.setText(tmp);
    }


     update ()
    {
        //changes the texts position on each asteroid
        this.rock.children.each(function(child){
            child.angle += child.rotationVel;
            child.text.x = (child.x-10);
            child.text.y = (child.y-10);
        });
    } 
}