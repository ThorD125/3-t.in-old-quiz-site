'use strict';

function populateExamDropdown(exams) {
  exams.forEach(exam => {
    const option = document.createElement('option');
    option.value = exam.file;
    option.textContent = exam.title;
    examSelection.appendChild(option);
  });
}

function countUnique(arr) {
  const countMap = new Map();
  arr.forEach(obj => {
    countMap.set(obj.question, (countMap.get(obj.question) || 0) + 1);
  });

  let unique = 0;
  countMap.forEach(value => {
    if (value == 1) {
      unique += 1;
    }
  });
  const totals = Array.from(countMap.keys()).length

  return { "unique": unique, "total": totals, "dupes": totals - unique };
}
function loadExam(examFile) {
  fetch(examFile)
    .then(response => response.json())
    .then(data => {
resetAnimations();
      fetchedQuestions = data;
      questions = fetchedQuestions.filter(x => x.question.length < sliderMax.value);

      populateExams();
    })
    .catch(error => console.error('Error loading exam:', error));
}

function resetAnimations(){
        quizContainer.style.display = '';
      header.style.display = '';
      questionText.style.display = '';
      answerButtonContainer.style.display = '';
      nextBtn.style.display = '';
      questionCounter.style.display = '';
      goodJobAnimation.style.display = 'none';
}

function populateExams() {
  resetAnimations();
  hideGoodJobAnimation();
  shuffleArray(questions);
  currentQuestionIndex = 0;
  updateQuestionCounter();
  setNextQuestion();
  randomizeButtons()
  quizContainer.style.display = 'block';
}

function visualLoadCounters() {
  document.querySelector("h1 span").textContent = `correct streak${correctstreak}- most correct streak${bestStreak}`;
  questionCounter.textContent = `Total questions left: ${remainingQuestions} (${uniqueCount.unique + uniqueCount.dupes}unique questions)`;
}

function setNextQuestion() {
  
  delete questions[currentQuestionIndex];
  questions = questions.filter(x => x != 'empty');
  
  visualLoadCounters();
  
  if (questions.length == 0) {
    showGoodJobAnimation();
    return;
  }
  currentQuestionIndex = Math.floor(Math.random() * questions.length);
  const question = questions[currentQuestionIndex];

  questionText.textContent = question.question;

  resetButtonColors();

  Object.keys(question.options).forEach(key => {
    const button = document.createElement('button');
    button.className = 'btn';
    button.setAttribute('data-option', key);
    button.innerHTML = question.options[key];
    button.addEventListener('click', selectAnswer);

    answerButtonContainer.appendChild(button);
  });
}

function selectAnswer(e) {
  const currentQuestion = questions[currentQuestionIndex];
  e.target.classList.toggle('selected');

  const selectedAnswers = document.querySelectorAll('.btn.selected');
  const answerAmount = currentQuestion.answer.length;
  if (selectedAnswers.length != answerAmount) {
    return;
  }

  if (currentQuestion) {
    const selectedAnswersFiltered = Array.from(selectedAnswers)
      .map(x => x.getAttribute('data-option'));

    disableAnswerButtons();

    if (arraysAreEqual(currentQuestion.answer, selectedAnswersFiltered)) {
      answerButtonContainer.classList.add('correct');
      e.target.classList.add('correct');
      feedbackText.textContent = `Correct!`;
      feedbackText.style.color = '#4CAF50';
      correctstreak += 1;
    } else {
      answerButtonContainer.classList.add('wrong');
      e.target.classList.add('wrong');
      feedbackText.textContent = `Wrong!`;
      feedbackText.style.color = '#f44336';

      correctstreak = 0;


      questions.push(currentQuestion);
    }
    
    if (bestStreak < correctstreak) {
        bestStreak = correctstreak;
      }
    
    answerButtonContainer.querySelectorAll("button").forEach(button => {
      if (currentQuestion.answer.includes(button.getAttribute('data-option'))) {
        button.classList.add('correct');
      } else {
        button.classList.add('wrong');
      }
    });

    nextBtn.style.display = 'block';

    updateQuestionCounter();
  } else {
    console.error('No question available to select an answer for.');
  }
}

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  let sortedArr1 = arr1.slice().sort();
  let sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i].toString() !== sortedArr2[i].toString()) {
      return false;
    }
  }

  return true;
}

function disableAnswerButtons() {
  answerButtonContainer.querySelectorAll("button").forEach(button => {
    button.disabled = true;
  });
}

function resetButtonColors() {
  answerButtonContainer.querySelectorAll("button").forEach(button => {
    button.remove();
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateQuestionCounter() {
  remainingQuestions = questions.length;
  uniqueCount = countUnique(questions);
}

function hideGoodJobAnimation() { 
  goodJobAnimation.style.display = 'none';
  goodJobAnimation.classList.add('hidden');
}

function showGoodJobAnimation() {
  quizContainer.style.display = 'none';
  header.style.display = 'none';
  questionText.style.display = 'none';
  answerButtonContainer.style.display = 'none';
  nextBtn.style.display = 'none';
  questionCounter.style.display = 'none';
  feedbackText.textContent = '';
  goodJobAnimation.style.display = 'block';
  goodJobAnimation.classList.remove('hidden');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

function randomizeButtons() {
  const container = document.querySelector("#answer-buttons");
  const buttons = Array.from(container.querySelectorAll("button"));
  for (let i = buttons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
  }
  container.innerHTML = '';
  buttons.forEach(button => container.appendChild(button));
}

let bestStreak = 0;
let correctstreak = 0;
let uniqueCount = 0;
let remainingQuestions = 0;
let fetchedQuestions = [];
let questions = [];
let currentQuestionIndex = 0;

const questionText = document.getElementById('question-text');
const header = document.querySelector('h1');
const feedbackText = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const questionCounter = document.getElementById('question-counter');
const goodJobAnimation = document.getElementById('good-job-animation');
const quizContainer = document.getElementById('quiz-container');
const examSelection = document.getElementById('exam-selection');
const answerButtonContainer = document.getElementById('answer-buttons');
const examSelectionContainer = document.getElementById('exam-selection-container');
const explain = document.getElementById("explain");

fetch('/exams.json')
  .then(response => response.json())
  .then(exams => {
    populateExamDropdown(exams);
  })
  .catch(error => console.error('Error loading exams:', error));

examSelection.addEventListener('change', () => {
  const selectedExam = examSelection.value;
  if (selectedExam) {
    loadExam(`exam/${selectedExam}`);
  }
});

nextBtn.addEventListener('click', () => {
  answerButtonContainer.classList.remove('correct', 'wrong');
  feedbackText.textContent = '';
  feedbackText.style.color = '';
  nextBtn.style.display = 'none';
  resetButtonColors();

  updateQuestionCounter();
  setNextQuestion();
  randomizeButtons();
});

explain.addEventListener("click", ex => {
  let text = "Can you please explain:\n\n";
  const currentQuestion = questions[currentQuestionIndex];
  text += currentQuestion.question + "\n";
  Object.keys(currentQuestion.options).forEach(key => {
    text += "-" + currentQuestion.options[key] + "\n";
  })
  copyToClipboard(text);
})

function fixSliders(slider, output) {
  output.innerHTML = slider.value;

  slider.oninput = function () {
    output.innerHTML = this.value;
    populateExams();
  }
}


const sliderMax = document.getElementById("rangeSliderMax");
const outputMax = document.getElementById("sliderValueMax");
fixSliders(sliderMax, outputMax);
sliderMax.oninput = function () {
 if (!(sliderMin.value < sliderMax - sliderMin.step)) {
      sliderMax.value = sliderMin.value + sliderMin.step;
      outputMax.innerHTML = sliderMax.value;
      console.log("testslidmax");
    }
  questions = fetchedQuestions.filter(x => {
      return sliderMin.value < x.question.length && x.question.length < sliderMax.value;
    });
}



const sliderMin = document.getElementById("rangeSliderMin");
const outputMin = document.getElementById("sliderValueMin");
fixSliders(sliderMin, outputMin);
sliderMin.oninput = function () {
    if (!(sliderMin.value + sliderMax.step < sliderMax.value)) {
      sliderMin.value = sliderMax.value - sliderMax.step;
      outputMin.innerHTML = sliderMin.value;
      console.log("testslidmin");
    }
  questions = fetchedQuestions.filter(x => {
      return sliderMin.value < x.question.length && x.question.length < sliderMax.value;
    });
  }

const sliderAmount = document.getElementById("maxAmount");
const outputMaxAmount = document.getElementById("sliderValueMaxAmount");
fixSliders(sliderAmount, outputMaxAmount);

sliderAmount.oninput = function () {
  questions = fetchedQuestions.slice(0, this.value);
  populateExams();
}
