const player = document.getElementById("player");
const game = document.getElementById("game-container");

let jumping = false;
let jumpHeight = 0;
let jumpInterval = null;
let fallInterval = null;

document.addEventListener("keydown", (e) => {
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

function spawnObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    game.appendChild(obstacle);

    let position = game.offsetWidth;
    const moveInterval = setInterval(() => {
        position -= 4;
        obstacle.style.right = `${game.offsetWidth - position}px`;

        if (position < -50) {
            clearInterval(moveInterval);
            obstacle.remove();
        }
    }, 20);
}
setInterval(spawnObstacle, 2000);
