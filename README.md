# BrainRoads

A modern, interactive questionnaire application built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

- 🎯 **Multiple Question Types**: Support for MCQ, dropdown, true/false, and text input questions
- 📚 **Questionnaire Library**: Browse and filter questionnaires by subject and difficulty level
- 🔄 **Revision Mode**: Practice mode with explanations and requirement to answer correctly before proceeding
- 📊 **Detailed Results**: Comprehensive feedback showing correct/incorrect answers with explanations
- 🎨 **Modern UI**: Dark mode interface with smooth animations
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/brainroads.git
cd brainroads
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
brainroads/
├── src/
│   ├── pages/
│   │   ├── Home.jsx              # Questionnaire listing page
│   │   ├── QuestionnairePlayer.jsx # Quiz player with revision mode
│   │   └── Results.jsx            # Results page
│   ├── components/
│   ├── App.jsx                    # Main app component with routing
│   └── main.jsx                   # Entry point
├── public/
└── package.json
```

## Features in Detail

### Questionnaire Player
- Progress tracking with visual progress bar
- Multiple question types support
- Real-time feedback on answers
- Revision mode with explanations
- Detailed results screen with score and wrong answers list

### Home Page
- Search functionality
- Filter by difficulty level and subject
- Responsive grid layout
- Quick access to start questionnaires

## License

MIT
