let board; //что находится в каждом квадрате
const huPlayer = "🦜";
const aiPlayer = '🤖';
const winComb = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
]
const cell = document.querySelectorAll('.cell');
StartGame();

function StartGame(){
  document.querySelector('.fin').style.display = "none";
  board = Array.from(Array(9).keys());
  for(let i = 0; i < cell.length; i++){
    cell[i].innerText="";
    cell[i].style.removeProperty('background-color');
    //повторный клик
    cell[i].addEventListener('click', trunClick,false);
  }
}
function trunClick(square){
  if(typeof board[square.target.id] == 'number'){
    turnCl(square.target.id, huPlayer)
    if(!checkTie()) turnCl(bestSpot(), aiPlayer);
  }
  
}
function turnCl(squareID, plyer){
  board[squareID] = plyer;
  document.getElementById(squareID).innerText = plyer;
  let gameCheck = checkWin(board, plyer);
  if(gameCheck) gameOver(gameCheck)
}
//проверка успеха в пратии
function checkWin(board, plyer){
  let plays = board.reduce((a,e,i) => (e === plyer)? a.concat(i):a,[] );
  let gameCheck = null;
  for(let [index,win] of winComb.entries()){
    if(win.every(elem => plays.indexOf(elem) > -1)){
      gameCheck = {index: index, plyer: plyer};
      break;
    }
  }
  return gameCheck;
}
function gameOver(gameCheck){
  for(let index of winComb[gameCheck.index]){
    document.getElementById(index).style.backgroundColor = 
    gameCheck.plyer == huPlayer ? "blue" : "red";
  }
  for(let i = 0; i < cell.length; i++){
    cell[i].removeEventListener('click',trunClick,false)
  }
  sayWinner(gameCheck.plyer == huPlayer ? "Победа!" : "Проигрыш")
} 
function emptySquar(){
  return board.filter(s => typeof s == 'number');
}
//место где ИИ может проиграть
function bestSpot(){
  //первый пустой квадрат
  return minmax(board,aiPlayer).index;
}
function sayWinner(elem){
  if(elem === "Победа!"){
    document.querySelector('.fin').style.display = "block";
    document.querySelector('.fin .text').innerText = '';
    document.querySelector('.fin').id = "win";
  }else if(elem === "Проигрыш"){
    document.querySelector('.fin').style.display = "block";
    document.querySelector('.fin .text').innerText = '';
    document.querySelector('.fin').id = "noWin";
  }else{
    document.querySelector('.fin').style.display = "block";
    document.querySelector('.fin .text').innerText = elem;
    document.querySelector('.fin').id = "soSoWin";
  }
}
function checkTie(){
  //если все клетки заняты, то ничья
  if(emptySquar().length == 0){
    for(let i = 0; i < cell.length; i++){
      cell[i].style.backgroundColor = 'green';
      cell[i].removeEventListener('click',trunClick,false);
    }
    sayWinner('Ничья!');
    return true;
  }
  return false;
}
//минимакс алгоритм
function minmax(newBoard,player){
  let availSpots = emptySquar(newBoard);//доступные точки
  if(checkWin(newBoard,player)){
    //ноль  выйграшей
    return {score: -10};
  }else if(checkWin(newBoard,aiPlayer)){
    //победа х
    return{score: 20};
  }else if(availSpots.length === 0){
    //ничья
    return{score: 0}
  }
  //считаем баллы
  let moves = [];
  for(let i = 0 ;i < availSpots.length; i++){
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if(player == aiPlayer){
      let result = minmax(newBoard,huPlayer);
      move.score = result.score;
    }else{
      let result = minmax(newBoard,aiPlayer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  //оценка лучшего результата
  let bestMove;
  if(player === aiPlayer){
    let bestScore = - 10000;
    for(let i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{
    let bestScore = 10000;
    for(let i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}