console.log("scriptLoaded")
const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const highscoreBox = document.getElementById("highscoreBox");

let direction={row:0,col:0}
const foodSound = new Audio("music_food.mp3");
const gameOverSound = new Audio("music_gameover.mp3");
const moveSound = new Audio("music_move.mp3");
const musicSound = new Audio("music_music.mp3");
musicSound.volume=0.1

const GRID_SIZE=18
let speed=4
let lastPaintTime=0
let snakeArray=[{col:10,row:13}]
let food={col:13,row:15}
let score=0

let highscore=localStorage.getItem("highscore")
let highscoreval=0
if(highscore===null){
    highscoreval=0
    localStorage.setItem("highscore",JSON.stringify(highscoreval))
}
else{
    highscoreval=JSON.parse(highscore)
    highscoreBox.innerHTML="HighScore: "+highscoreval
}



function main(currentTime){
    //this is my main gameloop which is calling again and again
    if (lastPaintTime === 0) {
        lastPaintTime = currentTime;
    }
    window.requestAnimationFrame(main)
    if((currentTime-lastPaintTime)/1000<1/speed){
        return
    }
    lastPaintTime=currentTime
    updateSnakeAndFood()
    createSnakeAndFood()
}
window.requestAnimationFrame(main)
  
function createSnakeAndFood(){
    // creating the sanke and food
    board.innerHTML=""
    //creating snake
    snakeArray.forEach((element) => {
        let snakeElement=document.createElement("div")
        snakeElement.style.gridRowStart=element.row
        snakeElement.style.gridColumnStart=element.col
        snakeElement.classList.add("snake")
        board.appendChild(snakeElement)
    });
    //creating food
    let foodElement=document.createElement("div")
    foodElement.style.gridRowStart=food.row
    foodElement.style.gridColumnStart=food.col
    foodElement.classList.add("food")
    board.appendChild(foodElement)

}

function updateSnakeAndFood(){
    const head={
        col: snakeArray[0].col+direction.col,
        row:snakeArray[0].row+direction.row,
        
    }
    //if snake will collide to grid wall
    //cheking head of snake and food of snake will collide,means snake eaten the food(i.e)sanke will eat food when food position is eual to head position of snake
    if(head.col===food.col && head.row===food.row){
        foodSound.play()
        score+=1
        scoreBox.innerHTML="Score: "+score
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscoreBox.innerHTML = "HighScore: " + highscoreval; 
        }
        
        if(score%6===0 && speed<15){//i am changing the speed after every 6 score
            speed=speed+1
        }
        snakeArray.unshift(head)
        food={
            col:Math.floor(Math.random()*18)+1,
            row:Math.floor(Math.random()*18)+1,
        }
    }
    //why we are doing this else part whenever we generte a new head it will be added to our snakearray so we have to remove it from the tail as well i order to maintain the size of snake
    else{
        snakeArray.unshift(head)
        snakeArray.pop()
    }
    //if snake collides with wall
    if ( head.col < 1 || head.col > 18 || head.row < 1 || head.row > 18){
       gameOverSound.play()
       score=0
       scoreBox.innerHTML="Score: "+'0'
       musicSound.pause()
        alert("Game Over")
        snakeArray = [{ col: 10, row: 13 }]
        direction = { row: 0, col: 0 }
        musicSound.play()
    }
    // if snake collide with its own body
    for(let i=1;i<snakeArray.length;i++){
        if(snakeArray[i].col===head.col && snakeArray[i].row===head.row){
            gameOverSound.play()
            score=0
            scoreBox.innerHTML="Score: "+'0'
            musicSound.pause()
            alert("Game Over!")
            snakeArray = [{ col: 10, row: 13 }]
            direction = { row: 0, col: 0 }
            musicSound.play()
        }
    }
}

window.addEventListener("keydown",(event)=>{
    musicSound.play()
    moveSound.play()
    switch(event.key) {
        case "ArrowUp":
            if(direction.row!==1) direction={col:0, row:-1 };
            break;
        case "ArrowDown":
            if(direction.row!==-1) direction={col:0, row:1 };
            break;
        case "ArrowLeft":
            if(direction.col!==1) direction={col:-1, row:0 };
            break;
        case "ArrowRight":
            if(direction.col!==-1) direction={col:1, row:0 };
            break;
    }
})