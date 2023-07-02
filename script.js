const numCards = 12

const cardTypes = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"]
const suites = ["clubs", "diamonds", "hearts", "spades"]

let gameBoard = document.getElementById("game-board")
for(let i = 0; i < numCards; i++) {
    let card = document.createElement("div")
    card.setAttribute("class", "memory-card")

    let frontFace = document.createElement("img")
    frontFace.setAttribute("class", "front-face")

    let backFace = document.createElement("div")
    backFace.setAttribute("class", "back-face")

    card.append(frontFace, backFace)
    gameBoard.appendChild(card)
}

document.getElementById("reset").onclick = () => {
    hideModal()

    setTimeout(() => {
        initBoard()
    }, 300)
}

let cards = document.querySelectorAll('.memory-card')
let cardImages = []
let numMatches = 0
let numTries = 0
let startTime = -1
let gameTime = 0

let lockBoard = false
let firstCardFlipped = false
let firstCard, secondCard

let timerLog

initBoard()

function initBoard() {
    cards = document.querySelectorAll('.memory-card')
    getCardImages()
    numMatches = 0
    numTries = 0

    cards.forEach((card, i) => {
        card.classList.remove("flip")
    })

    let poses = Array.from(Array(numCards).keys())
    cards.forEach((card, i) => {
        card.style.order = poses.splice(Math.floor(Math.random() * poses.length), 1)[0]
        card.setAttribute("data-card", cardImages[i])

        card.children[0].setAttribute("src", "assets/cards/" + cardImages[i] + ".png")

        card.addEventListener('click', flipCard)
    })

    resetBoard()
}

function getCardImages() {
    cardImages = []

    for(let i = 0; i < numCards / 2; i++) {
        let rType = cardTypes[Math.floor(Math.random() * cardTypes.length)]
        let rSuite = suites[Math.floor(Math.random() * suites.length)]

        while(cardImages.includes(rType + "_of_" + rSuite)) {
            rType = cardTypes[Math.floor(Math.random() * cardTypes.length)]
            rSuite = suites[Math.floor(Math.random() * suites.length)]
        }

        cardImages.push(rType + "_of_" + rSuite, rType + "_of_" + rSuite)
    }
}

function flipCard() {
    if (lockBoard) return
    if (this === firstCard) return

    if (startTime === -1) startTimer()
    this.classList.add('flip')

    if (!firstCardFlipped) {
        firstCard = this
        firstCardFlipped = true
    } else {
        secondCard = this
        checkForMatch()
    }
}

function checkForMatch() {
    numTries++

    if (firstCard.dataset.card === secondCard.dataset.card) {
        disableCards()

        numMatches++
        if(numMatches >= numCards / 2) {
            stopTimer()
            lockBoard = true

            setTimeout(() => {
                gameOver()
            }, 1000)
        }
    } else {
        unflipCards()
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard)
    secondCard.removeEventListener('click', flipCard)

    resetBoard()
}

function unflipCards() {
    lockBoard = true

    setTimeout(() => {
        firstCard.classList.remove('flip')

        setTimeout(() => {
            secondCard.classList.remove('flip')
            resetBoard()
        }, 100)
    }, 700)
}
function resetBoard() {
    [firstCardFlipped, lockBoard] = [false, false]
    [firstCard, secondCard] = [null, null]
}

function gameOver() {
    let stats = document.getElementById("stats")
    stats.children[0].innerHTML = numTries + " Tries"
    stats.children[2].innerHTML = convertMilliseconds(gameTime)

    showModal()
}

function showModal() {
    document.getElementById("modal").style.display = 'flex';
}

function hideModal() {
    document.getElementById("modal").style.display = 'none';
}

function convertMilliseconds(milliseconds) {
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + 'm ' + seconds + 's';
}

function startTimer() {
    startTime = Date.now()
    console.log("Starting Timer")
    timerLog = setInterval(() => {
        console.log(Date.now() - startTime)
    }, 1000)
}

function stopTimer() {
    gameTime = Date.now() - startTime
    clearInterval(timerLog)
    console.log("Stopping Timer")
    startTime = -1
}