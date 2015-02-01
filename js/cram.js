/*
var board = createBoard({
    title       : 'Cram',
    rows        : 6,
    columns     : 10,
    pattern     : 'grid',
})
*/


$(function() {
   
    if (window.devicePixelRatio && devicePixelRatio >= 2) {
      var testElem = document.createElement('div');
      testElem.style.border = '.5px solid transparent';
      document.body.appendChild(testElem);
      //alert(testElem.offsetHeight)
      if (testElem.offsetHeight == 1)
      {
        document.querySelector('html').classList.add('hairlines');
      }
      document.body.removeChild(testElem);
    } 

    var columns = 10; rows = 6;
    $('#box').append(Bord.init({
        id              : 'cram-board',
        size            : 'full-size', 
        columns         : columns,
        rows            : rows,
        backgroundColor : 'white', 
        onSquareClicked : function(boardOptions, col, row) {
            alert(col + ':' + row);
        },
        /*
        onSquareTouchStart    : function(boardOptions, column, row) {
            console.log('touchstart: ' + column + ':' + row);
             
            lastTouch.row = row
            lastTouch.column = column
        },
        */
        onSquareTouchMove      : function(boardOptions, column, row) {
            if (isEnabled && areOrthogonallyAdjacent({row: row, column: column}, lastTouch) && areEmpty({row: row, column: column}, lastTouch)) {
                Bord.setSquareAtColumnRowColor(lastTouch.column, lastTouch.row, isPlayer1Turn)
                Bord.setSquareAtColumnRowColor(column, row, isPlayer1Turn)
                lastTouch = {}
                isEnabled = false
                //board.cancelMovement()
                if (isEndGame() ) {
                    var playerMsg = isPlayer1Turn ? "First player won!" : "Second player won!";
                    alert(playerMsg)
                }
                isPlayer1Turn = !isPlayer1Turn
            } else {
                lastTouch.row = row
                lastTouch.column = column
            }
            console.log('touchend: ' + column + ':' + row);
        },
        onSquareTouchEnd:       function(boardOptions, column, row) {
            isEnabled = true;
        }
    }));
    
    window.addEventListener('orientationchange', function() {
        handleOrientationChange();
    }, false); 

    function handleOrientationChange() {
        var $box = $('#box');
        if (window.innerHeight > window.innerWidth){
            $box.css('height', $box.width() * (rows / columns));
        } else {
            $box.css('width', $box.height() * (columns * rows))
        }
    }

    handleOrientationChange();
    
    //alert(window.devicePixelRatio)
    //alert(window.navigator.standalone);

});

var lastTouch = {}
var isEnabled = true
var isPlayer1Turn = true


function areOrthogonallyAdjacent(point1, point2) {
    if (
        !((point1.column == point2.column) && (point1.row == point2.row)) && // Not the same point.
        (
            ((point1.column == point2.column) && ((point1.row == point2.row + 1) || (point1.row == point2.row - 1))) || // Above or below.
            ((point1.row == point2.row) && ((point1.column == point2.column + 1) || (point1.column == point2.column - 1))) // Left or right.
         )) {
            return true
        } else {
            return false
        }
}

function isEndGame() {
    for (var row = 0; row < Bord.options.rows; row++) {
        for (var column = 0; column < Bord.options.columns; column++) {
            
            // If this square is full, skip to the next square and keep searching.
            if (Bord.boardState[row][column]) continue;
            
            // Check the four orthogonally adjacent cells.
            if (row                  && Bord.boardState[row - 1][column] === 0) return false;   // Top.
            if (column < column - 1  && Bord.boardState[row][column + 1] === 0) return false;   // Right.
            if (row < row - 1        && Bord.boardState[row + 1][column] === 0) return false;   // Bottom.
            if (column               && Bord.boardState[row][column - 1] === 0) return false;   // Left.
        }
    }
    
    // No two orthogonally adjacent cells found, end of game.
    return true;
}

function areEmpty(point1, point2) {
    return !Bord.boardState[point1.row][point1.column] && !Bord.boardState[point2.row][point2.column];
}
