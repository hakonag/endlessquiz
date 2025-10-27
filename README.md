# Endless Quiz 🧠

A modern, responsive quiz application inspired by the original endless quiz concept. Test your knowledge across various categories with beautiful animations and smooth user experience.

## Features ✨

- **25 Sample Questions** across multiple categories (Science, Geography, History, etc.)
- **Modern UI Design** with gradient backgrounds and smooth animations
- **Responsive Layout** that works on desktop, tablet, and mobile
- **Keyboard Support** - Use number keys 1-4 to answer questions
- **Score Tracking** with points and rating system
- **Learn Integration** - Click "Learn" to search Wikipedia for more info
- **Endless Gameplay** - Questions shuffle and repeat infinitely

## Project Structure 📁

```
endlessquiz/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Modern styling with animations
├── js/
│   └── quiz.js         # Quiz logic and functionality
├── data/
│   └── questions.json  # 25 sample questions
└── README.md           # This file
```

## Getting Started 🚀

1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. **Start playing!** Click answers or use keyboard (1-4)

## How to Play 🎮

- Read the question carefully
- Click on one of the four answer options
- Get immediate feedback (correct/incorrect)
- Your score and rating update automatically
- Click "Next Question" to continue
- Use "Learn" button to research topics on Wikipedia

## Customization 🛠️

### Adding More Questions
Edit `data/questions.json` to add your own questions:

```json
{
  "id": 26,
  "question": "Your question here?",
  "answer": "Correct Answer",
  "wrongAnswers": ["Wrong 1", "Wrong 2", "Wrong 3"],
  "rating": 1000,
  "category": "Your Category",
  "language": "eng"
}
```

### Styling Changes
Modify `css/style.css` to change colors, fonts, or animations.

### Game Logic
Update `js/quiz.js` to modify scoring, difficulty, or add new features.

## Browser Support 🌐

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Technologies Used 💻

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, and grid
- **JavaScript ES6+** - Class-based architecture
- **Google Fonts** - Inter font family
- **Fetch API** - Loading questions from JSON

## License 📄

This project is open source and available under the MIT License.

---

**Enjoy testing your knowledge! 🎯**
