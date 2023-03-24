writeValue = function (ctx, value, pos) {
    var scale = getScalingFactor(getCanvas(), getBackgroundImage());
    pos = { x: pos.x / scale.x, y: pos.y / scale.y };

    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, pos.x, pos.y);
    ctx.restore();
}

function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {

    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            context.fillText(lines[i], x, y + (lineNum * lineHeight));
            lineNum++;
        }
        var words = lines[i].split(' ');
        var idx = 1;
        while (words.length > 0 && idx <= words.length) {
            var str = words.slice(0, idx).join(' ');
            var w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineNum * lineHeight));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            context.fillText(words.join(' '), x, y + (lineNum * lineHeight));
            lineNum++;
        }

    }

}




function splitWordWrap(context, text, fitWidth) {
    // this was modified from the print version to only return the text array
    return_array = [];
    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            return_array.push(lines[i]);
            lineNum++;
        }
        var words = lines[i].split(' ');
        var idx = 1;
        while (words.length > 0 && idx <= words.length) {
            var str = words.slice(0, idx).join(' ');
            var w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                return_array.push(words.slice(0, idx - 1).join(' '));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            return_array.push(words.join(' '));
            lineNum++;
        }

    }
    return return_array;
}



getScalingFactor = function (canvas, warcryCardOne) {
    return {
        x: canvas.width / warcryCardOne.width,
        y: canvas.height / warcryCardOne.height
    };
}

getCanvas = function () {
    return document.getElementById("canvas");
}

getContext = function () {
    return getCanvas().getContext("2d");
}

getBackgroundImage = function () {
    return document.getElementById('bg1');
}

drawBackground = function () {
    getContext().drawImage(
        getBackgroundImage(), 0, 0, getCanvas().width, getCanvas().height);
}

scalePixelPosition = function (pixelPosition) {
    var scalingFactor = getScalingFactor(getCanvas(), getBackgroundImage());
    var scaledPosition = { x: pixelPosition.x * scalingFactor.x, y: pixelPosition.y * scalingFactor.y };
    return scaledPosition;
}

writeScaled = function (value, pixelPos) {
    var scaledPos = scalePixelPosition(pixelPos);
    writeValue(getContext(), value, scaledPos);
}

drawCardElementFromInput = function (inputElement, pixelPosition) {
    var value = inputElement.value;
    writeScaled(value, pixelPosition);
}

drawCardElementFromInputId = function (inputId, pixelPosition) {
    drawCardElementFromInput(document.getElementById(inputId), pixelPosition);
}

drawCardName = function (value) {
    getContext().font = '80px compacta-std'
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    writeScaled(value, { x: 72 +4, y: 85+4 });
    getContext().fillStyle = 'white';
    writeScaled(value, { x: 72, y: 85 });
}

drawCardCost = function (value) {
    getContext().font = '100px compacta-std'
    getContext().fillStyle = 'black';
    getContext().textAlign = "right";
    getContext().textBaseline = "middle";
    writeScaled(value, { x: 1050 +4, y: 90+4 });
    getContext().fillStyle = 'white';
    writeScaled(value, { x: 1050, y: 90 });
}


drawFooter = function (value) {
    getContext().drawImage(document.getElementById('frame_3'), 0, 0, getCanvas().width, getCanvas().height);

    getContext().font = 'bold 20px franklin-gothic-book';
    getContext().fillStyle = '#eb4a04';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    // We want the first part of this in orange,
    // then every part after the first command should be black.
    // so we split by commas
    footerSplit = value.split(',');
    x_value = 85;
    for(textIndex in footerSplit){
        if(textIndex > 0){
            getContext().fillStyle = 'Black';
        }
        // add back in the missing commas but not if the last part
        lastElement = footerSplit.length - 1;       
        if (textIndex < footerSplit.length - 1){
            textValue = footerSplit[textIndex] + ",";
        } else {
            textValue = footerSplit[textIndex];
        }
        // Write the actual text
        writeScaled(textValue, { x: x_value, y: 735 });
        // Adjust the x variable by the size of the text
        x_value = x_value + getTextWidth(textValue, getContext().font);
    }
    
}

drawWeapons = function(fighterData){

    xValue = fighterData.weaponOffsetX;
    yValue = fighterData.weaponOffsetY;

    getContext().drawImage(document.getElementById('frame_2a'), xValue + 0, yValue + 0, getCanvas().width, getCanvas().height);
    
    if(fighterData.weaponblock2Enabled){
        getContext().drawImage(document.getElementById('frame_2b'), xValue + 0, yValue + 0, getCanvas().width, getCanvas().height);
    }

    if(fighterData.weapon1Icon){
        getContext().drawImage(document.getElementById('melee'), xValue+90, yValue+370, 60, 60);
    } else {
        getContext().drawImage(document.getElementById('ranged'), xValue+90, yValue+370, 60, 60);
    }
    if(fighterData.weaponblock2Enabled){
        if(fighterData.weapon2Icon){
            getContext().drawImage(document.getElementById('melee'), xValue+90, yValue+470, 60, 60);
        } else {
            getContext().drawImage(document.getElementById('ranged'), xValue+90, yValue+470, 60, 60);
        }
    }
    
  
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";

    // Weapon Title
    textValue = "Weapons:";
    getContext().font = 'bold 36px franklin-gothic-book';
    
    // Shadow
    //getContext().fillStyle = 'black';
    //writeScaled(textValue, { x: 70-1, y: 360 });
    //writeScaled(textValue, { x: 70, y: 360-1});
    //writeScaled(textValue, { x: 70+1, y: 360 });
    //writeScaled(textValue, { x: 70, y: 360+1});


    getContext().fillStyle = 'black';
    writeValue(getContext(), textValue, { x: xValue + 90, y: yValue + 330 });

    // Weapon stats header
    getContext().fillStyle = 'black';
    getContext().font = '60px compacta-std';
    textValue = "A    BS/WS    D";
    writeValue(getContext(), textValue, { x: xValue + 400, y: yValue + 330 });
    
    // Weapon Numbers
    getContext().font = 'bold 36px franklin-gothic-book';
    textValue = fighterData.weapon1A + "       " + fighterData.weapon1S + "+     " + fighterData.weapon1Hit + "/" + fighterData.weapon1Crit;
    writeValue(getContext(), textValue, { x: xValue + 400, y: yValue + 390 });
    if(fighterData.weaponblock2Enabled){
        textValue = fighterData.weapon2A + "       " + fighterData.weapon2S + "+     " + fighterData.weapon2Hit + "/" + fighterData.weapon2Crit;
        writeValue(getContext(), textValue, { x: xValue + 400, y: yValue + 490 });
    }

    // Weapon Names
    getContext().font = 'bold 32px franklin-gothic-book';
    textValue = fighterData.weapon1Name;
    writeValue(getContext(), textValue, { x: xValue + 155, y: yValue + 390 });
    if(fighterData.weaponblock2Enabled){
        textValue = fighterData.weapon2Name;
        writeValue(getContext(), textValue, { x: xValue + 155, y: yValue + 490 });
    }

    // Weapon subtext
    getContext().font = '28px franklin-gothic-book';
    textValue = fighterData.weapon1Text;
    writeValue(getContext(), textValue, { x: xValue + 155, y: yValue + 430 });
    if(fighterData.weaponblock2Enabled){
        textValue = fighterData.weapon2Text;
        writeValue(getContext(), textValue, { x: xValue + 155, y: yValue + 525 });
    }    
}

drawCardText = function (value) {

    getContext().font = '32px franklin-gothic-book';
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";

    lineHeight = 32;
    fitWidth = 575;

    // Trying to get a bold and italic check going
    text_array = (splitWordWrap(getContext(), value, fitWidth));

    for (line in text_array) {       
        getContext().fillText(text_array[line], 90, 640 + (line * lineHeight));
    }

    
}


function getLabel(element) {
    return $(element).prop("labels")[0];
}

function getImage(element) {
    return $(element).find("img")[0];
}

function getSelectedRunemark(radioDiv) {
    var checked = $(radioDiv).find('input:checked');
    if (checked.length > 0) {
        return getImage(getLabel(checked[0])).getAttribute("src");
    }
    return null;
}

function setSelectedRunemark(radioDiv, runemark, radioGroupName, bgColor) {
    // uncheck all
    {
        var checked = $(radioDiv).find('input:checked');
        for (var i = 0; i < checked.length; i++) {
            checked[i].checked = false;
        }
        var icons = $(radioDiv).find('img');
        for (var i = 0; i < icons.length; i++) {
            icons[i].style.backgroundColor = bgColor;
        }
    }

    if (runemark != null) {
        var queryString = "img[src='" + runemark + "']";
        var img = $(radioDiv).find(queryString);
        if (img.length > 0) {
            var radioButton = $(img[0].parentNode.parentNode).find("input")[0];
            radioButton.checked = true;
            // img[0].style.backgroundColor = "tomato";
            img[0].style.backgroundColor = "#00bc8c";
        }
        else {
            var newDiv =
                addToImageRadioSelector(
                    runemark,
                    radioDiv,
                    radioGroupName,
                    bgColor);
            // $(newDiv).find("img")[0].style.backgroundColor = "tomato";
            $(newDiv).find("img")[0].style.backgroundColor = "#00bc8c";
            $(newDiv).find("input")[0].checked = true;
        }
    }
}



function drawImage(scaledPosition, scaledSize, image) {
    if (image != null) {
        if (image.complete) {
            getContext().drawImage(image, scaledPosition.x, scaledPosition.y, scaledSize.x, scaledSize.y);
        }
        else {
            image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        }
    }
}

function drawImageSrc(scaledPosition, scaledSize, imageSrc) {
    if (imageSrc != null) {
        var image = new Image();
        image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        image.src = imageSrc;
    }
}


function drawModel(imageUrl, imageProps) {
    if (imageUrl != null) {
        var image = new Image();
        image.onload = function () {
            var position = scalePixelPosition({ x: 590 + imageProps.offsetX, y: imageProps.offsetY });
            var scale = imageProps.scalePercent / 100.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);

            URL.revokeObjectURL(image.src);
        };
        image.src = imageUrl;
    }
}

function getName() {
    //var textInput = $("#saveNameInput")[0];
    return "killteam_Card";
}

function setName(name) {
    //var textInput = $("#saveNameInput")[0];
    //textInput.value = name;
}

function getModelImage() {
    var imageSelect = $("#imageSelect")[0];
    if (imageSelect.files.length > 0) {
        return URL.createObjectURL(imageSelect.files[0]);
    }
    return null;
}

function getFactionImage() {
    var imageSelect = $("#factionImageSelect")[0];
    if (imageSelect.files.length > 0) {
        return URL.createObjectURL(imageSelect.files[0]);
    }
    return null;
}

function setModelImage(image) {
    console.log("setModelImage:" + image);
    $("#fighterImageUrl")[0].value = image;
}

function setFactionImage(image) {
    console.log("setFactionImage:" + image);
    $("#factionImageUrl")[0].value = image;
}


function getDefaultModelImageProperties() {
    return {
        offsetX: 0,
        offsetY: 0,
        scalePercent: 100,
        opacity: 1
    };
}

function getModelImageProperties() {
    return {
        offsetX: $("#imageOffsetX")[0].valueAsNumber,
        offsetY: $("#imageOffsetY")[0].valueAsNumber,
        scalePercent: $("#imageScalePercent")[0].valueAsNumber,
        opacity: $("#imageOpacity")[0].valueAsNumber
    };
}

function getFactionImageProperties() {
    return {
        offsetX: $("#factionImageOffsetX")[0].valueAsNumber,
        offsetY: $("#factionImageOffsetY")[0].valueAsNumber,
        scalePercent: $("#factionImageScalePercent")[0].valueAsNumber,
        opacity: $("#factionImageOpacity")[0].valueAsNumber
    };
}

function setModelImageProperties(modelImageProperties) {
    $("#imageOffsetX")[0].value = modelImageProperties.offsetX;
    $("#imageOffsetY")[0].value = modelImageProperties.offsetY;
    $("#imageScalePercent")[0].value = modelImageProperties.scalePercent;
    $("#imageOpacity")[0].value = modelImageProperties.opacity;
}

function setFactionImageProperties(factionImageProperties) {
    $("#factionImageOffsetX")[0].value = factionImageProperties.offsetX;
    $("#factionImageOffsetY")[0].value = factionImageProperties.offsetY;
    $("#factionImageScalePercent")[0].value = factionImageProperties.scalePercent;
    $("#factionImageOpacity")[0].value = factionImageProperties.opacity;
}

function readControls() {
    var data = new Object;
    data.name = getName();
    data.imageUrl = getFighterImageUrl();
    data.imageProperties = getModelImageProperties();
    data.factionImageUrl = getFactionImageUrl();
    data.factionImageProperties = getFactionImageProperties();
    data.cardName = document.getElementById("cardName").value;
    data.footer = document.getElementById("footer").value;
    data.cardText = document.getElementById("cardText").value;
    data.cardCost = document.getElementById("cardCost").value;
    data.largeCardText = document.getElementById("largeCardText").value;
    data.largeCardFontSize = document.getElementById("largeCardFontSize").value;
    
    data.statblockEnabled = document.getElementById("statblockEnabled").checked;
    data.weaponblockEnabled = document.getElementById("weaponblockEnabled").checked;
    data.weaponblock2Enabled = document.getElementById("weaponblock2Enabled").checked;
    data.footerblockEnabled = document.getElementById("footerblockEnabled").checked;
    data.abilityblockEnabled = document.getElementById("abilityblockEnabled").checked;
    data.largecardEnabled = document.getElementById("largecardEnabled").checked;
    data.largerCardEnabled = document.getElementById("largerCardEnabled").checked;
    
    data.ma = document.getElementById("ma").value;
    data.st = document.getElementById("st").value;
    data.ag = document.getElementById("ag").value;
    data.pa = document.getElementById("pa").value;
    data.av = document.getElementById("av").value;
    data.wounds = document.getElementById("wounds").value;
    
    data.weapon1Name = document.getElementById("weapon1Name").value;
    data.weapon1Text = document.getElementById("weapon1Text").value;
    data.weapon1A = document.getElementById("weapon1A").value;
    data.weapon1S = document.getElementById("weapon1S").value;
    data.weapon1Hit = document.getElementById("weapon1Hit").value;
    data.weapon1Crit = document.getElementById("weapon1Crit").value;
    data.weapon1Icon = document.getElementById("weapon1Icon").checked;  
    data.weapon2Name = document.getElementById("weapon2Name").value;
    data.weapon2Text = document.getElementById("weapon2Text").value;
    data.weapon2A = document.getElementById("weapon2A").value;
    data.weapon2S = document.getElementById("weapon2S").value;
    data.weapon2Hit = document.getElementById("weapon2Hit").value;
    data.weapon2Crit = document.getElementById("weapon2Crit").value;
    data.weapon2Icon = document.getElementById("weapon2Icon").checked;
    data.weaponOffsetX = document.getElementById("weaponOffsetX").valueAsNumber;
    data.weaponOffsetY = document.getElementById("weaponOffsetY").valueAsNumber;
    

    return data;
}

function drawAbilities(fighterData){
    
    getContext().drawImage(document.getElementById('frame_5'), 0, 0, getCanvas().width, getCanvas().height);
    getContext().font = 'bold 36px franklin-gothic-book';
    getContext().fillStyle = 'Black';
    textValue = "Abilities: ";
    writeScaled(textValue, { x: 90, y: 595 });
    drawCardText(fighterData.cardText);


}

function drawLargeCard(fighterData){
    
    if(fighterData.largerCardEnabled){
        getContext().drawImage(document.getElementById('frame_4b'), 0, 0, getCanvas().width, getCanvas().height);    
        fitWidth = 880;
    } else {
        getContext().drawImage(document.getElementById('frame_4'), 0, 0, getCanvas().width, getCanvas().height);
        fitWidth = 580;
    }
    

    getContext().font = '32px franklin-gothic-book';
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";

    font_size = fighterData.largeCardFontSize;
    lineHeight = font_size;
    getContext().font = font_size + 'px franklin-gothic-book';

    // Trying to get a bold and italic check going
    text_array = (splitWordWrap(getContext(), fighterData.largeCardText, fitWidth));

    for (line in text_array) {
        
        if (text_array[line].startsWith("**")) {
            printText = text_array[line].replace("**", '');
            getContext().fillStyle = '#eb4a04';
            getContext().font = 'bold ' + font_size + 'px franklin-gothic-book';;
            getContext().fillText(printText, 90, 160 + (line * lineHeight));
            getContext().font = font_size + 'px franklin-gothic-book';
            getContext().fillStyle = 'black';
        } else {
            getContext().font = font_size + 'px franklin-gothic-book';
            getContext().fillText(text_array[line], 90, 160 + (line * lineHeight));
        }
    }
    drawCardCost(fighterData.cardCost);
}


function drawStatsFrame(fighterData){
    getContext().drawImage(document.getElementById('frame_1'), 0, 0, getCanvas().width, getCanvas().height);
    // MA
    drawNumber("M:" + fighterData.ma, 90, 170, false);
    getContext().drawImage(document.getElementById('range_circle'), 170, 135, 70, 70);
    // ST
    drawNumber("APL:" + fighterData.st, 250, 170, false);
    // AG
    drawNumber(" GA:" + fighterData.ag, 380, 170, true);
    // PA
    drawNumber(" DF:" + fighterData.pa, 80, 250, true);
    //AV
    drawNumber("SV:" + fighterData.av + "+", 210, 250, true);
    // MADE UP ONE
    drawNumber("W:" + fighterData.wounds, 350, 250, true);
}

drawFrames = function (fighterData) {
    drawCardName(fighterData.cardName);
    if(fighterData.largecardEnabled){
        drawLargeCard(fighterData);
    };
    if(fighterData.statblockEnabled){
        drawStatsFrame(fighterData);
    };
    if(fighterData.footerblockEnabled){
        drawFooter(fighterData.footer);
    };

    if(fighterData.abilityblockEnabled){
        drawAbilities(fighterData);
    };

    if(fighterData.weaponblockEnabled){
        drawWeapons(fighterData);
    };
    getContext().drawImage(document.getElementById('border'), 0, 0, getCanvas().width, getCanvas().height);  

 }


render = function (fighterData) {
    // since we regularly draw this is a good spot for error checking
    console.log("Render:");
    console.log(fighterData);
    // First the textured background
    getContext().drawImage(document.getElementById('bg1'), 0, 0, getCanvas().width, getCanvas().height);  


    if (fighterData.factionImageUrl) {
        var image = new Image();
        image.onload = function () {
            var position = scalePixelPosition({ x: 600 + fighterData.factionImageProperties.offsetX, y: fighterData.factionImageProperties.offsetY });
            var scale = fighterData.factionImageProperties.scalePercent / 50.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().globalAlpha = fighterData.factionImageProperties.opacity;           
            getContext().drawImage(image, position.x, position.y, width, height);
            getContext().globalAlpha = 1;
            drawFrames(fighterData);
        }
        image.src = fighterData.factionImageUrl;
    }   
    
    if (fighterData.imageUrl) {
        var image2 = new Image();
        image2.onload = function () {
            var position = scalePixelPosition({ x: 600 + fighterData.imageProperties.offsetX, y: fighterData.imageProperties.offsetY });
            var scale = fighterData.imageProperties.scalePercent / 50.0;
            var width = image2.width * scale;
            var height = image2.height * scale;
            getContext().globalAlpha = fighterData.imageProperties.opacity;           
            getContext().drawImage(image2, position.x, position.y, width, height);
            getContext().globalAlpha = 1;
            drawFrames(fighterData);
        }
        image2.src = fighterData.imageUrl;
    }
    // next the frame elements
    drawFrames(fighterData);
}

function drawNumber(num,x, y, plus){

        getContext().font = '80px compacta-std'
    
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    writeScaled(num, { x: x, y: y });

}

async function writeControls(fighterData) {

    setName(fighterData.name);

    // here we check for base64 loaded image and convert it back to imageUrl
    if (fighterData.base64Image != null) {
        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(fighterData.base64Image);
        // then create URL object
        fighterData.imageUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        fighterData.base64Image = null;
    } else {
        fighterData.imageUrl = null;
    }
    setModelImage(fighterData.imageUrl);
    setModelImageProperties(fighterData.imageProperties);

    // same again but for the faction image
    if (fighterData.base64FactionImage != null) {
        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(fighterData.base64FactionImage);
        // then create URL object
        fighterData.factionImageUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        fighterData.base64FactionImage = null;
    } else {
        fighterData.factionImageUrl = null;
    }
    setFactionImage(fighterData.factionImageUrl);
    setFactionImageProperties(fighterData.factionImageProperties);

    
    $("#cardName")[0].value = fighterData.cardName;
    $("#footer")[0].value = fighterData.footer;
    
    $("#statblockEnabled")[0].checked = fighterData.statblockEnabled;
    $("#weaponblockEnabled")[0].checked = fighterData.weaponblockEnabled;
    $("#weaponblock2Enabled")[0].checked = fighterData.weaponblock2Enabled;
    $("#footerblockEnabled")[0].checked = fighterData.footerblockEnabled;
    $("#abilityblockEnabled")[0].checked = fighterData.abilityblockEnabled;
    $("#largecardEnabled")[0].checked = fighterData.largecardEnabled;
    $("#largerCardEnabled")[0].checked = fighterData.largerCardEnabled;
    
    $("#ma")[0].value = fighterData.ma;
    $("#st")[0].value = fighterData.st;
    $("#ag")[0].value = fighterData.ag;
    $("#pa")[0].value = fighterData.pa;
    $("#av")[0].value = fighterData.av;
    $("#wounds")[0].value = fighterData.wounds;
    $("#cardText")[0].value = fighterData.cardText;
    $("#cardCost")[0].value = fighterData.cardCost;
    $("#largeCardText")[0].value = fighterData.largeCardText;
    $("#largeCardFontSize")[0].value = fighterData.largeCardFontSize;
    

    $("#weapon1Name")[0].value = fighterData.weapon1Name;
    $("#weapon1Text")[0].value = fighterData.weapon1Text;
    $("#weapon1A")[0].value = fighterData.weapon1A;
    $("#weapon1S")[0].value = fighterData.weapon1S;
    $("#weapon1Hit")[0].value = fighterData.weapon1Hit;
    $("#weapon1Crit")[0].value = fighterData.weapon1Crit;
    $("#weapon1Icon")[0].checked = fighterData.weapon1Icon;
    $("#weapon2Name")[0].value = fighterData.weapon2Name;
    $("#weapon2Text")[0].value = fighterData.weapon2Text;
    $("#weapon2A")[0].value = fighterData.weapon2A;
    $("#weapon2S")[0].value = fighterData.weapon2S;
    $("#weapon2Hit")[0].value = fighterData.weapon2Hit;
    $("#weapon2Crit")[0].value = fighterData.weapon2Crit;
    $("#weapon2Icon")[0].checked = fighterData.weapon2Icon;
    $("#weaponOffsetX")[0].value = fighterData.weaponOffsetX;
    $("#weaponOffsetY")[0].value = fighterData.weaponOffsetY;


    // render the updated info
    render(fighterData);
    
}

function defaultFighterData() {
    var fighterData = new Object;
    fighterData.name = "killteam_Card";
    fighterData.cardName = "Card Name";
    fighterData.footer = "Kill Team Name, Operative Traits";
    fighterData.cardText = "Body Text";
    fighterData.cardCost = " ";
    fighterData.largeCardText = "Body Text";
    fighterData.largeCardFontSize = 40;
    
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();
    fighterData.factionImageUrl = null;
    fighterData.factionImageProperties = getDefaultModelImageProperties();
    

    fighterData.statblockEnabled = true;
    fighterData.weaponblockEnabled = true;
    fighterData.weaponblock2Enabled = true;
    fighterData.footerblockEnabled = true;
    fighterData.abilityblockEnabled = true;
    fighterData.largecardEnabled = false;
    fighterData.largerCardEnabled = false;

    fighterData.ma = 4;
    fighterData.st = 4;
    fighterData.ag = 3;
    fighterData.pa = 3;
    fighterData.av = 9;
    fighterData.wounds = 12;
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();

    fighterData.factionImageUrl = null;
    fighterData.factionImageProperties = getDefaultModelImageProperties();
   
    fighterData.weapon1Name = "Ranged Weapon";
    fighterData.weapon1Text = "-";
    fighterData.weapon1A = 3;
    fighterData.weapon1S = 3;
    fighterData.weapon1Hit = 2;
    fighterData.weapon1Crit = 3;
    fighterData.weapon1Icon = false;
    fighterData.weapon2Name = "Melee Weapon";
    fighterData.weapon2Text = "-";
    fighterData.weapon2A = 3;
    fighterData.weapon2S = 3;
    fighterData.weapon2Hit = 2;
    fighterData.weapon2Crit = 3;
    fighterData.weapon2Icon = true;
    fighterData.weaponOffsetX = 0;
    fighterData.weaponOffsetY = 0;


    return fighterData;
}

function saveFighterDataMap(newMap) {
    window.localStorage.setItem("fighterDataMap", JSON.stringify(newMap));
}

function loadFighterDataMap() {
    var storage = window.localStorage.getItem("fighterDataMap");
    if (storage != null) {
        return JSON.parse(storage);
    }
    // Set up the map.
    var map = new Object;
    map["killteam_Card"] = defaultFighterData();
    saveFighterDataMap(map);
    return map;
}

function loadLatestFighterData() {
    var latestCardName = window.localStorage.getItem("latestCardName");
    if (latestCardName == null) {
        latestCardName = "killteam_Card";
    }

    console.log("Loading '" + latestCardName + "'...");

    var data = loadFighterData(latestCardName);

    if (data) {
        console.log("Loaded data:");
        console.log(data);
    }
    else {
        console.log("Failed to load data, loading defaults.");
        data = defaultFighterData();
    }

    return data;
}

function saveLatestFighterData() {
    var fighterData = readControls();
    if (!fighterData.name) {
        return;
    }

    window.localStorage.setItem("latestCardName", fighterData.name);
    //saveFighterData(fighterData);
}

function loadFighterData(fighterDataName) {
    if (!fighterDataName) {
        return null;
    }

    var map = loadFighterDataMap();
    if (map[fighterDataName]) {
        return map[fighterDataName];
    }

    return null;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

function onload2promise(obj) {
    return new Promise((resolve, reject) => {
        obj.onload = () => resolve(obj);
        obj.onerror = reject;
    });
}

async function getBase64ImgFromUrl(imgUrl) {
    let img = new Image();
    let imgpromise = onload2promise(img); // see comment of T S why you should do it this way.
    img.src = imgUrl;
    await imgpromise;
    var imgData = getBase64Image(img);
    return imgData;
}

async function handleImageUrlFromDisk(imageUrl) {
    if (imageUrl &&
        imageUrl.startsWith("blob:")) {
        // The image was loaded from disk. So we can load it later, we need to stringify it.
        imageUrl = await getBase64ImgFromUrl(imageUrl);
    }

    return imageUrl;
}

async function saveFighterData(fighterData) {
    var finishSaving = function () {
        var map = loadFighterDataMap();
        map[fighterData.name] = fighterData;
        window.localStorage.setItem("fighterDataMap", JSON.stringify(map));
    };

    if (fighterData != null &&
        fighterData.name) {
        // handle images we may have loaded from disk...
        fighterData.imageUrl = await handleImageUrlFromDisk(fighterData.imageUrl);

        finishSaving();
    }
}

function getLatestFighterDataName() {
    return "latestFighterData";
}

window.onload = function () {
    //window.localStorage.clear();
    var fighterData = loadLatestFighterData();
    writeControls(fighterData);
    refreshSaveSlots();
}

onAnyChange = function () {
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}



onWeaponRunemarkFileSelect = function (input, weaponName) {
    var grid = $(input.parentNode).find("#weaponRunemarkSelect")[0];

    for (i = 0; i < input.files.length; i++) {
        addToImageRadioSelector(URL.createObjectURL(input.files[i]), grid, weaponName, "white");
    }
}

function addToImageCheckboxSelector(imgSrc, grid, bgColor) {
    var div = document.createElement('div');
    div.setAttribute('class', 'mr-0');
    div.innerHTML = `
    <label for="checkbox-${imgSrc}">
        <img src="${imgSrc}" width="50" height="50" alt="" style="background-color:${bgColor};">
    </label>
    <input type="checkbox" style="display:none;" id="checkbox-${imgSrc}" onchange="onTagRunemarkSelectionChanged(this, '${bgColor}')">
    `;
    grid.appendChild(div);
    return div;
}

function onClearCache() {
    window.localStorage.clear();
    location.reload();
    return false;
}

function onResetToDefault() {
    var fighterData = defaultFighterData();
    writeControls(fighterData);
}

function refreshSaveSlots() {
    // Remove all
    $('select').children('option').remove();

    var fighterDataName = readControls().name;

    var map = loadFighterDataMap();

    for (let [key, value] of Object.entries(map)) {
        var selected = false;
        if (fighterDataName &&
            key == fighterDataName) {
            selected = true;
        }
        var newOption = new Option(key, key, selected, selected);
        $('#saveSlotsSelect').append(newOption);
    }
}

async function onSaveClicked() {
    data = readControls();
    // temp null while I work out image saving
    console.log(data);
    data.base64Image = await handleImageUrlFromDisk(data.imageUrl)
    data.base64FactionImage = await handleImageUrlFromDisk(data.factionImageUrl)

    // need to be explicit due to sub arrays
    var exportObj = JSON.stringify(data, ['name', 
    'imageUrl', 'imageProperties', 'offsetX', 'offsetY','scalePercent', 'opacity',
    'factionImageUrl', 'factionImageProperties', 'factionOffsetX', 'factionOffsetY','factionScalePercent', 'factionOpacity',
    'statblockEnabled', 'weaponblockEnabled', 'weaponblock2Enabled', 'footerblockEnabled', 'abilityblockEnabled', 'largecardEnabled', 'largerCardEnabled',
    'cardName', 'cardText', 'footer', 'ma', 'st', 'ag', 'pa', 'av', 'wounds', 'largeCardText', 'largeCardFontSize', 'cardCost',
    'weapon1Name', 'weapon1Text', 'weapon1A', 'weapon1S', 'weapon1Hit', 'weapon1Crit', 'weapon1Icon',
    'weapon2Name', 'weapon2Text', 'weapon2A', 'weapon2S', 'weapon2Hit', 'weapon2Crit', 'weapon2Icon', 'weaponOffsetX', 'weaponOffsetY',
    'base64Image', 'base64FactionImage'], 4);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "killteam_card_" + data.cardName.replace(/ /g, "_") + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveCardAsImage() {
    var element = document.createElement('a');
    data = readControls();
    element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
    element.setAttribute('download', "killteam_card_" + data.cardName + ".png");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

$(document).ready(function () {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    // ctx.stroke();
});

async function readJSONFile(file) {
    // Function will return a new Promise which will resolve or reject based on whether the JSON file is read and parsed successfully
    return new Promise((resolve, reject) => {
        // Define a FileReader Object to read the file
        let fileReader = new FileReader();
        // Specify what the FileReader should do on the successful read of a file
        fileReader.onload = event => {
            // If successfully read, resolve the Promise with JSON parsed contents of the file
            resolve(JSON.parse(event.target.result))
        };
        // If the file is not successfully read, reject with the error
        fileReader.onerror = error => reject(error);
        // Read from the file, which will kick-off the onload or onerror events defined above based on the outcome
        fileReader.readAsText(file);
    });
}

async function fileChange(file) {
    // Function to be triggered when file input changes
    // As readJSONFile is a promise, it must resolve before the contents can be read
    // in this case logged to the console

    var saveJson = function (json) {
        writeControls(json);
    };

    readJSONFile(file).then(json =>
        saveJson(json)
    );

}

onFighterImageUpload = function () {
    image = getModelImage();
    setModelImage(image);
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}

onFactionImageUpload = function () {
    image = getFactionImage();
    setFactionImage(image);
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}


function getFighterImageUrl() {
    var imageSelect = $("#fighterImageUrl")[0].value;
    return imageSelect;
}

function getFactionImageUrl() {
    var imageSelect = $("#factionImageUrl")[0].value;
    return imageSelect;
}

/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * 
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  * 
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  
  function getCssStyle(element, prop) {
      return window.getComputedStyle(element, null).getPropertyValue(prop);
  }
  
  function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
    
    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }

  function onWeaponControlsToggled(weaponCheckbox) {
    var controlsDiv = $(weaponCheckbox.parentNode).find("#weaponInputs")[0];
    controlsDiv.style.display = weaponCheckbox.checked ? "block" : "none";

    onAnyChange();
}