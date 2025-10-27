class EndlessQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.elo = 1000;
        this.streak = 0;
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
                rating: 1000,
                category: "Biology",
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
            element.textContent = answers[index];
            element.className = 'answer';
            element.style.pointerEvents = 'auto';
        });
        
        // Add fade-in animation
        questionElement.classList.add('fade-in');
        setTimeout(() => questionElement.classList.remove('fade-in'), 300);
        
        this.isAnswering = false;
    }
    
    handleAnswer(selectedIndex) {
        if (this.isAnswering || !this.currentQuestion) return;
        
        this.isAnswering = true;
        const answerElements = document.querySelectorAll('.answer');
        const selectedElement = answerElements[selectedIndex];
        const selectedAnswer = selectedElement.textContent;
        
        // Disable all answer buttons
        answerElements.forEach(element => {
            element.style.pointerEvents = 'none';
        });
        
        // Check if answer is correct
        const isCorrect = selectedAnswer === this.currentQuestion.answer;
        
        // Show correct answer
        answerElements.forEach((element, index) => {
            const answerText = element.textContent;
            if (answerText === this.currentQuestion.answer) {
                element.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                element.classList.add('incorrect');
            }
        });
        
        // Update ELO and streak
        this.updateELO(isCorrect);
        
        // Auto-advance to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }
    
    updateELO(isCorrect) {
        const questionRating = this.currentQuestion.rating;
        const expectedScore = 1 / (1 + Math.pow(10, (questionRating - this.elo) / 400));
        const actualScore = isCorrect ? 1 : 0;
        const kFactor = 32; // Standard K-factor for ELO
        
        const eloChange = Math.round(kFactor * (actualScore - expectedScore));
        this.elo += eloChange;
        
        if (isCorrect) {
            this.streak++;
        } else {
            this.streak = 0;
        }
        
        this.answeredQuestions++;
        this.updateUI();
    }
    
    openLearnLink() {
        if (!this.currentQuestion) return;
        
        // Create a Wikipedia search URL for the question topic
        const searchTerm = encodeURIComponent(this.currentQuestion.question);
        const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${searchTerm}`;
        window.open(wikiUrl, '_blank');
    }
    
    nextQuestion() {
        // Add auto-advance animation to current question
        const questionElement = document.getElementById('question');
        questionElement.classList.add('auto-advance');
        
        setTimeout(() => {
            this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;
            
            // If we've gone through all questions, shuffle them again
            if (this.currentQuestionIndex === 0) {
                this.shuffleArray(this.questions);
            }
            
            // Reset animations
            questionElement.classList.remove('auto-advance');
            this.displayQuestion();
        }, 300);
    }
    
    updateUI() {
        document.getElementById('btnRating').textContent = Math.round(this.elo);
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