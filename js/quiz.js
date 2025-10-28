class EndlessQuiz {
    constructor() {
        this.categories = [];
        this.currentCategory = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.elo = this.loadELO(); // Load from localStorage
        this.streak = 0;
        this.isAnswering = false;
        this.currentQuestion = null;
        this.answeredQuestions = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.eloHistory = this.loadELOHistory(); // Track ELO progression
        this.playerStats = this.loadPlayerStats(); // Track player behavior patterns
        this.eloChart = null; // Chart.js instance
        
        this.init();
    }
    
    async init() {
        // Load categories first to get accurate question count
        await this.loadCategories();
        
        // Show loading screen with actual question count
        this.showLoadingScreen();
        
        this.setupEventListeners();
        await this.startQuiz('general.json');
        
        // Hide loading screen after everything is loaded
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 1500);
    }
    
    async loadCategories() {
       try {
           const response = await fetch(`data/categories.json?t=${Date.now()}`);
           const data = await response.json();
            this.categories = data.categories;
        } catch (error) {
            console.error('Feil ved lasting av kategorier:', error);
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
                       const response = await fetch(`data/categories/${categoryFilename}?t=${Date.now()}`);
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
            console.error('Feil ved lasting av spørsmål:', error);
            this.questions = this.getFallbackQuestions();
        }
    }
    
    async loadGeneralKnowledge() {
        try {
            const categories = ['history', 'geography', 'science', 'culture'];
            const allQuestions = [];
            
                   // Load all 4 category files
                   for (const category of categories) {
                       const response = await fetch(`data/categories/${category}.json?t=${Date.now()}`);
                       const data = await response.json();

                       // Handle both old and new format
                       if (data.version) {
                           // New optimized format - renumber questions to avoid duplicates
                           const questions = data.questions.map((q, index) => ({
                               id: allQuestions.length + index + 1, // Ensure unique IDs
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
                           // Old format (fallback) - also renumber
                           const questions = data.questions.map((q, index) => ({
                               ...q,
                               id: allQuestions.length + index + 1 // Ensure unique IDs
                           }));
                           allQuestions.push(...questions);
                       }
                   }
            
            this.questions = allQuestions;
            this.shuffleArray(this.questions);
            this.currentCategory = 'Generell Kunnskap';
        } catch (error) {
            console.error('Feil ved lasting av generell kunnskap:', error);
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
        
        // Category dropdown
        const categoryButton = document.getElementById('btnCategory');
        const dropdownContent = document.getElementById('dropdownContent');
        
        categoryButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#btnCategory') && !e.target.closest('.dropdown-content')) {
                dropdownContent.classList.remove('show');
            }
        });
        
                // Dropdown item clicks
                document.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', async (e) => {
                        const filename = e.target.dataset.filename;
                        dropdownContent.classList.remove('show');
                        await this.startQuiz(filename);
                    });
                });
                
                // ELO rating click
                document.getElementById('btnRating').addEventListener('click', () => {
                    window.location.href = 'elo-history.html';
                });
                
                // Keyboard support
                document.addEventListener('keypress', (e) => this.handleKeyPress(e));
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            // Update the loading text with actual question count
            const loadingSubtext = loadingScreen.querySelector('.loading-subtext');
            if (loadingSubtext) {
                loadingSubtext.textContent = `Forbereder ${this.getTotalQuestionCount()} spørsmål`;
            }
        }
    }
    
    getTotalQuestionCount() {
        // Calculate total questions from all categories
        if (this.categories.length > 0) {
            return this.categories.reduce((total, category) => {
                return total + category.count;
            }, 0).toLocaleString();
        }
        return "10,000"; // Fallback
    }
    
    // ELO Persistence Methods
    loadELO() {
        const saved = localStorage.getItem('endlessQuiz_elo');
        return saved ? parseInt(saved) : 800;
    }
    
    saveELO() {
        localStorage.setItem('endlessQuiz_elo', this.elo.toString());
    }
    
    loadELOHistory() {
        const saved = localStorage.getItem('endlessQuiz_eloHistory');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveELOHistory() {
        localStorage.setItem('endlessQuiz_eloHistory', JSON.stringify(this.eloHistory));
    }
    
    loadPlayerStats() {
        const saved = localStorage.getItem('endlessQuiz_playerStats');
        return saved ? JSON.parse(saved) : {
            totalQuestions: 0,
            correctAnswers: 0,
            averageResponseTime: 0,
            difficultyPreference: 'medium',
            categoryPerformance: {},
            sessionCount: 0,
            lastSessionDate: null,
            startingELO: 800
        };
    }
    
    savePlayerStats() {
        localStorage.setItem('endlessQuiz_playerStats', JSON.stringify(this.playerStats));
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
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
        this.totalQuestions = this.questions.length;
        this.answeredQuestions = 0;
        this.correctAnswers = 0;
        this.currentQuestionIndex = 0;
        this.displayQuestion();
        this.updateUI();
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
        if (this.questions.length === 0) {
            document.getElementById('question').textContent = "Ingen spørsmål tilgjengelig for denne kategorien.";
            return;
        }
        
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        const questionElement = document.getElementById('question');
        questionElement.textContent = this.currentQuestion.question;
        
        // Shuffle answers
        const answers = [this.currentQuestion.answer, ...this.currentQuestion.wrongAnswers];
        this.shuffleArray(answers);
        
        // Display answers in container
        const answerElements = document.querySelectorAll('#answersContainer .answer');
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
        const answerElements = document.querySelectorAll('#answersContainer .answer');
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
        
        // Adaptive K-factor based on player behavior
        const kFactor = this.calculateAdaptiveKFactor();
        
        const eloChange = Math.round(kFactor * (actualScore - expectedScore));
        const oldELO = this.elo;
        this.elo += eloChange;
        
        // Record ELO history for chart
        this.eloHistory.push({
            questionNumber: this.answeredQuestions + 1,
            elo: this.elo,
            eloChange: eloChange,
            isCorrect: isCorrect,
            questionRating: questionRating,
            questionId: this.currentQuestion.id,
            questionText: this.currentQuestion.question,
            category: this.currentCategory,
            timestamp: Date.now()
        });
        
        // Update player stats
        this.updatePlayerStats(isCorrect, questionRating);
        
        if (isCorrect) {
            this.streak++;
            this.correctAnswers++;
        } else {
            this.streak = 0;
        }
        
        this.answeredQuestions++;
        
        // Save to localStorage
        this.saveELO();
        this.saveELOHistory();
        this.savePlayerStats();
        
        this.updateUI();
    }
    
    calculateAdaptiveKFactor() {
        const baseK = 32;
        const totalQuestions = this.playerStats.totalQuestions;
        
        // Reduce K-factor as player gets more experienced
        if (totalQuestions < 50) return baseK; // New players
        if (totalQuestions < 200) return baseK * 0.8; // Learning phase
        if (totalQuestions < 500) return baseK * 0.6; // Intermediate
        return baseK * 0.4; // Experienced players
    }
    
    updatePlayerStats(isCorrect, questionRating) {
        this.playerStats.totalQuestions++;
        if (isCorrect) this.playerStats.correctAnswers++;
        
        // Update category performance
        const category = this.currentCategory;
        if (!this.playerStats.categoryPerformance[category]) {
            this.playerStats.categoryPerformance[category] = {
                total: 0,
                correct: 0,
                averageELO: 0
            };
        }
        
        this.playerStats.categoryPerformance[category].total++;
        if (isCorrect) this.playerStats.categoryPerformance[category].correct++;
        
        // Update session info
        const today = new Date().toDateString();
        if (this.playerStats.lastSessionDate !== today) {
            this.playerStats.sessionCount++;
            this.playerStats.lastSessionDate = today;
        }
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
        document.getElementById('btnRating').textContent = `ELO ${Math.round(this.elo)}`;
        document.getElementById('questionCounter').innerHTML = 
            `<span class="correct">${this.correctAnswers}</span> / <span class="answered">${this.answeredQuestions}</span> / <span class="total">${this.totalQuestions.toLocaleString()}</span>`;
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