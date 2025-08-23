const wordsList = ["papa", "perro", "auricular", "alpargata"]
const buttonsLetters = document.querySelectorAll(".button-letter")
const wordInput = document.querySelector(".input-word")
const matchTime = document.querySelector(".input-time");
const westedWordsInput = document.querySelector(".input-wasted")

let timeLeft = 5* 60;
let life = 2
let timerId; 
let trashWord = []
const startCountdown = (duration) => {
    let timeLeft = duration; 
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        matchTime.value = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            alert("SE HA AGOTADO EL TIEMPO!");
            buttonsLetters.forEach((button) => button.disabled = true);
            wordInput.value = randomWord;
        }

        if (life < -1) {
            clearInterval(timer);
        }

    }, 1000);

    return timer; 
};

timerId = startCountdown(timeLeft);

const generateRandomWord = (list) => {
    
    const listLength = list.length
    let randomNumber = Math.floor(Math.random() * listLength)
    const randomWord = list[randomNumber].split("")
    
    return randomWord
}

const randomWord = generateRandomWord(wordsList)
let hiddenWord = randomWord.map(() => "_")

wordInput.value = hiddenWord

const unHiddenWord = (letter, word, hiddenWord) => {
    const indexsLetter = word.reduce((matches, character, index) => {
        if (character === letter) {
            matches.push(index)
        }
        return matches
    }, [])
console.log(trashWord);

   trashWord.push(letter)
   westedWordsInput.value = trashWord

    let partialWord = hiddenWord.map((character, index) => {
        if (indexsLetter.includes(index)) {
            return letter
        } else {
            return character
        }
    })

    
    if (indexsLetter.length === 0 && life >= 1) {
        life -= 1;
        alert ("ACABAS DE PERDER 1 VIDA!")
        return partialWord
    }

    if (indexsLetter.length > 0) {
        clearInterval(timerId);         
        timerId = startCountdown(5*60); 
    }

    return partialWord
}

const checkWin = (word, partialWord) => {
    if (
        word.length === partialWord.length &&
        word.every((character, index) => character === partialWord[index])
    ) {
        alert(`FELICITACIONES HAS GANADO, LA PALABRA ES: ${word.join("").toUpperCase()}`)
        clearInterval(timerId)
        buttonsLetters.forEach((button) => button.disabled = true)
    }
}

const checkLifes = (lifes, word) => {
    
    if(lifes === 0){
        alert ("NO TE QUEDAN MAS VIDAS!")
        clearInterval(timerId)
        buttonsLetters.forEach((button) => button.disabled = true)
        return wordInput.value = word
    }
        

}

const knowWord = () => {
    buttonsLetters.forEach((letter) => {
        letter.addEventListener("click", (event) => {
            
            if (checkLifes(life, randomWord)) return

            const selectedLetter = event.target.innerText;
            const letterLower = selectedLetter.toLowerCase()

            hiddenWord = unHiddenWord(letterLower, randomWord, hiddenWord)
            wordInput.value = hiddenWord  
            
             buttonsLetters.forEach(buton => {
                if(buton.innerText === event.target.innerText)
                    buton.disabled = true;
            })

            if(checkWin(randomWord, hiddenWord)) return
        })
    })
}

knowWord()
