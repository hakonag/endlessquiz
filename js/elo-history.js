class ELOHistory {
    constructor() {
        this.eloHistory = this.loadELOHistory();
        this.playerStats = this.loadPlayerStats();
        this.currentELO = this.loadELO();
        this.eloChart = null;
        
        this.init();
    }
    
    init() {
        this.updateStats();
        this.createELOChart();
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
    
    createELOChart() {
        const ctx = document.getElementById('eloChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.eloChart) {
            this.eloChart.destroy();
        }
        
        if (this.eloHistory.length === 0) {
            // Show empty state
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Ingen ELO data tilgjengelig', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }
        
        // Prepare data
        const labels = this.eloHistory.map(point => point.questionNumber);
        const eloData = this.eloHistory.map(point => point.elo);
        const correctData = this.eloHistory.map(point => point.isCorrect ? point.elo : null);
        const incorrectData = this.eloHistory.map(point => !point.isCorrect ? point.elo : null);
        
        this.eloChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'ELO Rating',
                        data: eloData,
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.05)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.2,
                        pointRadius: 0, // Remove all points for cleaner line
                        pointHoverRadius: 4
                    },
                    {
                        label: 'Correct',
                        data: correctData,
                        borderColor: '#28a745',
                        backgroundColor: '#28a745',
                        borderWidth: 0,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        showLine: false
                    },
                    {
                        label: 'Incorrect',
                        data: incorrectData,
                        borderColor: '#dc3545',
                        backgroundColor: '#dc3545',
                        borderWidth: 0,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        showLine: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false // Remove title completely for cleaner look
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: false, // Hide X-axis completely
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'ELO Rating',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f0f0f0',
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#666666',
                            font: {
                                size: 12
                            }
                        },
                        min: Math.max(800, Math.min(...eloData) - 50),
                        max: Math.max(...eloData) + 50
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    populateHistoryList() {
        const historyList = document.getElementById('historyList');
        
        if (this.eloHistory.length === 0) {
            historyList.innerHTML = '<div class="no-history">Ingen spørsmål besvart ennå</div>';
            return;
        }
        
        // Sort by question number (reverse chronological order - newest first)
        const sortedHistory = [...this.eloHistory].sort((a, b) => b.questionNumber - a.questionNumber);
        
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
