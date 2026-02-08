export interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface Subject {
    id: string;
    title: string;
    questions: Question[];
}

export const generateCBTHTML = (testTitle: string, subjects: Subject[]) => {
    // Map subjects to colors/icons
    const styles = [
        { id: 'math', color: 'blue', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />' },
        { id: 'lang', color: 'green', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />' },
        { id: 'social', color: 'yellow', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' },
        { id: 'science', color: 'red', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />' },
    ];

    // Prepare data for the script
    const testDataObj: Record<string, Question[]> = {};
    const processedSubjects = subjects.map((sub, index) => {
        const style = styles[index % styles.length];
        const safeId = `subject_${index}`;
        testDataObj[safeId] = sub.questions;
        return {
            ...sub,
            safeId,
            style
        };
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${testTitle}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#5D5CDE',
                        jamaica: {
                            green: '#009B3A',
                            yellow: '#FED100',
                            black: '#000000'
                        }
                    }
                }
            },
            darkMode: 'class'
        }
    </script>
    <style>
        .option-label {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .option-label:hover {
            background-color: #f3f4f6;
        }
        
        .dark .option-label:hover {
            background-color: #374151;
        }
        
        input[type="radio"]:checked + .option-label {
            background-color: #5D5CDE;
            color: white;
        }
        
        .dark input[type="radio"]:checked + .option-label {
            background-color: #6D6CEE;
            color: white;
        }
        
        .question-nav-button {
            width: 2.5rem;
            height: 2.5rem;
            margin: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.25rem;
            font-weight: 500;
            cursor: pointer;
        }
        
        .question-nav-button.current {
            background-color: #5D5CDE;
            color: white;
        }
        
        .dark .question-nav-button.current {
            background-color: #6D6CEE;
            color: white;
        }
        
        .question-nav-button.answered {
            background-color: #d1fae5;
            color: #065f46;
        }
        
        .dark .question-nav-button.answered {
            background-color: #064e3b;
            color: #a7f3d0;
        }
        
        .question-nav-button:hover:not(.current) {
            background-color: #f3f4f6;
        }
        
        .dark .question-nav-button:hover:not(.current) {
            background-color: #374151;
        }
        
        .subject-btn {
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .subject-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
    </style>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-5xl">
        <header class="flex justify-between items-center mb-8">
            <div class="flex items-center">
                <div class="w-16 h-8 flex mr-3">
                    <div class="w-1/3 h-full bg-jamaica-black"></div>
                    <div class="w-1/3 h-full bg-jamaica-green"></div>
                    <div class="w-1/3 h-full bg-jamaica-yellow"></div>
                </div>
                <h1 class="text-2xl md:text-3xl font-bold">${testTitle}</h1>
            </div>
            <button id="darkModeToggle" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </button>
        </header>

        <main>
            <!-- Welcome Screen -->
            <div id="welcomeScreen" class="text-center py-8">
                <h2 class="text-3xl font-bold mb-6">Welcome to the Assessment</h2>
                <div class="mb-8 max-w-2xl mx-auto">
                    <p class="mb-4">This Computer-Based Test (CBT) will assess your knowledge in the following subjects:</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        ${processedSubjects.map(sub => `
                        <div class="bg-${sub.style.color}-100 dark:bg-${sub.style.color}-900 p-4 rounded-lg">
                            <h3 class="font-bold text-${sub.style.color}-800 dark:text-${sub.style.color}-200">${sub.title}</h3>
                            <p class="text-${sub.style.color}-700 dark:text-${sub.style.color}-300">${sub.questions.length} Questions</p>
                        </div>
                        `).join('')}
                    </div>
                </div>
                <button id="startTest" class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Start Test
                </button>
            </div>

            <!-- Subject Selection Screen -->
            <div id="subjectScreen" class="hidden">
                <h2 class="text-2xl font-bold mb-6 text-center">Select a Subject</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    ${processedSubjects.map(sub => `
                    <button data-subject="${sub.safeId}" class="subject-btn bg-${sub.style.color}-100 dark:bg-${sub.style.color}-900 hover:bg-${sub.style.color}-200 dark:hover:bg-${sub.style.color}-800 p-6 rounded-xl shadow-md flex flex-col items-center">
                        <div class="text-${sub.style.color}-700 dark:text-${sub.style.color}-300 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                ${sub.style.icon}
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-${sub.style.color}-800 dark:text-${sub.style.color}-200 mb-1">${sub.title}</h3>
                        <div class="text-sm text-${sub.style.color}-600 dark:text-${sub.style.color}-400 subject-status" id="${sub.safeId}-status">0/${sub.questions.length} completed</div>
                    </button>
                    `).join('')}
                </div>
                <div class="text-center">
                    <div class="mb-4 text-lg">
                        <span class="font-medium">Overall Progress:</span>
                        <span id="overallProgress">0/${processedSubjects.reduce((acc, s) => acc + s.questions.length, 0)} (0%)</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
                        <div id="progressBar" class="bg-primary h-4 rounded-full" style="width: 0%"></div>
                    </div>
                    <button id="viewResults" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow hidden">
                        View Results
                    </button>
                </div>
            </div>

            <!-- Test Screen -->
            <div id="testScreen" class="hidden">
                <div class="flex justify-between items-center mb-6">
                    <button id="backToSubjects" class="flex items-center text-primary hover:text-primary-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Subjects
                    </button>
                    <div id="currentSubjectTitle" class="text-xl font-bold"></div>
                    <div class="w-24"></div> <!-- Spacer for alignment -->
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <!-- Question navigation -->
                    <div class="md:col-span-1 order-2 md:order-1">
                        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                            <h3 class="font-bold mb-3">Question Navigation</h3>
                            <div id="questionNav" class="flex flex-wrap justify-center"></div>
                        </div>
                    </div>

                    <!-- Question display -->
                    <div class="md:col-span-3 order-1 md:order-2">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <div class="flex justify-between items-center mb-4">
                                <h3 id="questionNumber" class="font-bold text-lg">Question 1</h3>
                                <span id="questionCounter" class="text-gray-600 dark:text-gray-400">1/40</span>
                            </div>
                            <div id="questionContent" class="mb-6 text-lg"></div>
                            <div id="optionsContainer" class="space-y-3 mb-6"></div>
                            <div class="flex justify-between mt-8">
                                <button id="prevQuestion" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-lg flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>
                                <button id="nextQuestion" class="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg flex items-center">
                                    Next
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Screen -->
            <div id="resultsScreen" class="hidden text-center py-8">
                <h2 class="text-3xl font-bold mb-8">Test Results</h2>
                <div class="max-w-3xl mx-auto">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                        <h3 class="text-2xl font-bold mb-4">Overall Score</h3>
                        <div class="text-5xl font-bold text-primary mb-4" id="finalScore">0/0</div>
                        <div class="text-xl mb-6" id="finalPercentage">0%</div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 mb-6">
                            <div id="finalProgressBar" class="bg-primary h-6 rounded-full flex items-center justify-center text-white text-sm font-medium" style="width: 0%">0%</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        ${processedSubjects.map(sub => `
                        <div class="bg-${sub.style.color}-100 dark:bg-${sub.style.color}-900 p-4 rounded-lg">
                            <h3 class="font-bold text-${sub.style.color}-800 dark:text-${sub.style.color}-200 text-lg mb-2">${sub.title}</h3>
                            <div class="text-3xl font-bold text-${sub.style.color}-800 dark:text-${sub.style.color}-200" id="${sub.safeId}Score">0/${sub.questions.length}</div>
                            <div class="text-${sub.style.color}-700 dark:text-${sub.style.color}-300" id="${sub.safeId}Percentage">0%</div>
                        </div>
                        `).join('')}
                    </div>
                    
                    <button id="restartTest" class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow text-lg">
                        Restart Test
                    </button>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Check for dark mode preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        
        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
        });
        
        // Listen for system dark mode changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });

        // Test data
        const testData = ${JSON.stringify(testDataObj)};
        const subjectMeta = ${JSON.stringify(processedSubjects.map(s => ({ id: s.safeId, title: s.title, count: s.questions.length })))}

        // User progress data structure
        const userProgress = {
            ...Object.fromEntries(subjectMeta.map(s => [s.id, Array(s.count).fill(null)])),
            currentSubject: null,
            currentQuestion: 0
        };
        
        // DOM elements
        const welcomeScreen = document.getElementById('welcomeScreen');
        const subjectScreen = document.getElementById('subjectScreen');
        const testScreen = document.getElementById('testScreen');
        const resultsScreen = document.getElementById('resultsScreen');
        const startTest = document.getElementById('startTest');
        const backToSubjects = document.getElementById('backToSubjects');
        const viewResults = document.getElementById('viewResults');
        const restartTest = document.getElementById('restartTest');

        // Event listeners for navigation
        startTest.addEventListener('click', () => {
            welcomeScreen.classList.add('hidden');
            subjectScreen.classList.remove('hidden');
            updateSubjectProgress();
        });
        
        backToSubjects.addEventListener('click', () => {
            testScreen.classList.add('hidden');
            subjectScreen.classList.remove('hidden');
            updateSubjectProgress();
        });
        
        document.querySelectorAll('[data-subject]').forEach(button => {
            button.addEventListener('click', () => {
                userProgress.currentSubject = button.dataset.subject;
                subjectScreen.classList.add('hidden');
                testScreen.classList.remove('hidden');
                setupTest();
            });
        });
        
        viewResults.addEventListener('click', () => {
            subjectScreen.classList.add('hidden');
            calculateResults();
            resultsScreen.classList.remove('hidden');
        });
        
        restartTest.addEventListener('click', () => {
            resetTest();
            resultsScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
        });
        
        document.getElementById('prevQuestion').addEventListener('click', () => {
            if (userProgress.currentQuestion > 0) {
                userProgress.currentQuestion--;
                displayQuestion();
            }
        });
        
        document.getElementById('nextQuestion').addEventListener('click', () => {
            const subject = userProgress.currentSubject;
            const maxQ = testData[subject].length - 1;
            
            if (userProgress.currentQuestion < maxQ) {
                userProgress.currentQuestion++;
                displayQuestion();
            } else {
                testScreen.classList.add('hidden');
                subjectScreen.classList.remove('hidden');
                updateSubjectProgress();
            }
        });

        // Function to setup the test for the current subject
        function setupTest() {
            const currentSubjectId = userProgress.currentSubject;
            const currentSubjectMeta = subjectMeta.find(s => s.id === currentSubjectId);
            
            document.getElementById('currentSubjectTitle').textContent = currentSubjectMeta.title;
            
            // Create question navigation buttons
            const questionNav = document.getElementById('questionNav');
            questionNav.innerHTML = '';
            
            const questionCount = testData[currentSubjectId].length;

            for (let i = 0; i < questionCount; i++) {
                const button = document.createElement('div');
                button.textContent = i + 1;
                button.classList.add('question-nav-button');
                
                if (userProgress[currentSubjectId][i] !== null) {
                    button.classList.add('answered');
                }
                
                button.addEventListener('click', () => {
                    userProgress.currentQuestion = i;
                    displayQuestion();
                });
                
                questionNav.appendChild(button);
            }
            
            displayQuestion();
        }
        
        // Function to display the current question
        function displayQuestion() {
            const subject = userProgress.currentSubject;
            const questionIndex = userProgress.currentQuestion;
            const questionData = testData[subject][questionIndex];
            
            // Update question number and counter
            document.getElementById('questionNumber').textContent = \`Question \${questionIndex + 1}\`;
            document.getElementById('questionCounter').textContent = \`\${questionIndex + 1}/\${testData[subject].length}\`;
            
            // Display question content
            document.getElementById('questionContent').textContent = questionData.question;
            
            // Create options
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';
            
            const options = ['A', 'B', 'C', 'D'];
            
            // Handle if there are fewer than 4 options
            const availableOptions = questionData.options.slice(0, 4);

            availableOptions.forEach((optText, index) => {
                const optionChar = options[index];
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('option-container');
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'answer';
                input.id = \`option\${optionChar}\`;
                input.value = optionChar;
                input.classList.add('hidden');
                
                // Check if this option was previously selected
                if (userProgress[subject][questionIndex] === optionChar) {
                    input.checked = true;
                }
                
                input.addEventListener('change', (e) => {
                    userProgress[subject][questionIndex] = e.target.value;
                    updateSubjectProgress();
                    
                    // Update the question nav button to show it's been answered
                    const navButtons = document.querySelectorAll('#questionNav .question-nav-button');
                    if (navButtons[questionIndex]) {
                        navButtons[questionIndex].classList.add('answered');
                    }
                });
                
                const label = document.createElement('label');
                label.htmlFor = \`option\${optionChar}\`;
                label.classList.add('option-label');
                label.innerHTML = \`<span class="font-bold mr-2">\${optionChar}.</span> \${optText}\`;
                
                optionDiv.appendChild(input);
                optionDiv.appendChild(label);
                optionsContainer.appendChild(optionDiv);
            });
            
            // Update question navigation to highlight current question
            const navButtons = document.querySelectorAll('#questionNav .question-nav-button');
            navButtons.forEach((btn, idx) => {
                if (idx === questionIndex) {
                    btn.classList.add('current');
                } else {
                    btn.classList.remove('current');
                }
            });
        }
        
        // Function to update subject progress
        function updateSubjectProgress() {
            let totalCompleted = 0;
            let totalQuestions = 0;

            subjectMeta.forEach(meta => {
                const completed = userProgress[meta.id].filter(a => a !== null).length;
                totalCompleted += completed;
                totalQuestions += meta.count;
                
                const statusEl = document.getElementById(\`\${meta.id}-status\`);
                if (statusEl) {
                    statusEl.textContent = \`\${completed}/\${meta.count} completed\`;
                }
            });

            const percentage = totalQuestions > 0 ? Math.round((totalCompleted / totalQuestions) * 100) : 0;
            
            document.getElementById('overallProgress').textContent = \`\${totalCompleted}/\${totalQuestions} (\${percentage}%)\`;
            document.getElementById('progressBar').style.width = \`\${percentage}%\`;
            
            // Show/hide results button
            if (totalCompleted === totalQuestions && totalQuestions > 0) {
                document.getElementById('viewResults').classList.remove('hidden');
            } else {
                document.getElementById('viewResults').classList.add('hidden');
            }
        }
        
        // Function to calculate and display results
        function calculateResults() {
            let totalScore = 0;
            let totalQuestions = 0;
            
            subjectMeta.forEach(meta => {
                let subjectScore = 0;
                const subjectQuestions = testData[meta.id];
                
                userProgress[meta.id].forEach((answer, index) => {
                    if (subjectQuestions[index] && answer === subjectQuestions[index].correctAnswer) {
                        subjectScore++;
                        totalScore++;
                    }
                });
                
                const percentage = meta.count > 0 ? Math.round((subjectScore / meta.count) * 100) : 0;
                
                document.getElementById(\`\${meta.id}Score\`).textContent = \`\${subjectScore}/\${meta.count}\`;
                document.getElementById(\`\${meta.id}Percentage\`).textContent = \`\${percentage}%\`;
                totalQuestions += meta.count;
            });
            
            const totalPercentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
            
            document.getElementById('finalScore').textContent = \`\${totalScore}/\${totalQuestions}\`;
            document.getElementById('finalPercentage').textContent = \`\${totalPercentage}%\`;
            document.getElementById('finalProgressBar').style.width = \`\${totalPercentage}%\`;
            document.getElementById('finalProgressBar').textContent = \`\${totalPercentage}%\`;
        }
        
        // Function to reset the test
        function resetTest() {
            subjectMeta.forEach(meta => {
                userProgress[meta.id] = Array(meta.count).fill(null);
            });
            
            userProgress.currentSubject = null;
            userProgress.currentQuestion = 0;
            
            updateSubjectProgress();
        }
    </script>
</body>
</html>`;
};
