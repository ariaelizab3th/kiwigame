// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// kiwi
let kiwiWidth = 88;
let kiwiHeight = 94;
let kiwiX = 50;
let kiwiY = boardHeight - kiwiHeight;
let kiwiImg;

let kiwi = {
    x: kiwiX,
    y: kiwiY,
    width: kiwiWidth,
    height: kiwiHeight
};

// cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// nubes
let nubeArray = [];
let nubeWidth = 84;
let nubeHeight = 101;
let nubeX = boardWidth;
let nubeY = 50; // Altura inicial de las nubes
let nubeImg;

let nubeVelocityX = -3; // Velocidad de las nubes

// físicas
let velocityX = -8; // velocidad inicial del cactus y nubes
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // dibujar en board

    // kiwi imagen
    kiwiImg = new Image();
    kiwiImg.src = "./img/kiwi.png";
    kiwiImg.onload = function () {
        context.drawImage(kiwiImg, kiwi.x, kiwi.y, kiwi.width, kiwi.height);
        requestAnimationFrame(update);
    };

    // cactus imagen
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    // nube imagen
    nubeImg = new Image();
    nubeImg.src = "./img/nube.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // 1000 milisegundos = 1 segundo
    setInterval(placeNube, 3000); // Colocar nubes cada 3 segundos
    document.addEventListener("keydown", moveKiwi);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // kiwi
    velocityY += gravity;
    kiwi.y = Math.min(kiwi.y + velocityY, kiwiY); // aplica gravedad al kiwi
    context.clearRect(0, 0, boardWidth, boardHeight); // Limpiar el canvas antes de redibujar
    context.drawImage(kiwiImg, kiwi.x, kiwi.y, kiwi.width, kiwi.height);

    // cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(kiwi, cactus)) {
            gameOver = true;
            kiwiImg.src = "./img/kiwi-dead.png";
            kiwiImg.onload = function () {
                context.drawImage(kiwiImg, kiwi.x, kiwi.y, kiwi.width, kiwi.height);
            };
        }
    }

    // nubes
    for (let i = 0; i < nubeArray.length; i++) {
        let nube = nubeArray[i];
        nube.x += nubeVelocityX;
        context.drawImage(nube.img, nube.x, nube.y, nube.width, nube.height);
    }

    // aumentar la velocidad cada 200 puntos
    if (score % 200 === 0 && score > 0) {
        velocityX -= 1; // Aumenta la velocidad de los cactus
        nubeVelocityX -= 0.5; // Aumenta la velocidad de las nubes
    }

    // puntaje
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveKiwi(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && kiwi.y == kiwiY) {
        // saltar
        velocityY = -10;
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    // poner cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    };

    let placeCactusChance = Math.random(); // 0 - 0.9999...

    if (placeCactusChance > 0.90) { // 10% de tener un cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.70) { // 30% de tener un cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.50) { // 50% de tener un cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }
    if (cactusArray.length > 5) {
        cactusArray.shift(); // eliminar el primer elemento del array para evitar crecimiento constante
    }
}

function placeNube() {
    let nube = {
        img: nubeImg,
        x: nubeX,
        y: Math.random() * (boardHeight / 2), // Coloca las nubes aleatoriamente en la parte superior
        width: nubeWidth,
        height: nubeHeight
    };

    nubeArray.push(nube);

    if (nubeArray.length > 5) {
        nubeArray.shift(); // Eliminar la nube más antigua
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}