

// var readLevel = function (level) {
//     var fr = new FileReader();
//     fr.onload = function () {
//         return fr.readAsText(level);
//     }
// };

//function to split text file into array of rows, each of which is a row of characters
var splitLevel = function (level) {
    // var levelText = readLevel(level);
    let levelArray = [];
    var rows = level.split("\n");
    for (var i = 0; i < rows.length; i++) {
        let splitRow = [];
        for (var j = 0; j < rows[i].length; j++) {
            splitRow.push(rows[i][j]);
        }
        levelArray.push(splitRow);
    };
    // console.log(levelArray);
    let dungeonArray = [levelArray]
    return dungeonArray;
}