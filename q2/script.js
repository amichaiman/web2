var data = "";
var number_of_correct_answer_in_a_row = 0;
var difficulty = "easy";
var score = 0;

$(document).ready(function(){
    $("#difficulty").html("Difficulty: " + difficulty);
    $("#score").html("Score: " + score);
    let body = $('body');
    body.on('click', '#submit-button', function(){
        createGame();
    });
    body.on('click', '#back-button', function(){
        goToMenu();
    });
    for (let i=0; i < 4; i++){
        body.on('click', '#answer-' + i, function(event){
            console.log($(event.target).text());
            console.log(data.results[0].correct_answer);
            if ($(event.target).text() === data.results[0].correct_answer){
                $(this).css({"background-color" : "green"});
                number_of_correct_answer_in_a_row++;
                console.log("correct answer number: " + number_of_correct_answer_in_a_row);
                score += difficulty === "easy" ? 10 : difficulty === "medium" ? 30 : 80;
            } else {
                $(this).css({"background-color" : "red"});
                for (let j=0; j<4; j++){
                    if (data.results[0].correct_answer === data.results[0].incorrect_answers[j]){
                        $("#answer-" + j).css({"background-color" : "green"});
                    }
                }
                number_of_correct_answer_in_a_row = 0;
            }
            $(this).fadeOut(350, function() {
                $(this).fadeIn(350, function(){
                    createGame();
                });
            });
        });
    }
});

function goToMenu() {
    $("#menu").attr("style","display: block");
    $("#game").attr("style","display: none");
}

function createGame() {
    let question_type = $("#question_type :selected").val();
    let category = $("#trivia_category :selected").val();
    let url = "https://opentdb.com/api.php?amount=1" +
        (category === "any" ? "" : "&category=" + category) +
        (question_type === "any" ? "" : "&type=" + question_type) +
        "&difficulty=" + difficulty;
    $("#menu").attr("style","display: none");
    $("#game").attr("style","display: block");

    function getData() {
        $.ajax({
            url: url,
            type: "get",
            data: "xml",
            success: function(result) {
                data = result;
                displayQuestion();
            },
            error: function(){
                alert("error");
            }
        });
    }
    getData()
}
function displayQuestion(){
    $("#score").html("Score: " + score);
    if (number_of_correct_answer_in_a_row === 3) {
        difficulty = (difficulty === "easy") ? "medium" : "hard";
        $("#difficulty").html("Difficulty: " + difficulty);
    }
    /* display question and answers */
    $("#question").html(data.results[0].question);
    let answers = $("#answers");
    answers.html("");
    if (data.results[0].type === "multiple"){
        /* append correct answer to incorrect answers */
        data.results[0].incorrect_answers.push(data.results[0].correct_answer);
        /* shuffle array */
        shuffle(data);
        for (let j=0; j<data.results[0].incorrect_answers.length; j++){
            answers.append('<a href="#" id="answer-' + j + '" class="btn btn-primary">' + data.results[0].incorrect_answers[j] + '</a>');
        }
    } else {
        answers.append('<a href="#" id="answer-0" class="btn btn-primary">True</a>');
        answers.append('<a href="#" id="answer-1" class="btn btn-primary">False</a>');
    }
}
function shuffle(data) {
    for (let i=0; i<100; i++){
        let index1 = Math.floor(Math.random()*(data.results[0].incorrect_answers.length));
        let index2;
        do {
            index2 = Math.floor(Math.random()*(data.results[0].incorrect_answers.length));
        } while (index1 === index2);
        let temp = data.results[0].incorrect_answers[index1];
        data.results[0].incorrect_answers[index1] = data.results[0].incorrect_answers[index2];
        data.results[0].incorrect_answers[index2] = temp;
    }
}
