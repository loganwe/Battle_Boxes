const canvas=document.querySelector("canvas")
const c=canvas.getContext("2d")

canvas.width=1024
canvas.height=576
c.fillRect(0,0, canvas.width, canvas.height)

class Sprite{
    constructor({position, velocity}){
        this.position=position
        this.velocity=velocity
    }

    draw(){
        c.fillStyle='red'
        c.fillRect(this.position.x,this.position.y,50,150)
    }

    update(){
        this.position.y+=this.velocity
    }
}

const player= new Sprite({
    position:{
    x:0,
    y:0
}
    ,velocity:{
        x:0,
        y:0
    }
})

const enemy= new Sprite({
    position:{
    x:900,
    y:0
}
    ,velocity:{
        x:0,
        y:0
    }
})


function animate(){
    window.requestAnimationFrame(animate)
    alert("player"  )
    player.draw()
    enemy.draw()
    enemy.update()
    player.update()
}