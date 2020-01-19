let fondsAmount = document.querySelectorAll(".coins-amount");
let url;
let argent = 0;
let gagneArgent = 0;
let totalArgent = gagneArgent + argent;
let correct = 0;
let missed = 0;
let index = 0;

$(".mode").click(function () {
  goToCategories();
});

$(".return").click(function () {
   goToHome();
});


function startGame() {
    let category = document.querySelectorAll(".category span");
    setStats();
    for (let i = 0; i < category.length; i++) {
        category[i].addEventListener("click", () => {
            // alert(category[i].classList);
            goToGame();
            let url = `https://opentdb.com/api.php?amount=10&category=${category[i].classList}&difficulty=easy&type=multiple`;

            fetch(url)
                .then(checkStatus)
                .then(response => response.json())
                .then(data => {
                    generateQuiz(data.results);
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

    $(".game-mode-display").html(`Difficulty: <span>${data[index].difficulty}</span>`);
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
    let correctAmount = document.querySelector(".correct-amount");
    let wrongAmount = document.querySelector(".incorrect-amount");

    correctAmount.textContent = correct.toString();
    wrongAmount.textContent = missed.toString();
    for (let i = 0; i < fondsAmount.length; i++) {
        if (localStorage.getItem("localArgent") === null) {
            fondsAmount[i].textContent = numberWithCommas(totalArgent).toString() + "$";
        } else {
            fondsAmount[i].textContent = (localStorage.getItem("localArgent")) + "$";
        }
    }
}
function guessRight() {
    index++;
    correct++;
    argent++;
    gagneArgent++;
    setStats();
}
function guessWrong() {
    index++;
    missed++;
    setStats();
}

function setResultsStats(data) {
    let difficultyLevel = document.querySelector(".results-level");
    let scored = document.querySelector(".you-scored");
    let scoredPercent = document.querySelector(".score-percentage");
    let percentage = Math.floor((correct / 10) * 100);
    let coinsGained = document.querySelector(".coins-gained");

    difficultyLevel.innerHTML = `Difficulty: ${data[0].difficulty}`;
    scored.innerHTML = "Score: " + "<span>" + correct.toString() + "/10</span>";
    scoredPercent.innerHTML = percentage.toString() + "%";
    coinsGained.innerHTML = "Coins gained: <span>" + gagneArgent.toString() + "</span>"
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
    if (supportsLocalStorage()) {
        localStorage.setItem("localArgent", JSON.stringify(totalArgent));
    }
}

function showAnswers() {

}
function whereToGo() {
    let options = document.querySelectorAll(".result-option");
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", function () {
            if (options[0]) {
                location.reload();
            } else if (options[1]) {
                hideContent("results-page");
                goToCategories();
            } else if (options[2]) {
                hideContent("results-page");
                index = 0;
                startGame();
            }
        })
    }
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function supportsLocalStorage() {
    try {
        return "localStorage" in window && window["localStorage"] !== null;
    } catch (e) {
        return false;
    }
}