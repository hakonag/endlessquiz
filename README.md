# Endless Quiz 🧠

A **super clean, minimal quiz app** with 4 large buttons covering most of the page. Features auto-advance, ELO rating system, and **10,000 diverse questions**!

## Features ✨

- **10,000 Questions** across 4 main categories + General Knowledge mode
- **Ultra-Minimal Design** - Just 4 large buttons covering most of the page
- **Auto-Advance** - Click answer → See green/red feedback → Auto next question
- **ELO Rating System** - Your rating adjusts based on question difficulty
- **Streak Counter** - Track your consecutive correct answers
- **Keyboard Support** - Use number keys 1-4 to answer
- **Dark Theme** - Modern black background with clean typography

## Categories 📚

- **🔬 Science**: 2,500 questions (Physics, Chemistry, Biology, Technology)
- **🌍 Geography**: 2,500 questions (Countries, Capitals, Landmarks, Physical Features)
- **📚 History**: 2,500 questions (Historical Events, Figures, Time Periods)
- **🎨 Culture**: 2,500 questions (Art, Literature, Music, Cultural Practices)
- **🧠 General Knowledge**: 10,000 questions (Mixed from all categories)

## Project Structure 📁

```
endlessquiz/
├── index.html          # Minimal HTML with 4 large buttons
├── css/
│   └── style.css       # Clean dark theme styling
├── js/
│   └── quiz.js         # ELO system + auto-advance logic
├── data/
│   ├── categories/
│   │   ├── history.json    # 2,500 history questions
│   │   ├── geography.json  # 2,500 geography questions
│   │   ├── science.json    # 2,500 science questions
│   │   └── culture.json    # 2,500 culture questions
│   ├── categories.json     # Category metadata
│   └── questions.json      # Backup/fallback
└── README.md           # This file
```

## How to Play 🎮

1. **Open `index.html`** in your web browser
2. **Choose a category** from the selection screen
3. **Read the question** at the top
4. **Click one of the 4 large buttons** or press 1-4 keys
5. **Watch the feedback** - Green for correct, red for wrong
6. **Auto-advance** - Next question appears automatically after 2 seconds
7. **Track your ELO** - Your rating adjusts based on question difficulty

## ELO System 🏆

- **Starting ELO**: 1000
- **Correct Answer**: ELO increases based on question difficulty
- **Wrong Answer**: ELO decreases based on question difficulty
- **Streak Counter**: Tracks consecutive correct answers
- **K-Factor**: 32 (standard chess ELO calculation)

## Design Philosophy 🎨

- **Minimal**: Only essential elements visible
- **Large Buttons**: Easy to click/tap on any device
- **Auto-Advance**: No manual "next" button needed
- **Dark Theme**: Easy on the eyes
- **Clean Typography**: Inter font for readability

## Getting Started 🚀

1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. **Start playing!** The quiz is endless and questions shuffle automatically

## Customization 🛠️

### Adding More Questions
Edit the category JSON files to add your own questions:

```json
{
  "id": 2501,
  "question": "Your question here?",
  "answer": "Correct Answer",
  "wrongAnswers": ["Wrong 1", "Wrong 2", "Wrong 3"],
  "rating": 1000,
  "category": "Science",
  "language": "eng"
}
```

### Adjusting ELO
Modify the `kFactor` in `js/quiz.js` to change ELO sensitivity:
- **Higher K-Factor** = More dramatic rating changes
- **Lower K-Factor** = More stable ratings

## Scale & Performance 📊

- **Total Questions**: 10,000
- **Questions per Category**: 2,500
- **Dynamic Loading**: Only loads selected category
- **General Knowledge**: Dynamically combines all 4 categories
- **Memory Efficient**: Questions loaded on-demand

## Browser Support 🌐

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Technologies Used 💻

- **HTML5** - Minimal semantic markup
- **CSS3** - Dark theme with grid layout
- **JavaScript ES6+** - ELO calculation and auto-advance
- **Google Fonts** - Inter font family
- **Fetch API** - Loading questions from JSON

---

**Ready to test your knowledge with 10,000 questions? 🎯**
