class GetList extends Phaser.Scene {
    constructor() {
        super("GetList"); //temp
        this.title;
        this.bg;
        this.skipNum;
        this.startNum;
        
    }

    init(data){
        this.inlist=data.list;
    }

    preload(){
        this.load.image('title','assets/title.png');
        this.load.image('stars','assets/StarBG.png')
        }




    //set to toggle overlay on or off
    overlay(){
        console.log("Overylay Was called");
        var el = document.getElementById("overlay");
        el.style.display = (el.style.display == "none") ? "block" : "none";
        //this.renderTextBox(el);
        window.scrollTo(0, 0);
    }

    
    

    create(){
        console.log("started getList Create");
        console.log("Content from textarea: "+inlist);
        var buttons = [];
        this.bg = this.add.sprite(650,300,"stars");
        this.bg.setDisplaySize(1300,600);
        this.title = this.add.sprite(650, 100, 'title');
        this.title.setDisplaySize(650, 300);
        var rect = this.add.rectangle(650, 400, 900, 250, 0xFFFFFF);
        rect.setAlpha(0.4);
        var style = { font: "32px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 240, align: "center" };
        if(!this.inlist){
            this.add.text(rect.x - rect.width/2 + 50, 300,"Please click on what number you want to skip count by.", style)
            //this.scene.start("gamePlay"); //Jumps to gamePlay scene
            var boxX=650-405;
            var buttStyle = { font: "60px Arial", fill: "#000000", wordWrap: true,wordWrapWidth: 400, align: "center" };
            var smallFont = { font: "40px Arial", fill: "#000000", wordWrap: true,wordWrapWidth: 400, align: "center" };
    
            for (let i = 0; i<10;i++){
                buttons.push(this.add.rectangle(boxX,400, 80, 80, 0xffffff));
                buttons[i].num = i+1;
                this.add.text(buttons[i].x-buttons[i].width/2+10,buttons[i].y -buttons[i].height/2+5,`${i+1}`,buttStyle);
                boxX+=90;
            }
            boxX=650-405;
        }
        else{
            this.add.text(rect.x - rect.width/2 + 50, 300,"This was the entered text: "+this.list, style)
        }

        var textInputBox = this.add.rectangle(650, 220, 250, 80, 0x275296);
        textInputBox.text = this.add.text(textInputBox.x-120,textInputBox.y-25, "Click to add text", style);


        var nextMenu = this.add.rectangle(650, 400, 900, 500, 0xFFFFFF);
        nextMenu.setVisible(false);
        nextMenu.text = this.add.text();
        nextMenu.text2 = this.add.text();
        var game = this;
        var startNums = [];
        for (let i = 0; i<11;i++){
            startNums.push(this.add.rectangle(boxX,400, 70, 80, 0xffb31a));
            startNums[i].num = i;
            boxX+=80;
        }
        
        startNums.forEach(function(x){
            x.setVisible(false);
            //x.text.visible=false;
        });
        var startText =[];
        
        //Click interaction
         this.input.on('pointerdown', function(pointer){
            if (textInputBox.getBounds().contains(pointer.x,pointer.y)){
                console.log("In the add text box");
                game.overlay();
            }
            buttons.forEach(function(child){
                if (child.getBounds().contains(pointer.x, pointer.y) && child.visible){
                    nextMenu.setVisible(true); //Open Menu
                    nextMenu.text = game.add.text(nextMenu.x-nextMenu.width/2+50,nextMenu.y-nextMenu.height/2+5,`You have chosen to skip by ${child.num}.`,buttStyle);
                    nextMenu.text2 = game.add.text(nextMenu.x-nextMenu.width/2+50,nextMenu.y-nextMenu.height/2+60,`Select a number to start counting at. Click \noutside the box to go back.`,smallFont);
                    //disable skip num buttons
                    game.skipNum = child.num;
                    buttons.forEach(function(x){
                        x.setVisible(false);
                    });
                    game.time.delayedCall(50, function(){
                         startNums.forEach(function(x){
                            x.setVisible(true);
                            startText.push(game.add.text(x.x-x.width/2+10,x.y -x.height/2+5,`${x.num}`,buttStyle));
                        });
                    });
                }
                else if (nextMenu.visible && nextMenu.getBounds().contains(pointer.x,pointer.y)){
                    startNums.forEach(function(startNumChoice){
                        if (startNumChoice.getBounds().contains(pointer.x,pointer.y)&&startNumChoice.visible){
                            startNumChoice.setVisible(false);
                            //console.log(`You chose ${startNumChoice.num}`);
                            game.startNum = startNumChoice.num;
                            game.scene.start("playGame",{startNum: game.startNum, skipNum: game.skipNum});
                        }
                    });
                }
                else {
                    nextMenu.setVisible(false);
                    nextMenu.text.destroy();
                    nextMenu.text2.destroy();
                    buttons.forEach(function(x){
                        x.setVisible(true);
                    });
                    startNums.forEach(function(x){
                        x.setVisible(false);
                    });
                    startText.forEach(function(x){
                        x.destroy();
                    });
                    //enable skip buttons
                }
            });
        }); 
    }
}