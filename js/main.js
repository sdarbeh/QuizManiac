let correct = 0;
let missed = 0;
let index = 0;
let gameMode;
const hundredScoreMessage = [
    "Congratulations and BRAVO!",
    "This calls for celebrating! Congratulations!",
    "You did it! So proud of you!",
    "I knew it was only a matter of time. Well done!"
];
const midScoreMessage = [
    "Good job, you're so close to a 100%",
    "So close, keep it up!",
    "Wow! Good job",
    "Awesome! Can you get a 100% next time? I know you can!"
];
const failScoreMessage = [
    "Better luck next time!",
    "Keep your head up champ!",
    "You got this! Try again?",
    "Oh no, looks like the game level was too hard?"
];

$(".mode").click(function (e) {
    goToCategories();
    if (e.target.textContent === "Easy") {
        gameMode = "easy"
    } else if (e.target.textContent === "Medium") {
        gameMode = "medium"
    } else {
        gameMode = "hard"
    }

});

$(".return").click(function () {
   goToHome();
});


function startGame() {
    let category = document.querySelectorAll(".category span");
    setStats();
    for (let i = 0; i < category.length; i++) {
        category[i].addEventListener("click", () => {

            goToGame();

            let url = `https://opentdb.com/api.php?amount=10&category=${category[i].classList}&difficulty=${gameMode}&type=multiple`;

            fetch(url)
                .then(checkStatus)
                .then(response => response.json())
                .then(data => {
                    generateQuiz(data.results);
                    viewAnswers(data.results);
                })
                .catch(error => {
                    $(".question").html("Oops! An error occurred. Please refresh and try again.");
                    console.log("Looks like there was an problem!", error)
                });

            function checkStatus(response) {
                if(response.ok) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            }
        })
    }
} startGame();

function generateQuiz(data) {
    if (gameMode === "hard") {
        gameMode = "M A N I A C"
    }
    $(".game-mode-display").html(`Difficulty: <span>${gameMode}</span>`);
    $(".game-category").html(`${data[index].category}`);
    $(".current-question").html(index + 1 +"/10");
    $(".question").html(`${data[index].question}`);

    $(".choice1").html(`${data[index].incorrect_answers[0]}`);
    $(".choice2").html(`${data[index].incorrect_answers[1]}`);
    $(".choice3").html(`${data[index].incorrect_answers[2]}`);
    $(".choice4").html(`${data[index].correct_answer}`);

    $(".choice").shuffle();
    checkAnswer(data);
}

function checkAnswer(data) {
    let choice = document.querySelectorAll(".choice");

    for (let i = 0; i < choice.length; i++ ) {
        choice[i].addEventListener("click", () => {

            if (choice[i].innerHTML === data[index].correct_answer) {

                if (index < 9) {
                    guessRight();
                    generateQuiz(data);
                } else {
                    guessRight();
                    goToResults();
                    setResultsStats(data);
                }

            } else {

                if (index < 9) {
                    guessWrong();
                    generateQuiz(data);
                } else {
                    guessWrong();
                    goToResults();
                    setResultsStats(data);
                }
            }
        })
    }
}

function setStats() {
    $(".correct-amount").html(correct.toString());
    $(".incorrect-amount").html(missed.toString());
}

function guessRight() {
    index++;
    correct++;
    setStats();
}
function guessWrong() {
    index++;
    missed++;
    setStats();
}

function setResultsStats(data) {
    let difficultyLevel = document.querySelector(".results-level");
    let gameCategory = document.querySelector(".result-game-category");
    let scored = document.querySelector(".you-scored");
    let scoredPercent = document.querySelector(".score-percentage");
    let percentage = Math.floor((correct / 10) * 100);
    let message = document.querySelector(".message");
    let randomNumber = Math.round(Math.random() * 4);

    difficultyLevel.innerHTML = `Difficulty: ${data[0].difficulty}`;
    gameCategory.innerHTML = `Category <br><span>${data[0].category}</span>`;
    scored.innerHTML = "Score: " + "<span>" + correct.toString() + "/10</span>";
    scoredPercent.innerHTML = percentage.toString() + "%";

    if (percentage === 100) {
        message.innerHTML = hundredScoreMessage[randomNumber];
        scoredPercent.style.color = "green"
    } else if (percentage <= 90 && percentage > 60) {
        message.innerHTML = midScoreMessage[randomNumber];
        scoredPercent.style.color = "green"
    } else {
        message.innerHTML = failScoreMessage[randomNumber];
        scoredPercent.style.color = "red"
    }
}

function goToCategories() {
    $("#category-page").css("display", "unset");
    $("body").css("height", "100%");
    hideContent("homepage", "fixed-settings");
}
function goToHome() {
    hideContent("category-page", "category-head");
    showContent("homepage", "fixed-settings");
    $("body").css("height", "100vh");
}
function goToGame() {
    hideContent("category-page");
    showContent("game-page", "category-head");
}
function goToResults() {
    hideContent("game-page", "category-head");
    showContent("results-page");
    whereToGo();
}

function whereToGo() {
    $(".result-option").on("click", function () {
        location.reload();
    })
}

function hideContent() {
    if (arguments.length > 0){
        for(let i=0; i < arguments.length; i++){
            document.getElementById(arguments[i]).style.display = "none";
        }
    }
}
function showContent() {
    if (arguments.length > 0){
        for(let i=0; i < arguments.length; i++){
            document.getElementById(arguments[i]).style.display = "block";
        }
    }
}

function openAndCloseViewAnswers() {
    $(".view-answers").on("click", function () {
        $(".results").css("display", "unset")
    });

    $(".close-modal").on("click", function () {
        $(".results").css("display", "none")
    })
} openAndCloseViewAnswers();

function viewAnswers(data) {
    let results = document.querySelector(".result-content");
    for (let i = 0; i < data.length; i++) {

        results.innerHTML += `
        <div class="review-question">
                        <h4>${data[i].question}</h4>
                        <h5>Correct answer:</h5>
                        <p>${data[i].correct_answer}</p>
                        <h5>Incorrect answer(s):</h5>
                        <p>${data[i].incorrect_answers[0]}</p>
                        <p>${data[i].incorrect_answers[1]}</p>
                        <p>${data[i].incorrect_answers[2]}</p>
                    </div>
            `
    }
}

(function($){
    $.fn.shuffle = function() {
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
            });
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
        return $(shuffled);
    };
})(jQuery);