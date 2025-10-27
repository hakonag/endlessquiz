# Endless Quiz 🧠

A **super clean, minimal quiz app** with 4 large buttons covering most of the page. Features auto-advance, ELO rating system, and 50 diverse questions.

## Features ✨

- **50 Questions** across multiple categories (Science, Geography, History, etc.)
- **Ultra-Minimal Design** - Just 4 large buttons covering most of the page
- **Auto-Advance** - Click answer → See green/red feedback → Auto next question
- **ELO Rating System** - Your rating adjusts based on question difficulty
- **Streak Counter** - Track your consecutive correct answers
- **Keyboard Support** - Use number keys 1-4 to answer
- **Dark Theme** - Modern black background with clean typography

## Project Structure 📁

```
endlessquiz/
├── index.html          # Minimal HTML with 4 large buttons
├── css/
│   └── style.css       # Clean dark theme styling
├── js/
│   └── quiz.js         # ELO system + auto-advance logic
├── data/
│   └── questions.json  # 50 sample questions
└── README.md           # This file
```

## How to Play 🎮

1. **Open `index.html`** in your web browser
2. **Read the question** at the top
3. **Click one of the 4 large buttons** or press 1-4 keys
4. **Watch the feedback** - Green for correct, red for wrong
5. **Auto-advance** - Next question appears automatically after 2 seconds
6. **Track your ELO** - Your rating adjusts based on question difficulty

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
Edit `data/questions.json` to add your own questions:

```json
{
  "id": 51,
  "question": "Your question here?",
  "answer": "Correct Answer",
  "wrongAnswers": ["Wrong 1", "Wrong 2", "Wrong 3"],
  "rating": 1000,
  "category": "Your Category",
  "language": "eng"
}
```

### Adjusting ELO
Modify the `kFactor` in `js/quiz.js` to change ELO sensitivity:
- **Higher K-Factor** = More dramatic rating changes
- **Lower K-Factor** = More stable ratings

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

**Ready to test your knowledge? 🎯**
