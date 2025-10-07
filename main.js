let questionSpanCount = document.querySelector(".count span");
let bulletsConatainer = document.querySelector(".bullets");
let bulletsSpanConatainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".result");
let countDownContainer = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let qCount = questionObject.length;
      createBullets(qCount);

      addQuestionData(questionObject[currentIndex], qCount);

      countDown(90, qCount);

      submitButton.onclick = () => {
        let theRightAnswer = questionObject[currentIndex].right_answer;

        checkAnswer(theRightAnswer, qCount);

        currentIndex++;

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        if (currentIndex < qCount) {
          addQuestionData(questionObject[currentIndex], qCount);
          // Handel Bullets
          handelBullets();
          clearInterval(countDownInterval);
          countDown(90, qCount);
        } else {
          showResult(qCount);
        }
      };
    }
  };

  myRequest.open(
    "GET",
    "https://raw.githubusercontent.com/you36ossef/quiz-data/refs/heads/main/html_questions.json",
    true
  );
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  questionSpanCount.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");

    if (i === 0) {
      bullet.className = "on";
    }

    bulletsSpanConatainer.appendChild(bullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let question = document.createElement("h2");
    let questionText = document.createTextNode(obj.title);
    question.appendChild(questionText);
    quizArea.appendChild(question);

    // ---------

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "questions";
      radioInput.id = `answer_${i}`;
      radioInput.type = `radio`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }
      mainDiv.appendChild(radioInput);

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(theLabel);

      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let theChossenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChossenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChossenAnswer) {
    rightAnswer++;
  }
}

function handelBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let spansArray = Array.from(bulletsSpans);
  spansArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsConatainer.remove();
    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResult = `<span class ="good">Good</span> ,${rightAnswer} from ${count}`;
    } else if (rightAnswer === count) {
      theResult = `<span class ="perfect">Perfect</span>, All Answers Is Right `;
    } else {
      theResult = `<span class ="bad">Bad</span> ,${rightAnswer} from ${count}`;
    }

    resultsContainer.innerHTML = `${theResult}<br><br> <button class="restart-button">Restart Quiz</button>`;

    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
    resultsContainer.style.fontSize = "25px";
    resultsContainer.style.textAlign = "center";

    let restartBtn = document.querySelector(".restart-button");
    restartBtn.onclick = () => {
      window.location.reload();
    };

  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;

    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownContainer.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

