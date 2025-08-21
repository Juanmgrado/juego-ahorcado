const wordsList = ["papa", "perro", "auricular", "alpargata"]
const wordListLength = wordsList.length
const buttonsLetters = document.querySelectorAll(".button-letter")
let randomNumber = Math.floor(Math.random() * wordListLength)
const wordInput = document.querySelector(".input-word")
const randomWord = wordsList[randomNumber].split("")
let hiddenWord = randomWord.map(() => "_")
let life = 2
wordInput.value = hiddenWord

const unHiddenWord = (letter, word, hiddenWord) => {
    const indexsLetter = word.reduce((matches, character, index) => {
        if (character === letter) {
            matches.push(index)
        }
        return matches
    }, [])

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

    return partialWord
}

const checkWin = (word, partialWord) => {
    if (
        word.length === partialWord.length &&
        word.every((character, index) => character === partialWord[index])
    ) {
        alert(`FELICITACIONES HAS GANADO, LA PALABRA ES: ${word.join("").toUpperCase()}`)
        return buttonsLetters.forEach((button) => button.disabled = true)
    }
}

const checkLifes = (lifes, word) => {
    
    if(lifes === 0){
        alert ("NO TE QUEDAN MAS VIDAS!")
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
            checkWin(randomWord, hiddenWord)
        })
    })
}


knowWord()
