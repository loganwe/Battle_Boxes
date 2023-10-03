const canvas=document.querySelector("canvas")
const c=canvas.getContext("2d")
let gameOver=false
canvas.width=1024
canvas.height=576
c.fillRect(0,0, canvas.width, canvas.height)
const gravity=0.7
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
    constructor({position, velocity,color,offset=0, imageSrc,scale=1,frames=1}){

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
        this.health=100
        this.cframe=0
        this.eframe=0
        this.hframe=5.5
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

    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        this.velocity.y+=gravity

        if(this.position.y+this.height+this.velocity.y>=canvas.height-96)
        this.velocity.y=0

        if(this.position.y<=0)
        this.velocity.y=1
    }
    

    attack(){
        this.isAttacking=true
        setTimeout(()=>{this.isAttacking=false},100)
    }
}

const player= new Fighter({
    position:{
    x:0,
    y:0
}
    ,velocity:{
        x:0,
        y:0
    },color:"red"
    ,imageSrc:"./p1Idle.png"
    ,frames:8
})

const enemy= new Fighter({
    position:{
    x:900,
    y:0
}
    ,velocity:{
        x:0,
        y:0
    },color:"blue",offset:50
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

function a(){
    window.requestAnimationFrame(a)
    c.fillStyle="black"  
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    enemy.update()
    player.update() 

    if(player.AttackBox.position.x+player.AttackBox.width>=enemy.position.x
        && player.AttackBox.position.x<=enemy.position.x+enemy.width
        && player.AttackBox.position.y+player.AttackBox.height>=enemy.height
        && player.AttackBox.position.y<=enemy.position.y+enemy.height
        &&player.isAttacking){
            enemy.health-=100
        document.querySelector("#eh").style.width=enemy.health+"%"
    }

    if(enemy.AttackBox.position.x+enemy.AttackBox.width>=player.position.x
        && enemy.AttackBox.position.x<=player.position.x+player.width
        && enemy.AttackBox.position.y+enemy.AttackBox.height>=player.height
        && enemy.AttackBox.position.y<=player.position.y+player.height
        &&enemy.isAttacking){
            player.health-=1
            document.querySelector("#ph").style.width=player.health+"%"
    }

    if(player.health<=0||enemy.health<=0){
        let endText=document.querySelector("#et")
        gameOver=true
        if(player.health<=0){
            endText.innerHTML="Player2 Wins"
        }else { 
            endText.innerHTML="Player1 Wins"
        }
    }
}
a()
window.addEventListener("keydown",(event)=>{
    if(gameOver){

    }else{
switch (event.key) {
    case "d":
        player.velocity.x=5
        break;
        case "a":
        player.velocity.x=-5
        break;
        case "w":
        player.velocity.y=-20
        break;
        case's':
        player.isAttacking=false
        player.attack()
        break
        case "ArrowRight":
        enemy.velocity.x=5
        break;
        case "ArrowLeft":
        enemy.velocity.x=-5
        break;
        case "ArrowUp":
        enemy.velocity.y=-20
        break;
        case'ArrowDown':
            enemy.isAttacking=false
            enemy.attack()
            break
}
    } 
})

window.addEventListener("keyup",(event)=>{
    switch (event.key) {
        case "d":
            player.velocity.x=0
            break;
            case "a":
        player.velocity.x=0
        break;
        case "ArrowRight":
            enemy.velocity.x=0
            break;
            case "ArrowLeft":
        enemy.velocity.x=0
        break;
    }
    })
