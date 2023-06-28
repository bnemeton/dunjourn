

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
    let floors = dungeon.split("X");
    // console.log(floors); // seems fine
    for (var i = 0; i < floors.length; i++) {
        let rows = floors[i].trim().split("\r\n");
        let levelArray = [];
        for (var j = 0; j < rows.length; j++) {
            let splitRow = [];
            for (var k = 0; k < rows[j].length; k++) {
                splitRow.push(rows[j][k]);
            }
            levelArray.push(splitRow);
        };
        dungeonArray.push(levelArray);
    };
    // console.log(dungeonArray)// this is fine/doesn't show the mirroring/rotation of the built level
    return dungeonArray;
}