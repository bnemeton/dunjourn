
//rot13 provided string to decrypt it
function rot13(message) {
    return message.replace(/[a-z]/gi, letter => String.fromCharCode(letter.charCodeAt(0) + (letter.toLowerCase() <= 'm' ? 13 : -13)));
}

//parse dungeon string uploaded by user
function parseDungeon(input) {
    let file = input.files[0];
    let reader = new FileReader();
    
    reader.readAsText(file);
    reader.onload = function() {
        // console.log(reader.result); //works!
        if (file.name.startsWith('rot13')) {
        let rottenString = rot13(reader.result);
        loadDungeon(rottenString);
        } else {
        loadDungeon(reader.result);
        }
        reader.onerror = function() {
            console.log(reader.error);
        }
    }
}

loadDungeon = function(dungeonString) {
    //split string by SIGNS, CONTAINERS, BESTIARY, and VAULT
    // these cute cosmogonic messages don't actually display until you enter the playscreen rn which is no fun
    Game.message(`

    Sundering the heavens from the primordial waters...`)
    updateMessages();
    let signSplit = dungeonString.split("SIGNS");
    let containerSplit = signSplit[1].split("CONTAINERS");
    let bestiarySplit = containerSplit[1].split("BESTIARY");
    let vaultSplit = bestiarySplit[1].split("VAULT");
    let splitDungeonStrings = {
        map: signSplit[0],
        signs: containerSplit[0],
        containers: bestiarySplit[0],
        bestiary: vaultSplit[0],
        vault: vaultSplit[1]
    }
    Game.message(`
    
    Parting primordial waters and raising up the land...`)
    updateMessages();    
    // console.log(splitDungeonStrings); //works fine!
    Game.Dungeon.map = splitDungeonStrings.map.trim();

    //split signs by line and splice the first line
    let floorSigns = splitDungeonStrings.signs.trim().split("\r\n\r\n");
    // console.log(floorSigns);
    // signs.splice(0, 1);
    let cleanSigns = [];
    floorSigns.forEach(function(floor) {
        // console.log(floor)
        let signs = floor.trim().split("\r\n");
        // console.log(signs);
        cleanSigns.push(signs);
    })
    // console.log(cleanSigns); //whew, works
    Game.Dungeon.signs = cleanSigns;
    Game.message(`
    
    Inscribing the words of the ancients...`)
    updateMessages();

    // console.log(splitDungeonStrings.containers);
    //split containers by double linebreak to separate into containers
    let allContainers = splitDungeonStrings.containers.trim().split("\r\n\r\n");
    let cleanContainers = [];
    allContainers.forEach(function(container) {
        let cleanContainer = container.trim().split("\r\n");
        cleanContainers.push(cleanContainer);
    })
    // let containers = splitDungeonStrings.containers.trim().split("\r\n");
    // console.log(cleanContainers); //works
    Game.Dungeon.containers = cleanContainers;

    //split bestiary by - to separate into monsters
    let bestiary = splitDungeonStrings.bestiary.trim().split("-");
    bestiary.splice(0, 1);
    // console.log(bestiary); //works
    let cleanBestiary = {};
    bestiary.forEach(function(monster) {
        //split by linebreaks
        let trimmedMonster = monster.trim().split("\r\n");
        // console.log(trimmedMonster)
        for (let i = 0; i < trimmedMonster.length; i++) {
            trimmedMonster[i] = trimmedMonster[i].trim();
            //if i=0, then it's the name of the monster
            if (i === 0) {
                //clean the name of the ": "
                trimmedMonster[i] = trimmedMonster[i].split(":")[0];
                // console.log(trimmedMonster[i]);
                cleanBestiary[trimmedMonster[i]] = {
                    name: trimmedMonster[i],
                };
            }
            //if i>0, split the line by ": " to get the key and value
            else {
                let keyValuePair = trimmedMonster[i].split(": ");
                // console.log(keyValuePair);
                if (keyValuePair[0] === "loot") {
                    let lootTableData = keyValuePair[1].split(", ");
                    let lootTable = [];
                    lootTableData.forEach(function(loot) {
                        let lootData = loot.split("*");
                        let lootName = lootData[0];
                        let lootChance = lootData[1];
                        lootTable.push({name: lootName, chance: lootChance});
                    })
                    keyValuePair[1] = lootTable;
                }
                // console.log(keyValuePair);
                cleanBestiary[trimmedMonster[0]][keyValuePair[0]] = keyValuePair[1];
            }
        }
    })
    // console.log(cleanBestiary); //works
    Game.Dungeon.bestiary = cleanBestiary;
    Game.message(`

    Breathing life into the beasts of the field...`)
    updateMessages();
    //split vault by - to separate into items
    let vault = splitDungeonStrings.vault.trim().split("-");
    // console.log(vault); //works
    vault.splice(0, 1);
    let cleanVault = {};
    vault.forEach(function(item) {
        //split by linebreaks
        let trimmedItem = item.trim().split("\r\n");
        // console.log(trimmedItem)
        for (let i = 0; i < trimmedItem.length; i++) {
            trimmedItem[i] = trimmedItem[i].trim();
            //if i=0, then it's the name of the item
            if (i === 0) {
                //clean the name of the ": "
                trimmedItem[i] = trimmedItem[i].split(":")[0];
                
                cleanVault[trimmedItem[i]] = {
                    name: trimmedItem[i],
                };
            }
            //if i>0, split the line by ": " to get the key and value
            else {
                let keyValuePair = trimmedItem[i].split(": ");
                //if key is tags, split value by ", " to get array of tags
                if (keyValuePair[0] === "tags") {
                    let tags = keyValuePair[1].split(", ");
                    keyValuePair[1] = tags;
                }
                // console.log(keyValuePair);
                cleanVault[trimmedItem[0]][keyValuePair[0]] = keyValuePair[1];
            }
        }
    }
    )
    // console.log(cleanVault); //works
    Game.Dungeon.vault = cleanVault;
    Game.message(`

    Filling the caverns with treasures...`)
    updateMessages();
    // console.log(Game.Dungeon); //looks fine, not sure what's wrong with the builder
}