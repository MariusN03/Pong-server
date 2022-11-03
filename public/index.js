let clientSocket
let currentPage = '#lobby'
let nameInput, nameButton, myName, rejectButton, theGame, lobbyText, timer, padde1, paddle2, player1, player2, winner, restartButton

function setup(){
  noCanvas()
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
      lobbyText.html('Venter på spillere')
      shiftPage('#lobby')
    }else{
      confirm('indtast et navn')
    }
    
    //start spil
    clientSocket.on('play', () => {
      console.log('got play, starting game')
      let c = createCanvas(400,400)
      background:'red';
      theGame.child(c)
      shiftPage('#play')
    })
        
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
  })


}

function keyPressed(){
  console.log(key)
  if(key == 'ArrowUp'){
  }
}

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
  winner = select('#winner')
  restartButton = select('#restartButton')
}

