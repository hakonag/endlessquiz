# Online ELO System Design

## 🎯 Overview
A comprehensive system for continuous online ELO updates based on player interactions, creating a dynamic, community-driven rating system.

## 🏗️ Architecture

### 1. **Client-Side Data Collection**
```javascript
// Enhanced player data collection
const playerInteraction = {
    questionId: "q_12345",
    playerELO: 1150,
    questionRating: 1000,
    responseTime: 3.2, // seconds
    isCorrect: true,
    category: "Science",
    difficulty: "medium",
    timestamp: Date.now(),
    sessionId: "session_abc123",
    playerId: "player_xyz789" // Anonymous ID
};
```

### 2. **Server-Side Processing**
- **Real-time ELO Updates**: Process interactions as they happen
- **Question Rating Adjustment**: Update question difficulty based on community performance
- **Player Behavior Analysis**: Track patterns for adaptive K-factors
- **Anti-Cheating Measures**: Detect suspicious patterns

### 3. **Database Schema**
```sql
-- Players table
CREATE TABLE players (
    id VARCHAR(50) PRIMARY KEY,
    current_elo INT DEFAULT 1000,
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    created_at TIMESTAMP,
    last_active TIMESTAMP,
    session_count INT DEFAULT 0
);

-- Questions table
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50),
    current_rating INT DEFAULT 1000,
    total_attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0,
    last_updated TIMESTAMP
);

-- Interactions table
CREATE TABLE interactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id VARCHAR(50),
    question_id VARCHAR(50),
    player_elo INT,
    question_rating INT,
    response_time DECIMAL(5,2),
    is_correct BOOLEAN,
    timestamp TIMESTAMP,
    session_id VARCHAR(50)
);
```

## 🔄 Real-Time Updates

### 1. **WebSocket Connection**
```javascript
class OnlineELOSystem {
    constructor() {
        this.ws = new WebSocket('wss://api.endlessquiz.com/elo');
        this.setupWebSocketHandlers();
    }
    
    setupWebSocketHandlers() {
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleServerUpdate(data);
        };
    }
    
    sendInteraction(interaction) {
        this.ws.send(JSON.stringify({
            type: 'interaction',
            data: interaction
        }));
    }
    
    handleServerUpdate(data) {
        switch(data.type) {
            case 'elo_update':
                this.updateELO(data.newELO);
                break;
            case 'question_rating_update':
                this.updateQuestionRating(data.questionId, data.newRating);
                break;
            case 'global_stats':
                this.updateGlobalStats(data.stats);
                break;
        }
    }
}
```

### 2. **Server-Side ELO Calculation**
```python
class ELOCalculator:
    def __init__(self):
        self.base_k = 32
        self.min_k = 16
        self.max_k = 48
    
    def calculate_adaptive_k(self, player_stats):
        """Calculate K-factor based on player experience and consistency"""
        total_questions = player_stats['total_questions']
        consistency = self.calculate_consistency(player_stats)
        
        if total_questions < 50:
            return self.base_k  # New players
        elif total_questions < 200:
            return self.base_k * 0.8  # Learning phase
        elif consistency > 0.7:
            return self.min_k  # Consistent players
        else:
            return self.max_k  # Inconsistent players
    
    def update_question_rating(self, question_id, interactions):
        """Update question difficulty based on community performance"""
        total_attempts = len(interactions)
        correct_rate = sum(1 for i in interactions if i['is_correct']) / total_attempts
        
        # Adjust question rating based on success rate
        if correct_rate > 0.8:
            new_rating = self.current_rating + 50  # Too easy
        elif correct_rate < 0.3:
            new_rating = self.current_rating - 50  # Too hard
        else:
            new_rating = self.current_rating  # Just right
        
        return max(500, min(1500, new_rating))  # Clamp between 500-1500
```

## 📊 Advanced Features

### 1. **Community-Driven Question Rating**
- Questions start at 1000 ELO
- Rating adjusts based on community performance
- Popular questions get more accurate ratings
- Unpopular questions maintain initial rating

### 2. **Player Behavior Analysis**
```javascript
const behaviorAnalysis = {
    responseTimePattern: "fast", // fast, normal, slow
    consistencyScore: 0.75, // 0-1, higher = more consistent
    categoryPreference: ["Science", "History"],
    difficultyPreference: "medium",
    cheatingScore: 0.1 // 0-1, higher = more suspicious
};
```

### 3. **Anti-Cheating Measures**
- Response time analysis
- Answer pattern detection
- Session duration tracking
- Unusual ELO gains detection

### 4. **Global Statistics**
```javascript
const globalStats = {
    totalPlayers: 15420,
    totalQuestions: 10000,
    averageELO: 1023,
    topPlayers: [
        { rank: 1, elo: 1850, questions: 2500 },
        { rank: 2, elo: 1820, questions: 2100 }
    ],
    categoryStats: {
        "Science": { averageELO: 1050, totalQuestions: 2500 },
        "History": { averageELO: 980, totalQuestions: 2500 }
    }
};
```

## 🚀 Implementation Phases

### Phase 1: Basic Online ELO (Week 1-2)
- [ ] WebSocket connection
- [ ] Basic interaction tracking
- [ ] Simple ELO updates
- [ ] Question rating updates

### Phase 2: Advanced Features (Week 3-4)
- [ ] Player behavior analysis
- [ ] Adaptive K-factors
- [ ] Anti-cheating measures
- [ ] Global statistics

### Phase 3: Community Features (Week 5-6)
- [ ] Leaderboards
- [ ] Player profiles
- [ ] Category rankings
- [ ] Achievement system

## 🔧 API Endpoints

### REST API
```
POST /api/interaction
GET /api/player/{id}/stats
GET /api/question/{id}/stats
GET /api/leaderboard
GET /api/global-stats
```

### WebSocket Events
```
interaction -> Server processes and updates ELO
elo_update -> Client receives new ELO
question_rating_update -> Client receives updated question rating
global_stats -> Client receives updated global statistics
```

## 📈 Benefits

1. **Dynamic Difficulty**: Questions automatically adjust difficulty based on community performance
2. **Fair Matchmaking**: Players compete against similar skill levels
3. **Community Engagement**: Global leaderboards and statistics
4. **Continuous Improvement**: System learns and adapts over time
5. **Anti-Cheating**: Automated detection of suspicious behavior

## 🛡️ Privacy & Security

- Anonymous player IDs (no personal data)
- Encrypted WebSocket connections
- Rate limiting on API endpoints
- Data retention policies
- GDPR compliance

## 💡 Future Enhancements

- Machine learning for question difficulty prediction
- Personalized question recommendations
- Tournament mode with brackets
- Team-based competitions
- Mobile app integration
