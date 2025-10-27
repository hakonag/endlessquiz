class EndlessQuiz {
    constructor() {
        this.categories = [];
        this.currentCategory = null;
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
        await this.loadCategories();
        this.setupEventListeners();
        this.showCategorySelection();
    }
    
    async loadCategories() {
        try {
            const response = await fetch('data/categories.json');
            const data = await response.json();
            this.categories = data.categories;
        } catch (error) {
            console.error('Error loading categories:', error);
            this.categories = this.getFallbackCategories();
        }
    }
    
    async loadQuestions(categoryFilename) {
        try {
            if (categoryFilename === 'general.json') {
                // For General Knowledge, load all 4 categories and combine
                await this.loadGeneralKnowledge();
            } else {
                // For specific categories, load normally
                const response = await fetch(`data/categories/${categoryFilename}`);
                const data = await response.json();
                
                // Handle both old and new format
                if (data.version) {
                    // New optimized format
                    this.questions = data.questions.map(q => ({
                        id: q.id,
                        question: q.q,
                        answer: q.a,
                        wrongAnswers: q.w,
                        rating: q.r,
                        category: data.category,
                        language: "eng",
                        tags: q.t
                    }));
                } else {
                    // Old format (fallback)
                    this.questions = data.questions;
                }
                
                this.shuffleArray(this.questions);
                this.currentCategory = data.category;
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questions = this.getFallbackQuestions();
        }
    }
    
    async loadGeneralKnowledge() {
        try {
            const categories = ['history', 'geography', 'science', 'culture'];
            const allQuestions = [];
            
            // Load all 4 category files
            for (const category of categories) {
                const response = await fetch(`data/categories/${category}.json`);
                const data = await response.json();
                
                // Handle both old and new format
                if (data.version) {
                    // New optimized format
                    const questions = data.questions.map(q => ({
                        id: q.id,
                        question: q.q,
                        answer: q.a,
                        wrongAnswers: q.w,
                        rating: q.r,
                        category: data.category,
                        language: "eng",
                        tags: q.t
                    }));
                    allQuestions.push(...questions);
                } else {
                    // Old format (fallback)
                    allQuestions.push(...data.questions);
                }
            }
            
            this.questions = allQuestions;
            this.shuffleArray(this.questions);
            this.currentCategory = 'Generell Kunnskap';
        } catch (error) {
            console.error('Error loading general knowledge:', error);
            this.questions = this.getFallbackQuestions();
        }
    }
    
    getFallbackCategories() {
        return [
            {
                name: "Vitenskap",
                filename: "science.json",
                count: 2500,
                description: "Generelle vitenskaps-spørsmål"
            },
            {
                name: "Historie",
                filename: "history.json",
                count: 2500,
                description: "Historiske spørsmål"
            },
            {
                name: "Geografi",
                filename: "geography.json",
                count: 2500,
                description: "Geografiske spørsmål"
            },
            {
                name: "Kultur",
                filename: "culture.json",
                count: 2500,
                description: "Kulturelle spørsmål"
            },
            {
                name: "Generell Kunnskap",
                filename: "general.json",
                count: 10000,
                description: "Blandede spørsmål fra alle kategorier"
            }
        ];
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
    
    showCategorySelection() {
        const container = document.getElementById('container');
        container.innerHTML = `
            <div id="categorySelection">
                <h2>Velg en kategori</h2>
                <div id="categoryGrid">
                    ${this.categories.map(category => `
                        <button class="categoryButton" data-filename="${category.filename}">
                            <div class="categoryName">${category.name}</div>
                            <div class="categoryCount">${category.count} spørsmål</div>
                            <div class="categoryDescription">${category.description}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add event listeners to category buttons
        document.querySelectorAll('.categoryButton').forEach(button => {
            button.addEventListener('click', async (e) => {
                const filename = e.currentTarget.dataset.filename;
                await this.startQuiz(filename);
            });
        });
    }
    
    async startQuiz(categoryFilename) {
        await this.loadQuestions(categoryFilename);
        this.restoreQuizUI();
        this.displayQuestion();
        this.updateUI();
    }
    
    restoreQuizUI() {
        const container = document.getElementById('container');
        container.innerHTML = `
            <!-- Top Right Buttons -->
            <div id="topButtons">
                <button id="btnLearn" class="topbutton">Lær</button>
                <div id="btnRating" class="topbutton">1000</div>
            </div>

            <!-- Question -->
            <div id="question">
                Laster spørsmål...
            </div>

            <!-- 4 Answer Buttons -->
            <div id="answers">
                <button class="answer" id="answer1">
                    Svar 1
                </button>
                <button class="answer" id="answer2">
                    Svar 2
                </button>
                <button class="answer" id="answer3">
                    Svar 3
                </button>
                <button class="answer" id="answer4">
                    Svar 4
                </button>
            </div>

            <!-- Footer -->
            <div class="panel-footer">
                © ENDELØS QUIZ 2025
                <a href="#" class="footerItem">Om</a>
            </div>
        `;
        
        // Re-setup event listeners for the restored UI
        this.setupEventListeners();
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