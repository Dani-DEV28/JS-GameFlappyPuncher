const player = document.getElementById("player");
const game = document.getElementById("game-container");
const scoreboard = document.getElementById("scoreboard");


let jumping = false;
let jumpHeight = 0;
let jumpInterval = null;
let fallInterval = null;
let obstacles = [];
let obstacleInterval = null;
let paused = false;
let score = 0;

// --- Player Controls ---
document.addEventListener("keydown", (e) => {
    if (paused) return; // disable input when paused/game over

    if (e.key === " " && !jumping) {
        jumping = true;
        jumpHeight = 0;

        jumpInterval = setInterval(() => {
            if (jumpHeight < 100) {
                jumpHeight += 4;
                player.style.bottom = `${100 + jumpHeight}px`;
            } else {
                clearInterval(jumpInterval);

                fallInterval = setInterval(() => {
                    if (jumpHeight > 0) {
                        jumpHeight -= 2;
                        player.style.bottom = `${100 + jumpHeight}px`;
                    } else {
                        clearInterval(fallInterval);
                        jumping = false;
                    }
                }, 20);
            }
        }, 20);
    }

    if (e.key === "e" && jumping) {
        clearInterval(jumpInterval);
        if (fallInterval) clearInterval(fallInterval);

        fallInterval = setInterval(() => {
            if (jumpHeight > 0) {
                jumpHeight -= 6;
                player.style.bottom = `${100 + jumpHeight}px`;
            } else {
                clearInterval(fallInterval);
                jumping = false;
            }
        }, 20);
    }
});

// --- Spawn Obstacles ---
function spawnObstacle() {
    if (paused) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    game.appendChild(obstacle);
    obstacles.push(obstacle);

    let position = game.offsetWidth;
    let pointAwarded = false;
    
    const moveInterval = setInterval(() => {
        if (paused) {
            clearInterval(moveInterval);
            return;
        }

        position -= 4;
        obstacle.style.right = `${game.offsetWidth - position}px`;

        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (!pointAwarded && obstacleRect.right < playerRect.left) {
            score++;
            scoreboard.textContent = `Score: ${score}`;
            pointAwarded = true; // prevent double counting
        }

        if (position < -50) {
            clearInterval(moveInterval);
            obstacle.remove();
            obstacles = obstacles.filter(o => o !== obstacle);
        }
    }, 20);
}

// Keep reference so we can stop it later
obstacleInterval = setInterval(spawnObstacle, 2000);

// --- Collision Detection ---
function isColliding(a, b) {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();

    return !(
        rectA.top > rectB.bottom ||
        rectA.bottom < rectB.top ||
        rectA.right < rectB.left ||
        rectA.left > rectB.right
    );
}

function showPopup(titleText) {
    const popup = document.getElementById("popup");
    const title = document.getElementById("popup-title");

    title.textContent = titleText;
    popup.style.display = "flex";
    paused = true;
    clearInterval(obstacleInterval);

    score = 0;
    scoreboard.textContent = `Score: ${score}`;
}

function checkCollisions() {
    if (!paused) {
        obstacles.forEach(obstacle => {
            if (isColliding(player, obstacle)) {
                document.body.style.background = "darkred";
                console.log("💥 Collision detected!");
                showPopup("Game Over");
            }
        });
    }
    requestAnimationFrame(checkCollisions);
}

checkCollisions();
