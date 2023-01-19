const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height); 

const gravity = 0.7

let background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})
var shop = new Sprite({
    position:{
        x:600,
        y:130
    },
    imageSrc: './img/shop.png',
    scale : 2.75,
    framesMax: 6
})

let player = new Fighter({
    position: {
        x:0,
        y:0
    },
    velocity:{
        x:0,
        y:10
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale:2.5,
    offset :{
        x:215,
        y:157
    },
    sprites:{
        idle: {
            imageSrc:'./img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc:'./img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc:'./img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc:'./img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc:'./img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit:{
            imageSrc:'./img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        }

        },
        attackBox:{
            offset:{
                x:100,
                y:50
            },
            width:150,
            height:50
        }
})





    






console.log("Player position is: " + "x:" + player.position.x + " y:" + player.position.y)

var enemy = new Fighter({
    position: {
        x:400,
        y:100
    },
    velocity:{
        x:0,
        y:0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale:2.5,
    offset :{
        x:215,
        y:167
    },
    sprites:{
        idle: {
            imageSrc:'./img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc:'./img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc:'./img/kenji/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc:'./img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc:'./img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit:{
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        }

        },
            attackBox:{
                offset:{
                    x:-160,
                    y:50
                },
                width:160,
                height:50
            }

})


const keys  ={
    a: {
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}



function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
  
    if(keys.a.pressed && player.lastKey == 'a'){
        player.velocity.x = -5;
    player.switchSprite('run')
    } else if(keys.d.pressed && player.lastKey == 'd'){
        player.velocity.x = 5;
        player.switchSprite('run')
    }else{
         player.switchSprite('idle')
    }

    //jumping
    if(player.velocity.y < 0){
      player.switchSprite('jump')
    }else if(player.velocity.y >0){
      player.switchSprite('fall')
    }

     //enemy movement
     if(keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run')
    } else if(keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

     //jumping
     if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
      }else if(enemy.velocity.y >0){
        enemy.switchSprite('fall')
      }



    //detect for collision && enemy gets hit
    if(rectangularCollision({
        rectangle1:player,
        rectangle2:enemy
    }) && 
        player.isAttacking && player.frameCurrent === 4
        ){
        enemy.takeHit()
        player.isAttacking = false
        
        document.querySelector("#enemyHealth").style.width = enemy.health + '%'
    }

    //player misses
    if(player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false
    }

    //this is where player gets hit
    
    if(rectangularCollision({
        rectangle1:enemy,
        rectangle2:player
    }) && 
        enemy.isAttacking && enemy.frameCurrent == 2){
         player.takeHit()   
        enemy.isAttacking = false

        document.querySelector("#playerHealth").style.width = player.health + '%'
    }

    //player misses
    if(enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false
    }
    //end game based on health
    if(enemy.health <= 0 || player.health <= 0){
            determineWinner({player,enemy,timerId})
    }
   
}
// animate()


window.addEventListener('keydown', (event) =>{

    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;

        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
    
        case 'ArrowUp':
            enemy.velocity.y = -20
            break    
        case 'ArrowDown':
            enemy.attack()
            break 

    }

})

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break
       
    }
    
    //enemy keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    }
    
})




var changeback1 = document.querySelector(".changebackground1")
changeback1.classList.add("hide")
// Change background by choice Player 1

var changeback = document.querySelector(".changebackground")
var erexeq = changeback.children
var klir = document.querySelector(".background1")
let player1Choise = -1;

for(let i=0;i<erexeq.length;i++){
    erexeq[i].addEventListener('click', () =>{
    var newBack = erexeq[i].children[0].src
    if(i == 0){
        player1Choise = 0;
        changeback1.classList.remove("hide")
        changeback.classList.add("hide")
        alert(player1Choise)
    }
    if(i ==1){
        player1Choise = 1;
        changeback1.classList.remove("hide")
        alert(player1Choise)
       
    }
    if(i == 2){
        player1Choise = 2;
        changeback1.classList.remove("hide")
        alert(player1Choise)
    }

    })
}




// Change background by choice Player 2


var erexeq1 = changeback1.children
var klir1 = document.querySelector(".background2")
let player2Choise = -1;

for(let j=0;j<erexeq1.length;j++){
    erexeq1[j].addEventListener('click', () =>{
    var newBack = erexeq1[j].children[0].src
    if(j == 0){
        player2Choise = 0;
        alert(player2Choise)
        determineFinalBG(player1Choise,player2Choise)
        
        }
    if(j ==1){
        player2Choise = 1;
        alert(player2Choise)
        determineFinalBG(player1Choise,player2Choise)
    }
    if(j == 2){
        player2Choise = 2;
        determineFinalBG(player1Choise,player2Choise)
       
    }


    const backgroundNew = new Sprite({
        position:{
            x:0,
            y:0
        },
        imageSrc: newBack
    })
    background = backgroundNew

    })
}



function determineFinalBG(choise1,choise2){

    if( (choise1 == choise2) && (choise1 >= 0) && (choise2 >= 0)){
        alert("choise1 is: " + choise1 + " choise2 is: " + choise2)
        if(choise1 == 0){
            alert("sksav0")
            var newPlayer = player
            newPlayer.offset.y = 63
            player = newPlayer
    
            var newEnemy = enemy
            newEnemy.offset.y = 77
            enemy = newEnemy
    
            var boat = new Sprite({
                position:{
                    x:870,
                    y:380
                },
                imageSrc: './img/boat.png',
                scale : 0.2,
                framesMax: 1
            })
            shop = boat
    
            boatAnimationStart(shop)
            var water = new Sprite({
                position:{
                    x:945,
                    y:420
                },
                imageSrc: './img/wtr22.png',
                scale : 0.3,
                framesMax: 7
            })
            water.framesHold = 7
            boatAnimationStart(water)
    
            function fakeAnimate(){
                window.requestAnimationFrame(fakeAnimate)
                c.fillStyle = 'black'
                c.fillRect(0,0,canvas.width,canvas.height)
                background.update()
                shop.update()
                water.update()
                player.update()
                enemy.update()
            
                player.velocity.x = 0
                enemy.velocity.x = 0
            
                //player movement
              
                if(keys.a.pressed && player.lastKey == 'a'){
                    player.velocity.x = -5;
                player.switchSprite('run')
                } else if(keys.d.pressed && player.lastKey == 'd'){
                    player.velocity.x = 5;
                    player.switchSprite('run')
                }else{
                     player.switchSprite('idle')
                }
            
                //jumping
                if(player.velocity.y < 0){
                  player.switchSprite('jump')
                }else if(player.velocity.y >0){
                  player.switchSprite('fall')
                }
            
                 //enemy movement
                 if(keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft'){
                    enemy.velocity.x = -5;
                    enemy.switchSprite('run')
                } else if(keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight'){
                    enemy.velocity.x = 5;
                    enemy.switchSprite('run')
                }else{
                    enemy.switchSprite('idle')
                }
            
                 //jumping
                 if(enemy.velocity.y < 0){
                    enemy.switchSprite('jump')
                  }else if(enemy.velocity.y >0){
                    enemy.switchSprite('fall')
                  }
            
            
            
                //detect for collision && enemy gets hit
                if(rectangularCollision({
                    rectangle1:player,
                    rectangle2:enemy
                }) && 
                    player.isAttacking && player.frameCurrent === 4
                    ){
                    enemy.takeHit()
                    player.isAttacking = false
                    
                    document.querySelector("#enemyHealth").style.width = enemy.health + '%'
                }
            
                //player misses
                if(player.isAttacking && player.frameCurrent === 4){
                    player.isAttacking = false
                }
            
                //this is where player gets hit
                
                if(rectangularCollision({
                    rectangle1:enemy,
                    rectangle2:player
                }) && 
                    enemy.isAttacking && enemy.frameCurrent == 2){
                     player.takeHit()   
                    enemy.isAttacking = false
            
                    document.querySelector("#playerHealth").style.width = player.health + '%'
                }
            
                //player misses
                if(enemy.isAttacking && enemy.frameCurrent === 2){
                    enemy.isAttacking = false
                }
                //end game based on health
                if(enemy.health <= 0 || player.health <= 0){
                        determineWinner({player,enemy,timerId})
                }
               
            }
            fakeAnimate()
            decreaseTimer()
          
        }
        if(choise1 == 1){
            alert("sksav1")
                var newPlayer = player
                newPlayer.offset.y = 163
                player = newPlayer

                var newEnemy = enemy
                newEnemy.offset.y = 177
                enemy = newEnemy

                var shop1 = new Sprite({
                    position:{
                        x:600,
                        y:130
                    },
                    imageSrc: './img/shop.png',
                    scale : 2.75,
                    framesMax: 6
                })

                shop = shop1


              animate()
            decreaseTimer()
        }
        if(choise1 == 2){
            alert("sksav2")
            var newPlayer = player
            newPlayer.offset.y = 163
            player = newPlayer
    
            var newEnemy = enemy
            newEnemy.offset.y = 177
            enemy = newEnemy
    
            var ball = new Sprite({
                position:{
                    x:320,
                    y:-25
                },
                imageSrc: './img/lexpl2.png',
                scale : 1.7,
                framesMax: 0
            })
    
            ball.framesHold = 7
            shop = ball
            
            animate()
           decreaseTimer()
            
        }
        console.log("true")
        return true
    } 

   if((choise1 != choise2) && (choise1 >= 0) && (choise2 >= 0)){
    let rand = Math.abs(Math.floor(Math.random() * 3))
    choise1 = rand;
    choise2 = rand;
    alert("1: " + choise1 + " 2: " + choise2)
    determineFinalBG(choise1,choise2)
   } 
    
}



function randFunc(){
    var rand = Math.abs(Math.floor(Math.random() * 3))
    player1Choise = rand
    alert(player1Choise)
    changeback.classList.add("hide")
    changeback1.classList.remove("hide")
    // return player1Choise


}
function randFunc1(){
    var rand1 = Math.abs(Math.floor(Math.random() * 3))
    player2Choise = rand1
    alert("player 1 choise: " + player1Choise)
    alert(player2Choise)
     changeback1.classList.add("hide")
     determineFinalBG(player1Choise,player2Choise)
    


}





