export interface WorksheetQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export const generateWorksheetHTML = (title: string, questions: WorksheetQuestion[]) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Interactive Worksheet</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#8B5CF6',
                        secondary: '#10B981',
                        accent: '#F59E0B',
                        danger: '#EF4444'
                    },
                    fontFamily: {
                        sans: ['Comic Neue', 'cursive', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Comic Neue', cursive;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .correct-anim {
            animation: bounce 0.5s;
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .wrong-shake {
            animation: shake 0.5s;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen p-4 md:p-8">
    <div class="max-w-3xl mx-auto">
        <header class="bg-white rounded-3xl shadow-xl p-8 mb-8 border-b-8 border-primary relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8"></div>
            <div class="relative z-10">
                <span class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold mb-2 uppercase tracking-wider">Interactive Worksheet</span>
                <h1 class="text-4xl font-bold text-gray-800 mb-2">${title}</h1>
                <p class="text-gray-500 text-xl">Let's practice and learn together! 🌟</p>
            </div>
            <div class="mt-6 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-3xl">📝</span>
                    <span class="font-bold text-gray-600">${questions.length} Questions</span>
                </div>
                <div class="bg-gray-100 rounded-full h-4 w-48 overflow-hidden">
                    <div id="progressBar" class="bg-secondary h-full transition-all duration-500" style="width: 0%"></div>
                </div>
            </div>
        </header>

        <main id="questionContainer" class="space-y-8">
            <!-- Questions rendered here -->
        </main>

        <div id="completionModal" class="fixed inset-0 bg-black/50 hidden flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div class="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform scale-90 opacity-0 transition-all duration-300" id="modalContent">
                <div class="text-6xl mb-4">🏆</div>
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Great Job!</h2>
                <p class="text-xl text-gray-600 mb-6">You've completed the worksheet!</p>
                <div class="bg-primary/5 rounded-xl p-6 mb-8">
                    <p class="text-gray-500 mb-1">Final Score</p>
                    <div class="text-5xl font-bold text-primary" id="finalScore">0/0</div>
                </div>
                <button onclick="location.reload()" class="w-full py-4 bg-primary text-white rounded-xl font-bold text-xl hover:bg-primary/90 transition-transform hover:scale-105 shadow-lg shadow-primary/30">
                    Play Again
                </button>
            </div>
        </div>
    </div>

    <script>
        const questions = ${JSON.stringify(questions)};
        let currentScore = 0;
        let answeredCount = 0;

        function renderQuestions() {
            const container = document.getElementById('questionContainer');
            
            questions.forEach((q, index) => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-500 opacity-0 translate-y-8';
                card.style.animationDelay = \`\${index * 100}ms\`;
                
                // Shuffle options
                const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
                
                card.innerHTML = \`
                    <div class="flex items-start gap-4 mb-6">
                        <div class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                            \${index + 1}
                        </div>
                        <h3 class="text-xl md:text-2xl font-bold text-gray-800 pt-1">\${q.question}</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 options-grid" id="options-\${index}">
                        \${shuffledOptions.map((opt, i) => \`
                            <button 
                                onclick="checkAnswer(\${index}, '\${opt.replace(/'/g, "\\'")}', this)"
                                class="option-btn text-left p-4 rounded-xl border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all group relative overflow-hidden"
                            >
                                <span class="relative z-10 font-bold text-gray-700 group-hover:text-primary transition-colors text-lg">\${opt}</span>
                            </button>
                        \`).join('')}
                    </div>

                    <div id="feedback-\${index}" class="hidden rounded-xl p-6 transform transition-all duration-300">
                        <!-- Feedback content injected here -->
                    </div>
                \`;
                
                container.appendChild(card);
                
                // Animate entry
                setTimeout(() => {
                    card.classList.remove('opacity-0', 'translate-y-8');
                }, 100 + (index * 100));
            });
        }

        function checkAnswer(questionIndex, selectedOption, btnElement) {
            const question = questions[questionIndex];
            const feedbackEl = document.getElementById(\`feedback-\${questionIndex}\`);
            const optionsContainer = document.getElementById(\`options-\${questionIndex}\`);
            
            // Disable all buttons for this question
            const allBtns = optionsContainer.querySelectorAll('button');
            allBtns.forEach(btn => btn.disabled = true);

            const isCorrect = selectedOption === question.correctAnswer;
            
            if (isCorrect) {
                currentScore++;
                btnElement.classList.remove('border-gray-200', 'hover:border-primary/50', 'hover:bg-primary/5');
                btnElement.classList.add('bg-secondary', 'border-secondary', 'text-white', 'correct-anim');
                btnElement.querySelector('span').classList.remove('text-gray-700', 'group-hover:text-primary');
                btnElement.querySelector('span').classList.add('text-white');
                
                feedbackEl.className = 'mt-4 rounded-xl p-6 bg-secondary/10 border-2 border-secondary/20';
                feedbackEl.innerHTML = \`
                    <div class="flex items-start gap-3">
                        <div class="text-2xl">🎉</div>
                        <div>
                            <h4 class="font-bold text-secondary text-lg mb-1">Correct!</h4>
                            <p class="text-gray-700">\${question.explanation}</p>
                        </div>
                    </div>
                \`;
            } else {
                btnElement.classList.remove('border-gray-200', 'hover:border-primary/50', 'hover:bg-primary/5');
                btnElement.classList.add('bg-danger', 'border-danger', 'text-white', 'wrong-shake');
                btnElement.querySelector('span').classList.remove('text-gray-700', 'group-hover:text-primary');
                btnElement.querySelector('span').classList.add('text-white');
                
                // Highlight correct answer
                allBtns.forEach(btn => {
                    if (btn.textContent.trim() === question.correctAnswer) {
                        btn.classList.add('bg-secondary', 'border-secondary', 'text-white');
                        btn.querySelector('span').classList.add('text-white');
                    }
                });

                feedbackEl.className = 'mt-4 rounded-xl p-6 bg-danger/10 border-2 border-danger/20';
                feedbackEl.innerHTML = \`
                    <div class="flex items-start gap-3">
                        <div class="text-2xl">💪</div>
                        <div>
                            <h4 class="font-bold text-danger text-lg mb-1">Keep trying!</h4>
                            <p class="text-gray-700">\${question.explanation}</p>
                        </div>
                    </div>
                \`;
            }
            
            feedbackEl.classList.remove('hidden');
            answeredCount++;
            updateProgress();
        }

        function updateProgress() {
            const progress = (answeredCount / questions.length) * 100;
            document.getElementById('progressBar').style.width = \`\${progress}%\`;

            if (answeredCount === questions.length) {
                setTimeout(showCompletion, 1000);
            }
        }

        function showCompletion() {
            const modal = document.getElementById('completionModal');
            const content = document.getElementById('modalContent');
            const scoreEl = document.getElementById('finalScore');
            
            scoreEl.textContent = \`\${currentScore}/\${questions.length}\`;
            
            modal.classList.remove('hidden');
            // Force reflow
            void modal.offsetWidth;
            
            content.classList.remove('scale-90', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
            
            // Celebration confetti (simple CSS implementation)
            createConfetti();
        }

        function createConfetti() {
            // Simple emoji confetti
            const emojis = ['🌟', '🎉', '⭐', '🏆', '🎈'];
            for (let i = 0; i < 50; i++) {
                const el = document.createElement('div');
                el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                el.style.position = 'fixed';
                el.style.left = Math.random() * 100 + 'vw';
                el.style.top = '-10vh';
                el.style.fontSize = (Math.random() * 20 + 20) + 'px';
                el.style.animation = \`fall \${Math.random() * 3 + 2}s linear forwards\`;
                el.style.zIndex = '60';
                document.body.appendChild(el);
            }
            
            const style = document.createElement('style');
            style.textContent = \`
                @keyframes fall {
                    to { transform: translateY(110vh) rotate(360deg); }
                }
            \`;
            document.head.appendChild(style);
        }

        // Initialize
        renderQuestions();
    </script>
</body>
</html>`;
};
