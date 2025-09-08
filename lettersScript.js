
const lettersContainer = document.querySelector(".letters-container")

const ALPHABETIC = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" 
]

ALPHABETIC.map(letter => {
    
    const buttonLetters = document.createElement("button")
    
    buttonLetters.className = "button-letter"
    buttonLetters.innerText = letter

    lettersContainer.appendChild(buttonLetters)
})