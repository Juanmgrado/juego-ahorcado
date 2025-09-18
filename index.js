const wordsList = ["dog", "headphone", "house", "horse", "telephone"]
const wrongLetterTag = document.querySelector(".wrong-letter")
const dollyImgs = ["./imgs/hangman0.png", "./imgs/hangman1.png", "./imgs/hangman2.png", "./imgs/hangman3.png", "./imgs/hangman4.png"]
const dollyContainer = document.querySelector(".dolly-container")
const buttonLetters = document.querySelectorAll(".button-letter")
const wordInput = document.querySelector(".input-word")
const restartButton = document.querySelector(".restart-button")
const matchTime = document.querySelector(".input-time");
const westedWordsInput = document.querySelector(".input-wasted")
const modalsDiv = document.createElement("div")
const ONE_SECOND_INTERVAL = 1000
const THREE_SECOND_TIMEOUT = 3000
const LAST_INDEX_OFFSET = 1
let minutesLeft = 10
let numberOfChances = 4
let timerId = null;
let letterUsed = []

const timerDisplay = () => {

    if (timerId) clearInterval(timerId);

    updateDisplay(minutesLeft);

    timerId = setInterval(() => {
        if (minutesLeft <= 0) {
            clearInterval(timerId);
            buttonLetters.forEach((button) => button.disabled = true)
            wordInput.value = randomWord.join(" ")
            showModal("TIME OUT!!", `The secret word was: ${randomWord.join("")}`);
            return;
        }

        minutesLeft--;
        updateDisplay(minutesLeft);
    }, 1000);
};

const updateDisplay = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    matchTime.value = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};


const letterWrongAlert = (check) => {
    if (check.length === 0) {
        wrongLetterTag.innerText = "❌ Wrong letter"
        
        setTimeout(() => {
            wrongLetterTag.innerText = ""
        },  THREE_SECOND_TIMEOUT )
    }
}

const showModal = (title, message) => {
    modalsDiv.innerHTML = ""; 
    modalsDiv.className = "modal-congratulations";

    const titleTag = document.createElement("h2");
    titleTag.innerHTML = title;

    const messageTag = document.createElement("h3");
    messageTag.innerHTML = message;

    const buttonOk = document.createElement("button");
    buttonOk.innerHTML = "Acept";
    buttonOk.addEventListener("click", () => modalsDiv.remove());

    modalsDiv.append(titleTag, messageTag, buttonOk);

    if (!document.body.contains(modalsDiv)) {
        document.body.appendChild(modalsDiv);
    }
};

const insertDolly = (chances) => {
  dollyContainer.innerHTML = ""
  
  const index = dollyImgs.length - LAST_INDEX_OFFSET - chances

  const dollyImg = document.createElement("img")
  dollyImg.src = dollyImgs[index]
  dollyImg.alt = "hangman"
  
  dollyContainer.appendChild(dollyImg)
}

const generateRandomWord = (list) => {
    
    let randomNumber = Math.floor(Math.random() * list.length)
    const randomWord = list[randomNumber].split("")
    
    return randomWord
}

const unHiddenWord = (letter, word, hiddenWord) => {
    const indexsLetter = word.reduce((matches, character, index) => {
        if (character === letter) {
            matches.push(index)
        }
        return matches
    }, [])

    letterUsed.push(letter)
    westedWordsInput.value = letterUsed

    let partialWord = hiddenWord.map((character, index) => {
        if (indexsLetter.includes(index)) {
            return letter
        } else {
            return character
        }
    })

    if (indexsLetter.length === 0) {
        numberOfChances -= 1
        insertDolly(numberOfChances)
        letterWrongAlert(indexsLetter)

        if (numberOfChances <= 0) { 
            buttonLetters.forEach((button) => button.disabled = true)
            wordInput.value = randomWord.join("")
            clearInterval(timerId)
        }
    }

    if (indexsLetter.length > 0) {
        minutesLeft += 5
    }

    return partialWord
}

const checkWin = (word, partialWord) => {
    if (
        word.length === partialWord.length &&
        word.every((character, index) => character === partialWord[index])
    ) {
        clearInterval(timerId)
        buttonLetters.forEach((button) => button.disabled = true)
        showModal("YOU WON!", `The secret word is :${randomWord.join("")}` )
        return true
    }
    return false
}

const checkLifes = (lifes, word) => {
    
    if(lifes === 0){
        clearInterval(timerId)
        buttonLetters.forEach((button) => button.disabled = true)
        wordInput.value = word.join()
        showModal("YOU LOSE!", `The secret word is :${randomWord.join("")}` )
        return true
    }
    
    return false
}

let randomWord = generateRandomWord(wordsList)
let hiddenWord = randomWord.map(() => "_")

const initGame = () => {
    
    timerDisplay();
    insertDolly(numberOfChances);

    
    wordInput.value = hiddenWord.join(" ");

    buttonLetters.forEach((letter) => {
        letter.addEventListener("click", (event) => {
            const selectedLetter = event.target.innerText.toLowerCase();
            hiddenWord = unHiddenWord(selectedLetter, randomWord, hiddenWord);
            wordInput.value = hiddenWord.join(" ");
            
            buttonLetters.forEach(buton => {
                if (buton.innerText === event.target.innerText) buton.disabled = true;
            });
            
            if (checkWin(randomWord, hiddenWord)) return;
            if (checkLifes(numberOfChances, randomWord)) return;
        });
    });
};

const restartGame = () => {
    
    if (timerId) clearInterval(timerId);

    modalsDiv.innerHTML = ""
    minutesLeft = 10;
    numberOfChances = 4;
    insertDolly(numberOfChances);

    wrongLetterTag.innerHTML = ""
    randomWord = generateRandomWord(wordsList);
    letterUsed = [];
    westedWordsInput.value = letterUsed;

    hiddenWord = randomWord.map(() => "_");
    wordInput.value = hiddenWord.join(" ");

    buttonLetters.forEach(buton => buton.disabled = false);
    modalsDiv.remove();

    timerDisplay();
};

restartButton.addEventListener("click", restartGame);

initGame();