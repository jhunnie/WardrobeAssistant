function listContains(list, sublist){
    for (var element in sublist){
        if (! list.contains(element)){
            return false;
        }
    }
    return true;
}

function descriptionGenerator(articleDictionary){
    var result = "";
    if (articleDictionary.tags.length != 0){
        result += articleDictionary.tags[0] + " "
    }
    result += articleDictionary.color + " " + articleDictionary.type
    return result;
}

function filterByValue(dataset, valueType, valueList){
    var result = [];
    for (var article in dataset){
        if (listContains(article.valueType, valueList)){
            result.push(article);
        }
    }
    return result;
}

function getRandomPiece(dataset){
    var result;
    if (dataset.length !==0){
        result = dataset[Math.floor(Math.random()*(dataset.length - 1))];
    }
    return descriptionGenerator(result);
}

function generateFootWear(shoeSource){
    var result = "FootWear : ";
    result += getRandomPiece(shoeSource) + "\n";
    return result;
}

function generateCoat(coatSource, season){
    var result = "Coat : ";
    if (typeof season === "undefined" || season == "spring" || season == "fall"){
        var num = Math.floor(Math.random());
        if (num == 0){
            result += "No coat today! \n";
        }
        else{
            result += getRandomPiece(coatSource) + "\n"
        }
        
    }
    else if (season == "summer"){
        result += "Too warm! \n";
    }
    else if (season == "winter"){
        result += getRandomPiece(coatSource) + "\n"
    }
    return result;
    }

function generateTopBottom(topSource, bottomSource){
    var result = "Top : ";
    result += getRandomPiece(topSource) + "\n Bottom : " + getRandomPiece(bottomSource) + "\n";
    return result;
}

function generateOp(opSource){
    var result = "Body Wear : ";
    result += getRandomPiece(opSource) + "\n";
    return result;
}

function generateBodyWear(topSource, bottomSource, opSource, season, numOfArticles){

    if ((typeof numOfArticles !== "undefined" && (typeof season == "undefined" || season !="winter"))){
        var num = Math.floor(Math.random()+1);
        if (num == 2){
            getTopBottom(topSource, bottomSource);
        }
        else if (num == 1){
            generateOp(opSource);
        }
    }
    else if (numOfArticles == 2 || season == "winter"){
            getTopBottom(topSource, bottomSource);
        }
    else if (numOfArticles == 1){
            generateOp(opSource);
        }

}

function generateOutfit(dataset, colorList, styleList, season, numOfArticles){
    var result = "";
    var colorFiltered = filterByValue(dataset, "color", colorList);
    var filtered = filterByValue(colorFiltered, "tags", styleList);
    var shoeSource = filterByValue(filtered, "category", ["shoes"]);
    var coatSource = filterByValue(filtered, "category", ["coat"]);
    var topSource = filterByValue(filtered, "category", ["top"]);
    var bottomSource = filterByValue(filtered, "category", ["bottom"]);
    var opSource = filterByValue(filtered, "category", ["one piece"]);
    result += generateBodyWear(topSource, bottomSource, opSource, season, numOfArticles) + 
    generateCoat(coatSource, season) + generateFootWear(shoeSource);

    return result;
    
}