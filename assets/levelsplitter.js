

// var readLevel = function (level) {
//     var fr = new FileReader();
//     fr.onload = function () {
//         return fr.readAsText(level);
//     }
// };

//function to split text file into array of rows, each of which is a row of characters
var splitLevel = function (dungeon) {
    // var levelText = readLevel(level);
    let dungeonArray = [];
    let dungeonKeys = [];
    let floors = dungeon.split("X");
    // console.log(floors); // seems fine
    for (var i = 0; i < floors.length; i++) {
        let rows = floors[i].trim().split("\r\n");
        let levelArray = [];
        for (var j = 0; j < rows.length; j++) {
            let row = rows[j];
            let splitRow = [];
            for (var k = 0; k < row.length; k++) {
                if (row[k] == "(") {
                    //let keystring be the string between the parentheses
                    let keystring = row.slice(k + 1, row.indexOf(')'));
                    // let keystring = row.slice(k, row.indexOf('/)'))[1];
                    console.log(keystring);
                    dungeonKeys.push({
                        keystring: keystring,
                        x: k-1,
                        y: j,
                        z: i
                    });
                    row = row.slice(0, k) + row.slice(k + keystring.length + 2);
                }
                splitRow.push(row[k]);
            }
            levelArray.push(splitRow);
        };
        dungeonArray.push(levelArray);
    };
    // console.log(dungeonArray)// this is fine/doesn't show the mirroring/rotation of the built level
    return {map: dungeonArray, keys: dungeonKeys};
}