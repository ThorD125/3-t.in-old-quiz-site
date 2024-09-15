let questions = [];
let currentQuestionIndex = 0;

const questionText = document.getElementById('question-text');
const answerButtons = document.querySelectorAll('.btn');
const header = document.querySelector('h1');
const feedbackText = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const questionCounter = document.getElementById('question-counter');
const goodJobAnimation = document.getElementById('good-job-animation');
const quizContainer = document.getElementById('quiz-container');
const examSelection = document.getElementById('exam-selection');

fetch('/exams.json')
  .then(response => response.json())
  .then(exams => {
    populateExamDropdown(exams);
  })
  .catch(error => console.error("Error loading exams:", error));

function populateExamDropdown(exams) {
  exams.forEach(exam => {
    const option = document.createElement('option');
    option.value = exam.file;
    option.textContent = exam.title;
    examSelection.appendChild(option);
  });
}

examSelection.addEventListener('change', () => {
  const selectedExam = examSelection.value;
  if (selectedExam) {
    loadExam(`exam/${selectedExam}`);
  }
});

function loadExam(examFile) {
  fetch(examFile)
    .then(response => response.json())
    .then(data => {
      questions = data;
      shuffleArray(questions);
      currentQuestionIndex = 0;
      updateQuestionCounter();
      setNextQuestion();
      quizContainer.style.display = 'block';
    })
    .catch(error => console.error("Error loading exam:", error));
}

nextBtn.addEventListener('click', () => {
  feedbackText.textContent = '';
  feedbackText.style.color = '';
  nextBtn.style.display = 'none';
  enableAnswerButtons();
  resetButtonColors();

  updateQuestionCounter();
  setNextQuestion();
});

function setNextQuestion() {
  if (questions.length == 0) {
    showGoodJobAnimation();
    return;
  }

  let question = questions[currentQuestionIndex];
  if (!question) {
    currentQuestionIndex = Math.floor(Math.random() * questions.length);
    question = questions[currentQuestionIndex];
  }
  questionText.textContent = question.question;
  answerButtons.forEach(button => {
    button.classList.add("hidden");
    const option = button.getAttribute('data-option');
    if (question.options[option] != undefined) {
      button.textContent = question.options[option];
      button.classList.remove("hidden");
    }
  });
}

answerButtons.forEach(button => {
  button.addEventListener('click', selectAnswer);
});

function selectAnswer(e) {
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion) {
    const selectedOption = e.target.getAttribute('data-option');

    disableAnswerButtons();

    if (currentQuestion.answer.includes(selectedOption)) {
      delete questions[currentQuestionIndex];
      questions = questions.filter(x => x != "empty")
      e.target.classList.add('correct');
      feedbackText.textContent = `Correct!`;
      feedbackText.style.color = '#4CAF50';
    } else {
      e.target.classList.add('wrong');
      feedbackText.textContent = `Wrong!`;
      feedbackText.style.color = '#f44336';

      answerButtons.forEach(button => {
        if (currentQuestion.answer.includes(button.getAttribute('data-option'))) {
          button.classList.add('correct');
        } else {
          button.classList.add('wrong')
        }
      });

      questions.push(currentQuestion);
    }

    nextBtn.style.display = 'block';
    currentQuestionIndex++;
    updateQuestionCounter();
  } else {
    console.error("No question available to select an answer for.");
  }
}

function disableAnswerButtons() {
  answerButtons.forEach(button => {
    button.disabled = true;
  });
}

function enableAnswerButtons() {
  answerButtons.forEach(button => {
    button.disabled = false;
  });
}

function resetButtonColors() {
  answerButtons.forEach(button => {
    button.classList.remove('correct', 'wrong');
    button.classList.add('hidden');
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateQuestionCounter() {
  const remainingQuestions = questions.length;
  questionCounter.textContent = `Questions left: ${remainingQuestions}`;
}

function showGoodJobAnimation() {
  quizContainer.style.display = 'none'
  goodJobAnimation.style.marginTop = '0'
  header.style.display = 'none'
  questionText.style.display = 'none';
  document.getElementById('answer-buttons').style.display = 'none';
  nextBtn.style.display = 'none';
  questionCounter.style.display = 'none';
  feedbackText.textContent = '';

  goodJobAnimation.classList.remove('hidden');
  goodJobAnimation.style.display = 'block';
}
