const mappings = new Map();

// Map strings to pairs of numbers
mappings.set("top-left", [0, 0]);
mappings.set("top-mid", [0, 1]);
mappings.set("top-right", [0, 2]);
mappings.set("mid-left", [1, 0]);
mappings.set("mid-mid", [1, 1]);
mappings.set("mid-right", [1, 2]);
mappings.set("bottom-left", [2, 0]);
mappings.set("bottom-mid", [2, 1]);
mappings.set("bottom-right", [2, 2]);



const player = string => {
    let color = string
    return { color };
  };

  const board = (() => {
    let turn = 0;
    const board = new Array(3).fill('0').map(() => new Array(3).fill('0'));
    const setX = (location, player) => {
       if(player == "1"){
        setKey(location, "X");
       } else{
        setKey(location, "O");
       }
    }
    const setKey = (location, marker) => {
      if(location == "top-left") {
        board[0][0] = marker;
      }
      if(location == "top-mid") {
        board[0][1] = marker;
      }
      if(location == "top-right") {
        board[0][2] = marker;
      }
      if(location == "mid-left") {
        board[1][0] = marker;
      }
      if(location == "mid-mid") {
        board[1][1] = marker;
      }
      if(location == "mid-right") {
        board[1][2] = marker;
      }
      if(location == "bottom-left") {
        board[2][0] = marker;
      }
      if(location == "bottom-mid") {
        board[2][1] = marker;
      }
      if(location == "bottom-right") {
        board[2][2] = marker;
      }
      render(location, marker);
    }
    const render = (location, marker) => {
      var block = document.getElementById(location);
      block.innerHTML = marker;
    }
    const ifGameIsOver = () => {
      const winningCombinations = [
        [board[0][0], board[0][1], board[0][2]], // First row
        [board[1][0], board[1][1], board[1][2]], // Second row
        [board[2][0], board[2][1], board[2][2]], // Third row
        [board[0][0], board[1][0], board[2][0]], // First column
        [board[0][1], board[1][1], board[2][1]], // Second column
        [board[0][2], board[1][2], board[2][2]], // Third column
        [board[0][0], board[1][1], board[2][2]], // Diagonal from top-left to bottom-right
        [board[0][2], board[1][1], board[2][0]]  // Diagonal from top-right to bottom-left
      ];
    
      for (const combination of winningCombinations) {
        const [cell1, cell2, cell3] = combination;
        if (cell1 && cell1 === cell2 && cell1 === cell3 && cell1 != '0') {
          if(cell1 == 'X') {
            return 1;
          }else {
            return 0;
          }
        }
      }
      return -1;
    }
    return {
      board, setX, turn, ifGameIsOver
    };
  })();

  const turnIndicator = document.getElementById("turnIndicator");
  const buttons = [];

  for (let key of mappings.keys()) {
    const button = document.getElementById(key);
    buttons.push(button);
  }

  function waitForButtonClick(button) {
    return new Promise(resolve => {
      button.addEventListener('click', function() {
        resolve(button);
      });
    });
  }
  
  // Function to wait for a button to be clicked
  function waitForButtonSelection(buttons) {
    const promises = buttons.map(button => waitForButtonClick(button));
    return Promise.race(promises);
  }
async function processButtons() {
  while(1) {
    if(board.turn % 2 == 0) {
      //first player turn
      turnIndicator.textContent = "Player 1 turn!";
      
    } else {
      turnIndicator.textContent = "Player 2 turn!";
    }
    if(board.turn == 9) {
      break;
    }
    else if(board.turn >= 5) {
      let res = board.ifGameIsOver();
      const tempParagraph = document.createElement('p');
      if(res == 1) {
        tempParagraph.textContent = "Player 1 Wins!";
        break; 
      } else if (res == 0) {
        tempParagraph.textContent = "Player 2 Wins!";
        break; 
      }
    }

    const selectedButton = await waitForButtonSelection(buttons);
    let boardLocation = mappings.get(selectedButton.id);
    if(board.turn % 2 == 0) {
      //first player turn
      selectedButton.textContent = 'X';
      board.board[boardLocation[0]][boardLocation[1]] = 'X';
      board.turn++;
      
    } else {
      selectedButton.textContent = 'O';
      board.board[boardLocation[0]][boardLocation[1]] = 'O';
      board.turn++;
    }
   
  }
  window.location.href = "resultScreen.html";
}
  

var myButton = document.getElementById("myButton");

myButton.addEventListener("click", function() {
  // Navigate to another HTML file
    let form = document.querySelector("#playerForm");
    form.style.display = "block";
    myButton.style.display = 'none';
});

const player1 = player();
const player2 = player();
document.querySelector("#playerForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  
  const player = document.getElementById('player');  
  const color = document.getElementById('color');  

  if(player.value == "player1") {
    player1.color = color;
  } else{
    player2.color = color;
  }

  const playerIndex = player.value;
  player.remove(playerIndex);
  const colorIndex = color.value;
  color.remove(colorIndex);
 
  if( player.length == 0) {
    let form = document.querySelector("#playerForm");
    form.style.display = 'none';
    turnIndicator.style.display = 'block';
  }
 
});

processButtons();
  

  