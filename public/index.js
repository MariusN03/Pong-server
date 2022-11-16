let clientSocket
let currentPage = '#lobby'
let nameInput, nameButton, myName, rejectButton, theGame, lobbyText, timer, padde1, paddle2, player1, player2, winner, restartButton
let p1, p2
let username
let userOrder
let speed = 10

function setup(){
  let c = createCanvas(600,400)
  
  p1 = new PaddleC(50, 150, 20, 100)
  p2 = new PaddleC(530, 150, 20, 100)

  background("black")
  
  //log på serveren 
  clientSocket = io.connect()
  initVars()
  shiftPage('#result')


  //få besked om du er med eller om du må vente
  clientSocket.on('join', ok => {
    if(ok){
      console.log('got ok to join, showing namepage')
      shiftPage('#name')
    }else{
      shiftPage('#reject')
    }
  })

  //håndter reject
  rejectButton.mousePressed(()=>{
    window.location.reload()
  })

  //håndter navn
  nameButton.mousePressed(()=>{
    if(nameInput.value() != ''){
      clientSocket.emit('name', nameInput.value())
      myName.html(nameInput.value())
      username = nameInput.value()
      lobbyText.html('Venter på spillere')
      shiftPage('#lobby')
    }else{
      confirm('indtast et navn')
    }
    
    //start spil
    clientSocket.on('play', (players) => {
      console.log('got play, starting game')
      console.log(name1.html())
      console.log(players)
      console.log(p1,p2)
      name1.html(players[0].name)
      name2.html(players[1].name)
      theGame.child(c)
      if(players[0].name == username){
        userOrder = 0
      }else {
        userOrder = 1
      }
      shiftPage('#play')
    })

    //bevæg din paddle

        
    function choice(choice) {
      clientSocket.emit('choice', choice)
      lobbyText.html('Lad os se...')
      shiftPage('#lobby')
    }
    
    //vis resultat
    clientSocket.on('result', w => {
      console.log('got result, winner is ', w)
      winner.html(w)
      shiftPage('#result')
      restartButton.mousePressed(()=>clientSocket.emit('restart'))
    })

    clientSocket.on('move', players => {
      p1.move(players[0].move)
      p2.move(players[1].move)
    })

    clientSocket.on('tick', ()=>{
      //det her er draw
      console.log('ticking')
    })
  })


}

// function keyPressed(){
//   console.log(key)
//   if(key == 'ArrowUp'){
//     console.log('opad opad')
//   }
// }



function shiftPage(pageId){
  select(currentPage).removeClass('show')
  select(pageId).addClass('show')
  currentPage = pageId
}

function initVars(){
  nameInput = select('#nameInput')
  theGame = select('#theGame')
  nameButton = select('#nameButton')
  myName = select('#myName')
  rejectButton = select('#rejectButton')
  lobbyText = select('#lobbyText')
  timer = select('#timer')
  stone = select('#stone')
  scissor = select('#scissor')
  paper = select('#paper')
  player1 = select('#player1')
  paddle1 = select('#paddle1')
  player2 = select('#player2')
  paddle2 = select('#paddle2')
  name1 = select('#name1')
  name2 = select('#name2')
  winner = select('#winner')
  restartButton = select('#restartButton')
}

class PaddleC {
  
  constructor(x, y, w, h){
    this.pos = createVector(x, y)
    this.w = w;
    this.h = h;
  }
  move(num) { 
      if(300 <= this.pos.y || 0 >= this.pos.y){
        if(this.pos.y >= 300){
          this.pos.y = 300
        }
        if(this.pos.y <= 0){
          this.pos.y = 0
        }
//          num = -num
      }
      this.pos.y += num
  }
  show() {
    fill("white")
    rect(this.pos.x, this.pos.y, this.w, this.h)
  }
}

function movePaddles() {
  if(keyIsDown(38)){
    console.log("+++")
    //send ryk paddle op til server
    clientSocket.emit('move', -speed)
  }
  if(keyIsDown(40)){
    console.log("---")
    //send ryk paddle ned til server
    clientSocket.emit('move', speed)
  }
}

function draw() {
  background("black")
  p1.show()
  p2.show()
  movePaddles()
  // console.log(p1.pos.y) 
  //0 til 300
}