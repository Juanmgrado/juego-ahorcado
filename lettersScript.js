
const lettersContainer = document.querySelector(".letters-container")

const alphabetic = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"

const letters = alphabetic.split("")

letters.map(letter => {
    
    const letterButton = document.createElement("button")
    
    letterButton.className = "button-letter"
    letterButton.innerText = letter

    lettersContainer.appendChild(letterButton)
})