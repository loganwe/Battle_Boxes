const canvas=document.querySelector("canvas")
const c=canvas.getContext("2d")
let gameOver=false
canvas.width=1024
canvas.height=576
// c.fillRect(0,0, canvas.width, canvas.height)
const gravity=0.7
const keyState={}
const pDamage=1
let eDanage=1
let isPaused = true;
let endText=document.querySelector("#et")
class Sprite{
    constructor({position,imageSrc,scale=1,frames=1}){
        this.position=position
        this.height=150
        this.width=50
        this.image=new Image()
        this.image.src= imageSrc
        this.scale=scale
        this.frames=frames
        this.cframe=0
        this.eframe=0
        this.hframe=5
    }

    draw(){
        c.drawImage(
            this.image,
            this.cframe*(this.image.width/this.frames),
            0,
            this.image.width/this.frames,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames*this.scale,
            this.image.height*this.scale
            )
    }

    update(){
        this.draw()
        this.eframe++

        if(this.eframe%this.hframe===0){

        if(this.cframe<this.frames-1){
        this.cframe++
        }else{
        this.cframe=0
    }
}
    }
    

}

class Fighter extends Sprite{
    constructor({position, velocity,color,offset=0, imageSrc,scale=1,frames=1,health=100}){

        super({
            position,
            imageSrc,
            scale,
            frames,
        })
        this.velocity=velocity
        this.height=150
        this.color=color
        this.width=50
        this.isAttacking
        this.offset=offset
        this.health=health
        this.cframe=0
        this.eframe=0
        this.hframe=5.5
        this.jumping=false
        this. AttackBox={
            position:{
                x:this.position.x,
                y:this.position.y
            },
            width:100,
            height:50
        }
    }

    draw(){
        this.AttackBox.position.x=this.position.x - this.offset
        this.AttackBox.position.y=this.position.y
        c.fillStyle=this.color
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
        if(this.isAttacking){
        c.fillStyle="green"
        c.fillRect(this.AttackBox.position.x,this.AttackBox.position.y,this.AttackBox.width,this.AttackBox.height)
        }
    }

 
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += gravity;

        // Constrain the player and enemy within the canvas bounds
        this.position.x = Math.max(0, Math.min(this.position.x, canvas.width - this.width));
        this.position.y = Math.max(0, Math.min(this.position.y, canvas.height - 96 - this.height));
    
        if (this.position.y <= 0) {
            this.velocity.y = 1;
            this.jumpCount = 0; // Reset jump count when on the ground
        }

        // Player controls
        if (this === player && !gameOver) {
            if (keyState["ArrowLeft"]) this.velocity.x = -5; 
            else if (keyState["ArrowRight"]) this.velocity.x = 5;0) 
            else this.velocity.x = 0;

        
            else if (keyState["ArrowUp"]&& !this.jumping){ this.velocity.y=-20;this.jumping=true;setTimeout(()=>{this.jumping=false},100}

            /*if (keyState["Space"] && this.jumpCount < this.maxJumpCount) {
                this.velocity.y = -15; // Adjust the jump velocity as needed
                this.jumpCount++;
            }*/

            if (keyState["Space"]) {
                this.attack()
            }
        } else if (this === enemy && !gameOver) {
            // Enemy automated logic
            // Move towards the player
            if (player.position.x > this.position.x) {
                this.velocity.x = 2;
            } else {
                this.velocity.x = -2;
            }

            // Simulate an attack automatically
            if (playerinrange()) {
                this.isAttacking = true;
        
                // Update the attack box position towards the player
                this.AttackBox.position.x = this.position.x - this.offset;
                this.AttackBox.position.y = this.position.y;
        
                setTimeout(() => {
                    this.isAttacking = false;
                   // eDanage+=1
                }, 1000);
            }
        

            if (player.position.y < this.position.y) {
                this.velocity.y = -15; // Adjust the jump velocity as needed
            }        
        }
    }   

    attack(){
        this.isAttacking=true
        setTimeout(()=>{this.isAttacking=false;},100)
        // pDamage+=1
    }
}

const player= new Fighter({
    position:{
    x:200,
    y:0
}
    ,velocity:{
        x:0,
        y:0
    },color:"red"
    ,imageSrc:"./p1Idle.png"
    ,frames:8
    ,health:80
})

const enemy= new Fighter({
    position:{
    x:900,
    y:0
}
    ,velocity:{
        x:0,
        y:0
    },color:"blue",offset:50,health:100
})

const background=new Sprite({
    position:{
        x:0,
        y:0
    },imageSrc:"background.png"
})

const shop=new Sprite({
    position:{
        x:600,
        y:128
    },imageSrc:"shop.png",scale:2.75,frames:6
})

function playerinrange(){
    if(player.AttackBox.position.x+player.AttackBox.width>=enemy.position.x
        && player.AttackBox.position.x<=enemy.position.x+enemy.width
        && player.AttackBox.position.y+player.AttackBox.height>=enemy.height
        && player.AttackBox.position.y<=enemy.position.y+enemy.height){
            return true
        }else{
        return false
    }
}
function isplayerup() {
    if(enemy.position.x===player.position.x && enemy.position.y< player.position.y)
    return true
    else
    return false
}

function pause(){
    if(isPaused==true)
    isPaused=false
    else
    isPaused=true
    window.requestAnimationFrame(a)
    endText.innerHTML=""
    
}
background.draw()
player.draw()
enemy.draw()
shop.draw()
function a(){
    if(!isPaused){
    window.requestAnimationFrame(a)
    c.fillStyle="black"  
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    enemy.update()
    player.update() 
    if(enemy.AttackBox.position.x+enemy.AttackBox.width>=player.position.x
        && enemy.AttackBox.position.x<=player.position.x+player.width
        && enemy.AttackBox.position.y+enemy.AttackBox.height>=player.height
        && enemy.AttackBox.position.y<=player.position.y+player.height
        &&enemy.isAttacking){
            player.health-=eDanage
            document.querySelector("#ph").style.width=player.health+"%"
    }


    if(player.AttackBox.position.x+player.AttackBox.width>=enemy.position.x
        && player.AttackBox.position.x<=enemy.position.x+enemy.width
        && player.AttackBox.position.y+player.AttackBox.height>=enemy.height
        && player.AttackBox.position.y<=enemy.position.y+enemy.height
        &&player.isAttacking){
            enemy.health-=pDamage
        document.querySelector("#eh").style.width=enemy.health+"%"
    }

    

    if(player.health<=0||enemy.health<=0){
        gameOver=true
        if(player.health<=0){
            endText.style.color="blue"
            endText.innerHTML="Computer Wins"
        }else { 
            endText.style.color="red"
            endText.innerHTML="Player Wins"
        }
    }
}

}
a()
window.addEventListener("keydown",(event)=>{
    if(gameOver){
        if (event.code==="Enter")
        document.location.reload()
    }else{
keyState[event.code] = true;
if(keyState["Enter"]){
    pause()
}
    } 
})

window.addEventListener("keyup",(event)=>{
    keyState[event.code] = false;
    // alert(event.code)
    })
