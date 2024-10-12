const questions = {
    level1: [
        { question: "Какой породы кошки чаще всего встречается?", answers: ["Сиамская", "Персидская", "Мейн-кун", "Британская"], correct: 0 },
        { question: "Сколько жизней у кота по народным поверьям?", answers: ["5", "7", "9", "11"], correct: 2 },
        { question: "Какой кот является символом Нью-Йорка?", answers: ["Снупи", "Гарбунг", "Боб", "Хемингуэй"], correct: 3 }
    ],
    level2: [
        { question: "Какой кот может иметь характерный окрас 'тапочки'?", answers: ["Сиамская", "Британская", "Персидская", "Мейн-кун"], correct: 0 },
        { question: "Сколько коты могут спать в день?", answers: ["10-12 часов", "12-16 часов", "16-20 часов", "20-24 часа"], correct: 1 },
        { question: "Какой из этих котов является гибридом домашних и диких кошек?", answers: ["Мейн-кун", "Бенгальская", "Сиамская", "Рэгдолл"], correct: 1 }
    ],
    level3: [
        { question: "Как называется самый маленький кот в мире?", answers: ["Сфинкс", "Кот-кун", "Сиамская", "Бобтейл"], correct: 1 },
        { question: "Какое заболевание чаще всего встречается у кошек?", answers: ["Ожирение", "Сахарный диабет", "Кошачий лейкоз", "Аллергии"], correct: 0 },
        { question: "Какую пищу нельзя давать кошкам?", answers: ["Мясо", "Рыба", "Шоколад", "Молоко"], correct: 2 }
    ]
};

const theory = {
    level1: "Сиамские кошки - это одна из самых популярных пород благодаря своей красоте и дружелюбному характеру. По народным поверьям, у котов 9 жизней, что делает их почти бессмертными. Символом Нью-Йорка стал кот Хемингуэя, известный своими полудлинными шершащими усами.",
    level2: "Сиамские кошки могут иметь характерный окрас 'тапочки', который представляет собой белую шерсть с темными отметинами на ушах, мордочке и лапках. Коты спят в среднем от 12 до 16 часов в день, а Бенгальская кошка является гибридом домашних и диких кошек.",
    level3: "Самый маленький кот в мире - Кот-кун, который обычно не превышает 30 см в высоту. Ожирение и диабет - самые распространенные заболевания среди кошек, а шоколад является ядовитым для них и может вызвать серьезные проблемы со здоровьем."
};

let currentLevel = 1;
let currentQuestionIndex = 0;
let userAnswers = [];
let count = 0;
let userName = '';
const form = document.getElementById('quiz-form');
const resultDiv = document.getElementById('result');
const submitButton = document.getElementById('submit-button');

function askUserName() {
    submitButton.style.display = 'none';
    form.innerHTML = `
        <h2>Введите ваше имя:</h2>
        <input type="text" id="user-name" placeholder="Ваше имя">
        <button id="start-button">Начать тест</button>
    `;
    document.getElementById('start-button').addEventListener('click', () => {
        const nameInput = document.getElementById('user-name').value.trim();
        if (nameInput) {
            userName = nameInput;
            displayQuestion();
        } else {
            count = 0;
            alert('Пожалуйста, введите ваше имя');
        }
    });
}

function displayQuestion() {
    form.innerHTML = '';
    const currentQuestions = questions[`level${currentLevel}`];
    const q = currentQuestions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerHTML = `<p>${currentQuestionIndex + 1}. ${q.question}</p>`;
    
    q.answers.forEach((answer, i) => {
        questionDiv.innerHTML += `<label><input type="radio" name="q" value="${i}"> ${answer}</label><br>`;
    });

    form.appendChild(questionDiv);
    submitButton.style.display = 'block';
    resultDiv.innerHTML = "";
    submitButton.innerText = 'Ответить';
}

function submitQuiz() {
    const currentQuestions = questions[`level${currentLevel}`];
    const selectedAnswer = document.querySelector(`input[name="q"]:checked`);

    if (selectedAnswer) {
        userAnswers.push({
            question: currentQuestions[currentQuestionIndex].question,
            userAnswer: parseInt(selectedAnswer.value),
            correctAnswer: currentQuestions[currentQuestionIndex].correct
        });

        currentQuestionIndex++;

        if (currentQuestionIndex < currentQuestions.length) {
            displayQuestion();
        } else {
            displayResults();
        }
    } else {
        resultDiv.innerHTML = "Пожалуйста, выберите ответ!";
    }
}

function displayResults() {
    form.innerHTML = '';
    submitButton.style.display = 'none';
    let mistakes = [];

    userAnswers.forEach((answer, index) => {
        if (answer.userAnswer !== answer.correctAnswer) {
            mistakes.push(`Вопрос: "${answer.question}".`);
        }
    });

    if (mistakes.length > 0) {
        count++;
        if(count > 1){
            form.innerHTML = `<p>${userName}, Вы не справились с ${currentLevel} уровнем</p>`;
            form.innerHTML += `<button id="retry-all">Пройти тест заново</button>`;
        } else {
            form.innerHTML = `<p>${userName}, Вы допустили ошибки в тесте, попробуйте еще 1 раз</p>`;
            form.innerHTML += `<button id="theory-button">Показать теорию для уровня ${currentLevel}</button>`;
            document.getElementById('theory-button').addEventListener('click', showTheory);
        }
    } else {
        form.innerHTML = `<p>Поздравляем, ${userName}! Вы ответили на все вопросы правильно!</p>`;
        
        if (currentLevel < 3) {
            form.innerHTML += `<button id="next-level">Перейти на уровень ${currentLevel + 1}</button>`;
            document.getElementById('next-level').addEventListener('click', nextLevel);
        } else {
            form.innerHTML += `<p>Вы успешно завершили весь тест о котиках, ${userName}!</p>`;
            form.innerHTML += `<button id="retry-all">Пройти тест заново</button>`;
            document.getElementById('retry-all').addEventListener('click', retryAll);
        }
    }
}

function nextLevel() {
    if (currentLevel < 3) {
        currentLevel++;
        count = 0;
        currentQuestionIndex = 0;
        userAnswers = [];
        form.innerHTML = '';
        displayQuestion();
    } else {
        form.innerHTML = `<p>Поздравляем! Вы успешно завершили тест о котиках, ${userName}!</p>`;
        form.innerHTML += `<button id="retry-all">Пройти тест заново</button>`;
        document.getElementById('retry-all').addEventListener('click', retryAll);
    }
}

function retryAll() {
    currentLevel = 1;
    count=1;
    currentQuestionIndex = 0;
    userAnswers = [];
    form.innerHTML = '';
    askUserName()
}

function showTheory() {
    const theoryText = theory[`level${currentLevel}`];
    form.innerHTML = `<h2>Теория для уровня ${currentLevel}</h2><p>${theoryText}</p>`;
    form.innerHTML += `<button id="retry-button">Попробовать еще раз</button>`;
    resultDiv.innerHTML = "";
    document.getElementById('retry-button').addEventListener('click', retryLevel);
}

function retryLevel() {
    currentQuestionIndex = 0;
    userAnswers = [];
    form.innerHTML = '';
    displayQuestion();
    submitButton.style.display = 'block';
}

askUserName();

submitButton.addEventListener('click', submitQuiz);
