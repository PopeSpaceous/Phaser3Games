/*
Fixes/Additions

*/




class Start extends Phaser.Scene {
    constructor() {
        super("bootGame"); //temp
        this.title;
        this.bg;
        this.skipNum;
        this.startNum;
        
    }

    init(data){
        if(data.list){
            this.inlist = data.list;
            this.word = null;
            this.descript = null;
            console.log("Start with list");
        }
        else if (data.word && data.descript){
            console.log("Start desc ->"+data.descript);
            this.word = data.word;
            this.descript = data.descript;
            this.inlist = null;
        }
        else {
            this.inlist = null;
            this.word = null;
            this.desc = null;
            console.log("Start with none");

        }
        this.scale.fullscreenTarget = document.getElementById('phaser-example');
    }

    preload(){
        this.load.image('title','assets/title.png');
        this.load.image('stars','assets/StarBG.png')
        this.load.image('screen','assets/fScreen.png')
    }




    //set to toggle overlay on or off
    overlay(){
        console.log("Overylay Was called");
        var el = document.getElementById("overlay");
        el.style.display = (el.style.display == "none") ? "block" : "none";

        window.scrollTo(0, 0);
    }

    
    

    create(){
        console.log("started Start Create" + this.inlist);
        var buttons = [];
        this.bg = this.add.sprite(650,300,"stars");
        this.bg.setDisplaySize(1300,600);
        this.title = this.add.sprite(650, 100, 'title');
        this.title.setDisplaySize(650, 300);
        var style = { font: "32px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 240, align: "Left" };
        var style1 = { font: "37px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 240, align: "Left" };
        var style2 = { font: "25px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 240, align: "Left" };

        var wordBox = this.add.rectangle(1050, 50, 250, 80, 0x275296);
        wordBox.text = this.add.text(wordBox.x-100,wordBox.y-25, "Confirm Words", style);
        wordBox.text.setVisible(false);
        wordBox.setVisible(false);

        var linkBox = this.add.rectangle(250, 50, 250, 80, 0x275296);
        linkBox.text = this.add.text(linkBox.x-100,linkBox.y-25, "Get URL Link", style);
        linkBox.text.setVisible(false);
        linkBox.setVisible(false);

        var fScreen = this.add.sprite(50, 50, 'screen');
        //fScreen.text = this.add.text(fScreen.x-100,fScreen.y-25, "Full Screen", style);

        class lineClass {
            constructor(word,desc){
                this.word=word;
                this.desc=desc;
            }
        };
        var lines = [];
        console.log("preprocessed "+this.descript);
        if (this.word && this.descript){
            //if the list of words is coming from the URL string
            var textInputBox = this.add.rectangle(650, 50, 250, 80, 0x275296);
            textInputBox.text = this.add.text(textInputBox.x-120,textInputBox.y-25, "Click to add text", style);
            textInputBox.text.setVisible(false);
            textInputBox.setVisible(false);

            console.log("passing data to class");
            wordBox.text.setVisible(true);
            wordBox.setVisible(true);
            var rect = this.add.rectangle(650, 350, 1250, 500, 0xFFFFFF); //sets the background white backing
            rect.setAlpha(0.4);
            for(var i =0; i < this.word.length; i++){
                lines.push(new lineClass(this.word[i], this.descript[i]));
            }
            try{
                this.add.text(rect.x - rect.width/2 + 25, rect.y - (rect.height/2 -rect.height/2*.05),"This is the entered text: Please confirm it is correct", style1);
                this.add.text(rect.x - rect.width/2 + 25, rect.y - (rect.height/2 - rect.height/2*.20),"Words", style1);
                this.add.text(rect.x - rect.width/2 + 325, rect.y - (rect.height/2 - rect.height/2*.20),"Description", style1);
                let yHeight = rect.y - (rect.height/2 -rect.height/2*.35);
                lines.forEach(x=>{
                    if(x.word==""||x.desc=="")throw("error");
                    this.add.text(rect.x - rect.width/2 + 25, yHeight,x.word, style2);
                    this.add.text(rect.x - rect.width/2 + 325, yHeight,x.desc, style2);
                    yHeight+=30;
                });
            }
            catch{
                this.add.text(rect.x - rect.width/2 + 25, rect.y - (rect.height/2 -rect.height/2*.05),"There was an error getting your list.\nEnsure it is in the style: \n\nWord, Description", style);
                textInputBox.text.setVisible(true);
                textInputBox.setVisible(true);
            }
            this.title.setVisible(false);
        }
        else if(this.inlist){ 
            //After submitting a list of words
            console.log("inlist data");
            wordBox.text.setVisible(true);
            wordBox.setVisible(true);
            var rect = this.add.rectangle(650, 350, 1250, 500, 0xFFFFFF); //sets the background white backing
            rect.setAlpha(0.4);
            try{
                var res = (this.inlist.trim()).split("\n");
                console.log("res: "+ JSON.stringify(res));
                res.forEach(function(x) {
                    //get count of commas, if > 1 get first comma location, and remove all other commas.
                    let tmpWord,tmpDesc;
                    let comIndex = x.indexOf(",");
                    tmpWord = x.substring(0,comIndex);
                    tmpDesc = x.substring(comIndex+1,x.length+1);
                    tmpDesc = tmpDesc.replace(/,/g,'');
                    //let lineSplit = x.split(",");
                    lines.push(new lineClass(tmpWord.trim(), tmpDesc.trim()));
                });
                lines.forEach(x=>{
                    if(x.word==""||x.desc=="")throw("error");
                });
                console.log("lines spliced:"+JSON.stringify(lines));
                this.add.text(rect.x - rect.width/2 + 25, rect.y - (rect.height/2 -rect.height/2*.05),"This is the entered text: Please confirm it is correct", style1);
                this.add.text(rect.x - rect.width/2 + 25, rect.y - (rect.height/2 - rect.height/2*.20),"Words", style1);
                this.add.text(rect.x - rect.width/2 + 325, rect.y - (rect.height/2 - rect.height/2*.20),"Description", style1);
                let yHeight = rect.y - (rect.height/2 -rect.height/2*.35);
                lines.forEach(x=>{
                    if(x.word==""||x.desc=="")throw("error");
                    this.add.text(rect.x - rect.width/2 + 25, yHeight,x.word, style2);
                    this.add.text(rect.x - rect.width/2 + 325, yHeight,x.desc, style2);
                    yHeight+=30;
                });
                //create a get URL link
                linkBox.text.setVisible(true);
                linkBox.setVisible(true);
            }
            catch{
                this.add.text(rect.x - rect.width/2 + 25, rect.y - (rect.height/2 -rect.height/2*.05),"There was an error getting your list.\nEnsure it is in the style: \n\nWord, Description", style);
            }
            var textInputBox = this.add.rectangle(650, 50, 250, 80, 0x275296);
            textInputBox.text = this.add.text(textInputBox.x-120,textInputBox.y-25, "Click to add text", style);
            this.title.setVisible(false);
        }
        else {
            //This is if its a fresh game.
            console.log("No list or data");
            var textInputBox = this.add.rectangle(650, 220, 250, 80, 0x275296);
            textInputBox.text = this.add.text(textInputBox.x-120,textInputBox.y-25, "Click to add text", style);
        }


        // var nextMenu = this.add.rectangle(650, 400, 900, 500, 0xFFFFFF);
        // nextMenu.setVisible(false);
        // nextMenu.text = this.add.text();
        // nextMenu.text2 = this.add.text();
        var game = this;
     
        
        //Click interaction
         this.input.on('pointerdown', function(pointer){
            if (textInputBox.getBounds().contains(pointer.x,pointer.y) && textInputBox.visible){
                //Add Text to text box
                console.log("In the add text box");
                game.overlay();
            }
            if(wordBox.getBounds().contains(pointer.x,pointer.y) && wordBox.visible){
                //Play game/ Confirm Words
                game.scene.start("playGame",{dataArr: lines, currentLine: 0});
            }
            if(linkBox.getBounds().contains(pointer.x,pointer.y) && linkBox.visible){
                //EXPORT URL/COPY URL
                
                var words ="", descs = "";
                lines.forEach(x=>{
                    words+=x.word+",";
                    descs+=x.desc+",";
                });
                words=words.slice(0,-1);
                descs=descs.slice(0,-1);
                words=words.replace(/ /g,"_");
                descs=descs.replace(/ /g,"_");
                var urlAdd = window.location.hostname+window.location.pathname;
                urlAdd+="?word="+encodeURIComponent(words)+"&desc="+encodeURIComponent(descs);
                console.log("Url is: "+urlAdd);
                var copyText = document.getElementById("copyText");
                copyText.style.display = "block";
                copyText.value = urlAdd;
                copyText.select();
                copyText.setSelectionRange(0, 99999); /* For mobile devices */
                document.execCommand("copy");
                copyText.style.display = "none";
                alert("Copied the text: " + copyText.value);
            }
            if (fScreen.getBounds().contains(pointer.x,pointer.y)){
                //Full Screen Button
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
        }); 
    }
}