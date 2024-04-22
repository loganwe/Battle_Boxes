
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
let gameOver = false;
canvas.width = 1024;
canvas.height = 576;
const gravity = 1;
const keyState = {};
let pDamage = 1;
let eDanage = 1;
let isPaused = true;
let cheating = false;
let endText = document.querySelector("#et");
let multiplayerMode = false; // Flag for multiplayer mode

class Sprite {
    constructor({ position, imageSrc, scale = 1, frames = 1 }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.frames = frames;
        this.cframe = 0;
        this.eframe = 0;
        this.hframe = 5;
    }

    draw() {
        c.drawImage(
            this.image,
            this.cframe * (this.image.width / this.frames),
            0,
            this.image.width / this.frames,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames * this.scale,
            this.image.height * this.scale
        );
    }

    update() {
        this.draw();
        this.eframe++;

        if (this.eframe % this.hframe === 0) {

            if (this.cframe < this.frames - 1) {
                this.cframe++;
            } else {
                this.cframe = 0;
            }
        }
    }

}

class Fighter extends Sprite {
    constructor({ position, velocity, color, offset = 0, imageSrc, scale = 1, frames = 1, health = 100 }) {

        super({
            position,
            imageSrc,
            scale,
            frames,
        });
        this.velocity = velocity;
        this.height = 150;
        this.color = color;
        this.width = 50;
        this.isAttacking;
        this.isBlocking;
        this.offset = offset;
        this.health = health;
        this.cframe = 0;
        this.eframe = 0;
        this.hframe = 5.5;
        this.jumping = false;
        this.attackCooldown = 0; // Add attack cooldown to limit attack frequency
        this.blockCooldown = 0; // Add block cooldown to prevent rapid blocking
        this.AttackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 100,
            height: 50
        };
    }

    draw() {
        this.AttackBox.position.x = this.position.x - this.offset;
        this.AttackBox.position.y = this.position.y;
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        if (this.isAttacking) {
            c.fillStyle = "green";
            c.fillRect(this.AttackBox.position.x, this.AttackBox.position.y, this.AttackBox.width, this.AttackBox.height);
        }
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += gravity;

        this.position.x = Math.max(0, Math.min(this.position.x, canvas.width - this.width));
        this.position.y = Math.max(0, Math.min(this.position.y, canvas.height - 96 - this.height));

        if (this.position.y <= 0) {
            this.velocity.y = 1;
            this.jumpCount = 0;
        }

        if (this === player && !gameOver) {
            if (keyState["ArrowLeft"]) this.velocity.x = -5;
            else if (keyState["ArrowRight"]) this.velocity.x = 5;
            else this.velocity.x = 0;

            if (keyState["ArrowUp"] && !this.jumping) {
                this.velocity.y = -20;
                this.jumping = true;
                setTimeout(() => { this.jumping = false }, 1000);
            }

            if (keyState["Space"]) {
                this.attack();
            }
        } else if (this === ai && !gameOver && !multiplayerMode) { // Enemy controlled by AI
            // Predictive Movement
            const playerMovement = player.velocity.x; // Get player's horizontal velocity
            const predictedPlayerX = player.position.x + playerMovement * 20; // Predict player's position in the future
            if (predictedPlayerX > this.position.x) {
                this.velocity.x = 3; // Move towards the predicted player position
            } else {
                this.velocity.x = -3; // Move away from the predicted player position
            }

            // Vertical Movement (Jumping)
            if (player.position.y < this.position.y && !this.jumping) {
                this.velocity.y = -15; // Jump if the player is above and the enemy is not already jumping
                this.jumping = true;
                setTimeout(() => { this.jumping = false; }, 1000); // Prevent frequent jumping
            }
            // Attack Logic
            if (player.position.x > this.position.x && player.position.x - this.position.x < 200) {
            // If the player is to the right and within 200 pixels, perform close-range attack
            this.attack();
            } else if (player.position.x < this.position.x && this.position.x - player.position.x < 200) {
            // If the player is to the left and within 200 pixels, perform close-range attack
            this.attack();
            } else {
            // Otherwise, perform ranged attack or move towards the player
            // Implement logic for ranged attack or adjust movement behavior here
            }                 
           }else if (this === ai && multiplayerMode && !gameOver) { // Multiplayer mode: Enemy controlled by player 2
            if (keyState["KeyA"]) this.velocity.x = -5;
            else if (keyState["KeyD"]) this.velocity.x = 5;
            else this.velocity.x = 0;

            if (keyState["KeyW"] && !this.jumping) {
                this.velocity.y = -20;
                this.jumping = true;
                setTimeout(() => { this.jumping = false }, 1000);
            }

            if (keyState["KeyF"]) {
                this.attack();
            }
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => { this.isAttacking = false; }, 100);
    }

    block() {
        this.isBlocking = true;
        setTimeout(() => { this.isBlocking = false; }, 1000); // Block for a short duration
    }
    dellete() {
        this.AttackBox.position.x = this.position.x - this.offset;
        this.AttackBox.position.y = this.position.y;
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, 0, 0);
        c.fillRect(this.AttackBox.position.x, this.AttackBox.position.y, 0, 0);
    }
}

const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "red",
    imageSrc: "./player1/p1Idle.png",
    frames: 8,
    health: 100
});

const ai = new Fighter({
    position: {
        x: 900,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    offset: 50,
    health: 100
});

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "background.png"
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: "shop.png",
    scale: 2.75,
    frames: 6
});

function playerinrange() {
    if (player.AttackBox.position.x + player.AttackBox.width >= ai.position.x
        && player.AttackBox.position.x <= ai.position.x + ai.width
        && player.AttackBox.position.y + player.AttackBox.height >= ai.height
        && player.AttackBox.position.y <= ai.position.y + ai.height) {
        return true;
    } else {
        return false;
    }
}

function pause() {
    if (isPaused == true) {
        isPaused = false;
        endText.innerHTML = ""
    } else {
        isPaused = true;
        endText.innerHTML = "Paused"
    }
    window.requestAnimationFrame(a);
    // endText.innerHTML="";
}

function cheat() {
    if (!cheating) {
        cheating = true;
        const password = prompt("Enter the password to cheat");
        if (password == "I am cheating") {
            let type = prompt("Choose a cheat\n1) damage\n2) health\n type 1 OR 2");
            if (type == "1") {
                pDamage += 1;
            } else if (type == "2") {
                player.health += 100;
            }
            endText.innerHTML = "Cheater";
        }
    }
}

function toggleMultiplayer() {
    multiplayerMode = !multiplayerMode; // Toggle multiplayer mode
    if (multiplayerMode) {
        endText.innerHTML = "Multiplayer Mode On"; // Notify user about multiplayer mode
    } else {
        endText.innerHTML = ""; // Clear notification
    }
}


// Function to handle gamepad input
function handleGamepadInput() {
    const gamepads = navigator.getGamepads();

    // Check each gamepad for input
    for (const gamepad of gamepads) {
        if (gamepad) {
            // Example: Check button presses
            if (gamepad.buttons[0].pressed) {
                // Button 0 (A button on Xbox controller) is pressed
                // Handle action
            }

            // Example: Check thumbstick axes for movement
            const xAxis = gamepad.axes[0];
            const yAxis = gamepad.axes[1];
            // Handle movement based on axes values
        }
    }
}
background.draw();
player.draw();
ai.draw();
shop.draw();

function a() {
    if (!isPaused && !gameOver) {
        window.requestAnimationFrame(a);
        c.fillStyle = "black";
        c.fillRect(0, 0, canvas.width, canvas.height);
        handleGamepadInput()
        background.update();
        shop.update();
        ai.update();
        player.update();

        if (keyState["KeyL"] && keyState["KeyK"] && keyState["ShiftRight"]) {
            cheat();
        }

        if (ai.AttackBox.position.x + ai.AttackBox.width >= player.position.x
            && ai.AttackBox.position.x <= player.position.x + player.width
            && ai.AttackBox.position.y + ai.AttackBox.height >= player.height
            && ai.AttackBox.position.y <= player.position.y + player.height
            && ai.isAttacking) {
            player.health -= eDanage;
            document.querySelector("#ph").style.width = player.health + "%";
        }

        if (player.AttackBox.position.x + player.AttackBox.width >= ai.position.x
            && player.AttackBox.position.x <= ai.position.x + ai.width
            && player.AttackBox.position.y + player.AttackBox.height >= ai.height
            && player.AttackBox.position.y <= ai.position.y + ai.height
            && player.isAttacking) {
            ai.health -= pDamage;
            document.querySelector("#eh").style.width = ai.health + "%";
        }

        if (player.health <= 0 || ai.health <= 0) {
            gameOver = true;
            player.dellete();
            ai.dellete();
            if (player.health < ai.health) {
                endText.style.color = "blue";
                endText.innerHTML = "Computer Wins";
                cancelAnimationFrame(a);
            }
            if (ai.health < player.health) {
                endText.style.color = "red";
                endText.innerHTML = "Player Wins";
                if (cheating) {
                    endText.style.code = "black";
                    endText.innerHTML = "Player Won Cheating";
                }
                cancelAnimationFrame(a);
            }
        }
    }
}

a();

window.addEventListener("keydown", (event) => {
    if (gameOver) {
        if (event.code === "Enter")
            document.location.reload();
    } else {
        keyState[event.code] = true;
        if (keyState["Enter"]) {
            pause();
        }
    }
});

window.addEventListener("keyup", (event) => {

    if (keyState["KeyM"])
        toggleMultiplayer()
    keyState[event.code] = false;
});

