class EndlessQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.rating = 1000;
        this.matchPoints = 0;
        this.isAnswering = false;
        this.currentQuestion = null;
        this.answeredQuestions = 0;
        
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.displayQuestion();
        this.updateUI();
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            this.questions = await response.json();
            this.shuffleArray(this.questions);
        } catch (error) {
            console.error('Error loading questions:', error);
            // Fallback questions if JSON fails to load
            this.questions = this.getFallbackQuestions();
        }
    }
    
    getFallbackQuestions() {
        return [
            {
                id: 1,
                question: "In which plant organelles does photosynthesis take place?",
                answer: "Chloroplasts",
                wrongAnswers: ["Mitochondria", "Vacuoles", "Centrioles"],
                rating: 1026,
                category: "Biology",
                language: "eng"
            },
            {
                id: 2,
                question: "Which US state does NOT border Mexico?",
                answer: "Colorado",
                wrongAnswers: ["Texas", "New Mexico", "Arizona"],
                rating: 1127,
                category: "Geography",
                language: "eng"
            }
        ];
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    setupEventListeners() {
        // Answer button clicks
        document.getElementById('answer1').addEventListener('click', () => this.handleAnswer(0));
        document.getElementById('answer2').addEventListener('click', () => this.handleAnswer(1));
        document.getElementById('answer3').addEventListener('click', () => this.handleAnswer(2));
        document.getElementById('answer4').addEventListener('click', () => this.handleAnswer(3));
        
        // Learn button
        document.getElementById('btnLearn').addEventListener('click', () => this.openLearnLink());
        
        // Match button (placeholder for future functionality)
        document.getElementById('btnMatch').addEventListener('click', () => this.showMatchInfo());
        
        // Next button
        document.getElementById('nextButton').addEventListener('click', () => this.nextQuestion());
        
        // Keyboard support
        document.addEventListener('keypress', (e) => this.handleKeyPress(e));
    }
    
    handleKeyPress(e) {
        if (this.isAnswering) return;
        
        const key = e.key;
        if (key >= '1' && key <= '4') {
            const answerIndex = parseInt(key) - 1;
            this.handleAnswer(answerIndex);
        }
    }
    
    displayQuestion() {
        if (this.questions.length === 0) return;
        
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        const questionElement = document.getElementById('question');
        questionElement.textContent = this.currentQuestion.question;
        
        // Shuffle answers
        const answers = [this.currentQuestion.answer, ...this.currentQuestion.wrongAnswers];
        this.shuffleArray(answers);
        
        // Display answers
        const answerElements = document.querySelectorAll('.answer');
        answerElements.forEach((element, index) => {
            element.querySelector('.answer-text').textContent = answers[index];
            element.className = 'answer';
            element.style.pointerEvents = 'auto';
        });
        
        // Reset feedback
        document.getElementById('feedbackText').textContent = '';
        document.getElementById('nextButton').classList.add('hidden');
        
        // Add fade-in animation
        questionElement.classList.add('fade-in');
        setTimeout(() => questionElement.classList.remove('fade-in'), 500);
        
        this.isAnswering = false;
    }
    
    handleAnswer(selectedIndex) {
        if (this.isAnswering || !this.currentQuestion) return;
        
        this.isAnswering = true;
        const answerElements = document.querySelectorAll('.answer');
        const selectedElement = answerElements[selectedIndex];
        const selectedAnswer = selectedElement.querySelector('.answer-text').textContent;
        
        // Disable all answer buttons
        answerElements.forEach(element => {
            element.style.pointerEvents = 'none';
        });
        
        // Check if answer is correct
        const isCorrect = selectedAnswer === this.currentQuestion.answer;
        
        // Show correct answer
        answerElements.forEach((element, index) => {
            const answerText = element.querySelector('.answer-text').textContent;
            if (answerText === this.currentQuestion.answer) {
                element.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                element.classList.add('incorrect');
            }
        });
        
        // Update score and rating
        if (isCorrect) {
            this.score += 10;
            this.matchPoints += 10;
            this.rating += 20;
            document.getElementById('feedbackText').textContent = 'Correct! Well done!';
            document.getElementById('feedbackText').style.color = '#4CAF50';
            selectedElement.classList.add('pulse');
        } else {
            this.rating = Math.max(800, this.rating - 15);
            document.getElementById('feedbackText').textContent = `Incorrect! The correct answer is: ${this.currentQuestion.answer}`;
            document.getElementById('feedbackText').style.color = '#f44336';
        }
        
        this.answeredQuestions++;
        this.updateUI();
        
        // Show next button after a delay
        setTimeout(() => {
            document.getElementById('nextButton').classList.remove('hidden');
        }, 1500);
    }
    
    nextQuestion() {
        this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;
        
        // If we've gone through all questions, shuffle them again
        if (this.currentQuestionIndex === 0) {
            this.shuffleArray(this.questions);
        }
        
        this.displayQuestion();
        this.updateProgress();
    }
    
    updateUI() {
        document.querySelector('#btnMatchPoints .value').textContent = this.matchPoints;
        document.querySelector('#btnRating .value').textContent = this.rating;
    }
    
    updateProgress() {
        const progress = (this.answeredQuestions % this.questions.length) / this.questions.length * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }
    
    openLearnLink() {
        if (!this.currentQuestion) return;
        
        // Create a Wikipedia search URL for the question topic
        const searchTerm = encodeURIComponent(this.currentQuestion.question);
        const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${searchTerm}`;
        window.open(wikiUrl, '_blank');
    }
    
    showMatchInfo() {
        alert(`Match Points: ${this.matchPoints}\nRating: ${this.rating}\nQuestions Answered: ${this.answeredQuestions}`);
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EndlessQuiz();
});

// Utility function for debugging
function out(message) {
    console.log(message);
}
