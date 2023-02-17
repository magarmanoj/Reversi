const ChipType =
               {
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2
}
let current_chip = ChipType.BLACK;

let timer = null;
let time_taken =0;
let possible_chips_places = [];
var scoreBlack = 0;
var scoreWhite = 0;

let my_board = [[0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]];

//--------------------------------------------------------
window.onload = function()
{
    initBoard()
}

//--------------------------------------------------------
function newgame()
{
    reset();
}

//--------------------------------------------------------
function initBoard()
{
    my_board[3][3] = ChipType.WHITE
    my_board[3][4] = ChipType.BLACK
    my_board[4][3] = ChipType.BLACK
    my_board[4][4] = ChipType.WHITE

    current_chip = 1
    time_taken = 0;
    scoreBlack = 0;
    scoreWhite = 0;

    draw_board(my_board)
    underLineCurrentPlayer()
    updateTimerLabel(0)
    updateScoreLabels()
    possible_chips_places = []
    calculateAllPossibleMovesForCurrentPlayer()
    highlightPossibleTiles()
    clearInterval(timer)
    timer = setInterval(updateTime, 1000)

    
}
// lijn 62-100 referentie genoemen van Oefenzetting 
//--------------------------------------------------------
function draw_board(board)
{
    container = document.getElementById("board_container");
    board_html = generate_board_html(board);
    container.innerHTML = board_html;
}

//--------------------------------------------------------
function generate_board_html(board){
    let table_inner_html = "";
    for(let i = 0; i < board.length; i++)
    {
        let row_html = "<tr>"
        for(let j = 0; j < board[i].length; j++)
        {
            row_html += generate_square(board[i][j]);
        }
        row_html += "</tr>";
        table_inner_html += row_html;
    }

    return `<table id="mainTable">${table_inner_html}</table>`;
}

//--------------------------------------------------------
function generate_square(type)
{
    let square_class = "empty" ;
    let square_content = "";

    if(type === 1){
        square_class = "zwarte";
        square_content = "";
    }else if(type === 2){
        square_class = "wit";
        square_content = "";
    }
    return `<td class="${square_class} board_element" onclick="square_click_handler(this)">${square_content}</td>`;
}

//--------------------------------------------------------
function update_board(board, row, col, type)
{
    board[row][col] = type;
    draw_board(board);
}

//--------------------------------------------------------
function isPosibleToClickInThisCell(row, col)
{
    if(isValidPosition(row,col))
    {
        for(var item in possible_chips_places)
        {
            var val = possible_chips_places[item]
            //if in the list of possible chips
            if(row === val[0] && col === val[1])
            {
                return true
            }
        }
    }

    return false;
}

//--------------------------------------------------------
function square_click_handler(event)
{
    let row = event.parentNode.rowIndex;
    let col = event.cellIndex;

    //do nothing if clicked on a cell that already has a chip
    if(isValidPosition(row, col))
    {
        let cell_content = my_board[row][col]
        if(cell_content === ChipType.EMPTY && isPosibleToClickInThisCell(row, col))
        {
            //clear for next use
            possible_chips_places = []
            checkallDir(row,col)
        }
    }

}
//--------------------------------------------------------
function underLineCurrentPlayer()
{
    if(current_chip === ChipType.BLACK)
    {
        document.getElementById("scoreBlackId").style.textDecoration="underline";
        document.getElementById("scoreWhiteId").style.textDecoration="none";
    }
    else if(current_chip === ChipType.WHITE)
    {
        document.getElementById("scoreWhiteId").style.textDecoration="underline";
        document.getElementById("scoreBlackId").style.textDecoration="none";
    }
}
//--------------------------------------------------------
function updateTime()
{
    time_taken++;
    updateTimerLabel(time_taken)
    
}

//--------------------------------------------------------
function updateTimerLabel(timeTaken)
{
    document.getElementById("timeTakenId").textContent =  timeTaken + " Sec"
    
}

//--------------------------------------------------------
function updateScoreLabels()
{
    document.getElementById("scoreBlackId").textContent = scoreBlack;
    document.getElementById("scoreWhiteId").textContent = scoreWhite;
}

//--------------------------------------------------------
function switchTurn()
{
    if(current_chip === ChipType.BLACK)
    {
        current_chip = ChipType.WHITE;
    }
    else
    {
        current_chip = ChipType.BLACK;
    }
}

//--------------------------------------------------------
function reset()
{
    for(var i = 0; i < my_board.length; i++)
    {
        for(var j = 0; j < my_board.length; j++)
        {
            my_board[i][j] = 0
        }
    }

    initBoard();
}

//--------------------------------------------------------
function isValidPosition(row, col)
{
    return(row >= 0 && row < my_board.length) && (col >= 0 && col < my_board.length)
}

//--------------------------------------------------------
function getChipColorToCheck()
{
    if(current_chip === ChipType.BLACK)
    {
        return ChipType.WHITE
    }

    return ChipType.BLACK
}

//--------------------------------------------------------
function recalculateScoreAndUpdateLabels()
{
    var new_score_black = 0;
    var new_score_white = 0;
    for(var i = 0; i < my_board.length; i++)
    {
        for(var j = 0; j < my_board.length; j++)
        {
            let chip_type = my_board[i][j]

            if(chip_type === ChipType.EMPTY)
            {
                continue;
            }

            if(chip_type === ChipType.BLACK)
            {
                new_score_black++;
            }
            else
            {
                new_score_white++;
            }
        }
    }

    scoreBlack = new_score_black;
    scoreWhite = new_score_white;
    updateScoreLabels()
}

//--------------------------------------------------------
function checkDummySameChip(row, col)
{
    if(this.isValidPosition(row, col))
    {
        return my_board[row][col] === current_chip;
    }
}

//--------------------------------------------------------
function findPossiblePointsToPlaceAChip(row, col)
{
    var possible_clickable_row_pos
    var possible_clickable_col_pos

    for(var possibleRowDir = -1; possibleRowDir <= 1; possibleRowDir++)
    {
        for(var possibleColDir = -1; possibleColDir <=1 ; possibleColDir++)
        {
            if(possibleRowDir === 0 && possibleColDir === 0)
            {
                continue;
            }

            //same as a user clicking in a table cell
            possible_clickable_row_pos = row + possibleRowDir
            possible_clickable_col_pos = col + possibleColDir
            var possibleClickables = []
            while(this.isValidPosition(possible_clickable_row_pos, possible_clickable_col_pos)
                  && !isEmptyCell(possible_clickable_row_pos, possible_clickable_col_pos)
                  && !isSameAsCurrentChip(possible_clickable_row_pos, possible_clickable_col_pos))
            {
                possibleClickables.push([possible_clickable_row_pos, possible_clickable_col_pos])
                possible_clickable_row_pos += possibleRowDir
                possible_clickable_col_pos += possibleColDir
            }

            if(possibleClickables.length > 0)
            {
                if(isValidPosition(possible_clickable_row_pos, possible_clickable_col_pos))
                {
                    var end_cell = my_board[possible_clickable_row_pos][possible_clickable_col_pos];
                    //if the end chip is empty, we found a path to cover
                    if(end_cell === ChipType.EMPTY)
                    {
                        for(var item in possibleClickables)
                        {
                            possible_chips_places.push([possible_clickable_row_pos, possible_clickable_col_pos])
                        }
                    }
                }
            }
        }
    }
}

//--------------------------------------------------------
function calculateAllPossibleMovesForCurrentPlayer()
{
    for(var i = 0; i < my_board.length; i++)
    {
        for(var j = 0; j < my_board.length; j++)
        {
            let chip_type = my_board[i][j]

            if(chip_type === ChipType.EMPTY)
            {
                continue;
            }

            if(chip_type === current_chip)
            {
                findPossiblePointsToPlaceAChip(i,j)
            }
        }
    }
}

//--------------------------------------------------------
function highlightPossibleTiles()
{
    if(possible_chips_places.length > 0)
    {
        for(var item in possible_chips_places)
        {
            var cellNumbers = possible_chips_places[item]
            var row = cellNumbers[0]
            var col = cellNumbers[1]
            if(my_board[row][col] !== current_chip)
            {
                document.getElementById('mainTable').rows[row].cells[col].style.backgroundColor = "#a6a6a6";
            }
        }
    }
}
//--------------------------------------------------------
function ifBoardFullShowWinnerAndRestartGame()
{
    for(var i = 0; i < my_board.length; i++)
    {
        for(var j = 0; j < my_board.length; j++)
        {
            if(my_board[i][j] === ChipType.EMPTY)
            {
                return false
            }
        }
    }

    return true;
}
//--------------------------------------------------------
function showEndDialogBox()
{
    
    //Show scores
    //give option to restart the game
    var winnerScore = 0;
    var winnerType = "";
    if(scoreBlack > scoreWhite)
    {
        winnerScore = scoreBlack
        winnerType = "BLACK"
    }
    else if(scoreBlack === scoreWhite)
    {
        winnerType = "DRAW"
    }
    else
    {
        winnerScore = scoreWhite
        winnerType = "WHITE"
    }

    var pressed_ok;
    if(winnerType === "BLACK" || winnerType === "WHITE")
    {
        var winner_message = "\nWinner chip is: " + winnerType + " with score of: "
                + winnerScore + "." +"\n\n" + "Press OK to restart the game."
        pressed_ok = confirm(winner_message)
    }
    else
    {
        var draw_message = "\nThe game was a DRAW" + "\n\nPress OK to restart the game."
        pressed_ok = confirm(draw_message)
    }

    if(pressed_ok)
    {
        reset()
    }
    else 
    {
        clearInterval(timer)
       
    }
}

//--------------------------------------------------------
function ifNoMovesLeftForCurrentPlayerGiveTurnToNextPlayer()
{
    if(possible_chips_places.length === 0)
    {
        switchTurn();
        underLineCurrentPlayer();
        calculateAllPossibleMovesForCurrentPlayer();
        highlightPossibleTiles();
    }
}

//--------------------------------------------------------
function updateGameStatusAfterChipMove()
{
    recalculateScoreAndUpdateLabels();
    switchTurn();
    underLineCurrentPlayer();
    calculateAllPossibleMovesForCurrentPlayer();
    highlightPossibleTiles();
    ifNoMovesLeftForCurrentPlayerGiveTurnToNextPlayer();
    if(ifBoardFullShowWinnerAndRestartGame())
    {
        //allow time for the UI to update before showing the dialog box
        setTimeout(showEndDialogBox, 100)
    }
}

//--------------------------------------------------------
function isEmptyCell(row, col)
{
    if(this.isValidPosition(row, col))
    {
        return my_board[row][col] === ChipType.EMPTY
    }
}

//--------------------------------------------------------
function isSameAsCurrentChip(row, col)
{
    if(this.isValidPosition(row, col))
    {
        return my_board[row][col] === current_chip;
    }
}

//--------------------------------------------------------
function checkallDir(row, col)
{
    var rowCheck
    var colCheck
    for(var rowDir = -1; rowDir <= 1; rowDir++)
    {
        for(var colDir = -1; colDir <=1 ; colDir++)
        {
            if(rowDir === 0 && colDir === 0)
            {
                continue;
            }

            rowCheck = row + rowDir;
            colCheck = col + colDir;

            var possibleItem = []
            while(this.isValidPosition(rowCheck, colCheck)
                  && !isEmptyCell(rowCheck, colCheck)
                  && !isSameAsCurrentChip(rowCheck, colCheck))
            {
                possibleItem.push([rowCheck, colCheck])

                rowCheck += rowDir;
                colCheck += colDir;
            }

            //if the last chip is same as our current_chip
            if(this.isValidPosition(rowCheck, colCheck))
            {
                if(my_board[rowCheck][colCheck] === current_chip && possibleItem.length > 0)
                {
                    for(var item in possibleItem)
                    {
                        my_board[possibleItem[item][0]][possibleItem[item][1]] = current_chip
                    }
                }
            }
        }
    }

    update_board(my_board, row, col, current_chip);
    updateGameStatusAfterChipMove();
}
