document.addEventListener("DOMContentLoaded",() =>{
    createSquare();
    let word; //Guess word
    getWordle();

    const keys = document.querySelectorAll(".keyboard-row button");
    const messageDisplay = document.querySelector('.message-container')

    let guessedWords = [[]];
    let availableSpace = 1; //Next avalable Space

    let guessedWordCount = 0;

    function getWordle(){
        fetch("http://127.0.0.1:8000/word")
        .then(response => response.json())
        .then(json =>{
            console.log(json);
            word = json
        })
        .catch(err => console.log(err))
    }
    function getCurrentWordArr(){
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1] //Last word array in array of guesswords
    }

    function updateGuessedWords(letter){
        const currentWordArr = getCurrentWordArr();

        if(currentWordArr && currentWordArr.length < 5){
            currentWordArr.push(letter); //Push LETTER to current word araray

            const availableSpaceEl = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1; //Update available Space

            availableSpaceEl.textContent = letter; //Appear LETTER on HTML
        }
    }
    function handleDeleteLetter(){
                
        if(getCurrentWordArr().length !== 0){
            const currentWordArr = getCurrentWordArr();
            const removedLetter = currentWordArr.pop();
            guessedWords[guessedWords.length - 1] = currentWordArr;
            
            const lastLetterEl = document.getElementById(String(availableSpace - 1));

            lastLetterEl.textContent = ''; //Update last Letter = ''
            availableSpace = availableSpace - 1; //Update available Space after delete

        }
    }

    function showMessage(message){
        const messageEl = document.createElement('p')
        messageEl.textContent = message
        messageDisplay.append(messageEl)

        setTimeout(() => messageDisplay.removeChild(messageEl),1500)
    }

    function getTileColor(letter,index){
        
        //LETTER in Guessword and in correct position
        if (letter == word[index]){
            return "rgb(83,141,78)"; 
        }
        //LETTER in Guessword and not in correct position
        else if (word.includes(letter)){
            return "rgb(181,159,59)"; //LETTER not in Guessword
        }
        
        else return "rgb(58,58,60)";
    }
    function handleSubmitWord(){

        const currentWordArr = getCurrentWordArr();
        if(currentWordArr.length !== 5){
            showMessage("Not enough letters");
            return;
        }
        const currentWord = currentWordArr.join('');
        
        firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        //Apply flip animation
        currentWordArr.forEach((letter,index)=>
        {
            setTimeout(() =>{
                const tileColor = getTileColor(letter,index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);

                const keyletterEl = document.getElementById(letter);
                
                //Add animate flip in X
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor}; border-color:${tileColor}`;
                
                keyletterEl.style = `background-color:${tileColor}; border-color:${tileColor}`;
            }, interval * index)
        })

        guessedWordCount += 1;

        if(currentWord === word){
            // window.alert("Congratulation!")
            showMessage("Congratulation!")
        }

        if (guessedWords.length === 6){
            // window.alert(`You lose, the word is ${word}.`)
            showMessage("You lose!")

        }
        guessedWords.push([]);
    }
    //Create 5x6 Square
    function createSquare(){
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            //Initialize animate
            square.classList.add("animate__animated");
            square.setAttribute("id",index +1);
            gameBoard.appendChild(square);
            
        }
    }

    //Get key onclick
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute("data-key")
            
            if (letter === 'enter'){
                handleSubmitWord();
                // console.log(getCurrentWordArr());

                return;
            }
            if (letter == 'del'){
                handleDeleteLetter();
                // console.log(getCurrentWordArr());
                // console.log(getCurrentWordArr().length);

                return;
            }

            updateGuessedWords(letter);
        };
        
    }
})