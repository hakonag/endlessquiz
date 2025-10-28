class ELOHistory {
    constructor() {
        this.eloHistory = this.loadELOHistory();
        this.playerStats = this.loadPlayerStats();
        this.currentELO = this.loadELO();
        
        this.init();
    }
    
    init() {
        this.updateStats();
        this.populateHistoryList();
    }
    
    loadELO() {
        const saved = localStorage.getItem('endlessQuiz_elo');
        return saved ? parseInt(saved) : 800;
    }
    
    loadELOHistory() {
        const saved = localStorage.getItem('endlessQuiz_eloHistory');
        return saved ? JSON.parse(saved) : [];
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
    
    updateStats() {
        const startELO = this.playerStats.startingELO || 800;
        const currentELO = this.currentELO;
        const netChange = currentELO - startELO;
        
        document.getElementById('currentELOValue').textContent = currentELO;
        document.getElementById('startELOValue').textContent = startELO;
        document.getElementById('netChangeValue').textContent = 
            netChange >= 0 ? `+${netChange}` : `${netChange}`;
        
        document.getElementById('currentELO').textContent = `ELO ${currentELO}`;
    }
    
    populateHistoryList() {
        const historyList = document.getElementById('historyList');
        
        if (this.eloHistory.length === 0) {
            historyList.innerHTML = '<div class="no-history">Ingen spørsmål besvart ennå</div>';
            return;
        }
        
        // Sort by question number (chronological order)
        const sortedHistory = [...this.eloHistory].sort((a, b) => a.questionNumber - b.questionNumber);
        
        historyList.innerHTML = sortedHistory.map(item => {
            const eloChangeClass = item.eloChange >= 0 ? 'positive' : 'negative';
            const eloChangeText = item.eloChange >= 0 ? `+${item.eloChange}` : `${item.eloChange}`;
            const correctClass = item.isCorrect ? 'correct' : 'incorrect';
            
            return `
                <div class="history-item ${correctClass}">
                    <div class="history-question">
                        <strong>Spørsmål ${item.questionNumber}:</strong> ${item.questionText || this.getQuestionText(item.questionId)}
                    </div>
                    <div class="history-details">
                        <span class="history-category">${item.category || 'Generell'}</span>
                        <span class="history-rating">Rating: ${item.questionRating}</span>
                        <span class="history-elo-change ${eloChangeClass}">${eloChangeText}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    getQuestionText(questionId) {
        // Find the question text from stored history
        const historyItem = this.eloHistory.find(item => item.questionId === questionId);
        if (historyItem && historyItem.questionText) {
            return historyItem.questionText;
        }
        
        // Fallback
        return `Spørsmål ID: ${questionId}`;
    }
}

// Initialize the ELO history when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ELOHistory();
});
