document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskPriority = document.getElementById('taskPriority');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    const progressText = document.getElementById('progressText');
    const progressIndicator = document.getElementById('progressIndicator');
    const completedCountEl = document.getElementById('completedCount');
    const totalCountEl = document.getElementById('totalCount');

    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');

    // Filter Elements
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Settings Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.querySelector('.close-modal');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const settingName = document.getElementById('settingName');
    const settingAvatar = document.getElementById('settingAvatar');
    const settingBg = document.getElementById('settingBg');
    const settingAvatarFile = document.getElementById('settingAvatarFile');
    const settingBgFile = document.getElementById('settingBgFile');
    const userNameDisplay = document.getElementById('userName');
    const userAvatarDisplay = document.getElementById('userAvatar');
    const themeBtn = document.getElementById('themeBtn'); // Random theme

    // Quote Elements
    const quoteText = document.getElementById('quoteText');
    const quoteWidget = document.querySelector('.quote-widget');

    // Audio
    const soundComplete = document.getElementById('soundComplete');
    const soundDelete = document.getElementById('soundDelete');
    const soundCheer = document.getElementById('soundCheer');

    // State
    let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
    let currentFilter = 'all';
    let userSettings = JSON.parse(localStorage.getItem('dashboard_settings')) || {
        name: 'Welcome',
        avatar: '',
        bg: ''
    };

    // --- Initialization ---
    applySettings();
    renderTasks();
    updateStats();
    updateTime();
    displayQuote(); // Initial quote
    setInterval(updateTime, 1000);
    // Change quote every 5 minutes
    setInterval(displayQuote, 300000);

    // --- Quotes Logic ---
    const quotes = [
        "Believe you can and you're halfway there.",
        "Don't watch the clock; do what it does. Keep going.",
        "Your future is created by what you do today, not tomorrow.",
        "Small steps every day add up to big results.",
        "Rest if you must, but don't you quit.",
        "Productivity is about doing the right things, not just doing things.",
        "You are doing better than you think.",
        "Focus on progress, not perfection.",
        "Take a deep breath. You've got this.",
        "Every checked box is a victory.",
        "Success is the sum of small efforts repeated day in and day out.",
        "The secret of getting ahead is getting started.",
        "Don't stop when you're tired. Stop when you're done.",
        "Your only limit is your mind.",
        "Discipline is doing what needs to be done, even if you don't want to to do it.",
        "Work hard in silence, let your success be your noise.",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        "Don't wish for it. Work for it.",
        "It always seems impossible until it's done.",
        "Wake up with determination. Go to bed with satisfaction.",
        "Make today so awesome yesterday gets jealous."
    ];

    function displayQuote() {
        if (!quoteText) return;
        // Fade out
        quoteWidget.style.opacity = 0;

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            quoteText.textContent = `"${quotes[randomIndex]}"`;
            // Fade in
            quoteWidget.style.opacity = 1;
        }, 500);
    }

    // --- Clock & Date ---
    function updateTime() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    // --- Settings Logic ---
    function applySettings() {
        if (userSettings.name) userNameDisplay.textContent = userSettings.name;

        if (userSettings.avatar) {
            userAvatarDisplay.innerHTML = `<img src="${userSettings.avatar}" alt="Avatar">`;
        } else {
            userAvatarDisplay.innerHTML = `<i class="fas fa-user-astronaut"></i>`;
        }

        if (userSettings.bg) {
            document.body.style.backgroundImage = `url('${userSettings.bg}')`;
        } else {
            document.body.style.backgroundImage = '';
        }

        // Populate inputs
        settingName.value = userSettings.name;
        settingAvatar.value = userSettings.avatar;
        settingBg.value = userSettings.bg;
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => settingsModal.classList.add('show'));
    }
    if (closeModal) {
        closeModal.addEventListener('click', () => settingsModal.classList.remove('show'));
    }
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('show');
    });

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', async () => {

            // Handle File Uploads (Convert to Base64)
            const handleFile = (fileInput) => {
                return new Promise((resolve) => {
                    if (fileInput.files && fileInput.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.readAsDataURL(fileInput.files[0]);
                    } else {
                        resolve(null);
                    }
                });
            };

            const avatarBase64 = await handleFile(settingAvatarFile);
            const bgBase64 = await handleFile(settingBgFile);

            userSettings = {
                name: settingName.value.trim() || userSettings.name || 'Welcome',
                avatar: avatarBase64 || settingAvatar.value.trim() || userSettings.avatar,
                bg: bgBase64 || settingBg.value.trim() || userSettings.bg
            };

            localStorage.setItem('dashboard_settings', JSON.stringify(userSettings));
            applySettings();
            settingsModal.classList.remove('show');

            // Reset file inputs
            if (settingAvatarFile) settingAvatarFile.value = '';
            if (settingBgFile) settingBgFile.value = '';
        });
    }

    // --- Settings Logic ---
    const toggleColorBtn = document.getElementById('toggleColorBtn');
    let showColors = localStorage.getItem('dashboard_show_colors') !== 'false'; // Default true

    function applyColorState() {
        const globes = document.querySelector('.background-globes');
        if (!showColors) {
            globes.classList.add('hidden');
            toggleColorBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            globes.classList.remove('hidden');
            toggleColorBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    if (toggleColorBtn) {
        toggleColorBtn.addEventListener('click', () => {
            showColors = !showColors;
            localStorage.setItem('dashboard_show_colors', showColors);
            applyColorState();
        });
        applyColorState(); // Initial check
    }

    // Random Theme Button (Auto-Randomize Toggle)
    let isAutoTheme = false;
    let autoThemeInterval;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (!showColors) {
                // If colors are hidden, auto-show them when enabling theme
                showColors = true;
                localStorage.setItem('dashboard_show_colors', true);
                applyColorState();
            }

            const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
            const changeColors = () => {
                const globe1 = document.querySelector('.globe-1');
                const globe2 = document.querySelector('.globe-2');
                if (globe1 && globe2) {
                    globe1.style.background = `#${randomColor()}`;
                    globe2.style.background = `#${randomColor()}`;
                }
            };

            isAutoTheme = !isAutoTheme;

            if (isAutoTheme) {
                // Start Auto Mode
                themeBtn.classList.add('active');
                changeColors(); // Immediate change
                autoThemeInterval = setInterval(changeColors, 3000); // Change every 3s
            } else {
                // Stop Auto Mode
                themeBtn.classList.remove('active');
                clearInterval(autoThemeInterval);
            }
        });
    }

    // --- Task Management ---
    function saveTasks() {
        localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
        updateStats();
        renderTasks();
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false,
                dueDate: taskDueDate.value,
                priority: taskPriority.value || 'medium'
            };
            tasks.push(newTask);

            // Reset inputs
            taskInput.value = '';
            taskDueDate.value = '';
            taskPriority.value = 'medium';

            saveTasks();
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // Date Formatting
        let dateHtml = '';
        if (task.dueDate) {
            const dateObj = new Date(task.dueDate);
            if (!isNaN(dateObj)) {
                const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                dateHtml = `<span><i class="far fa-clock"></i> ${dateStr}</span>`;
            }
        }

        const priority = task.priority || 'medium';

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-meta">
                    <span class="badge badge-${priority}" title="Click to change priority">${priority}</span>
                    ${dateHtml}
                </div>
            </div>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        // Event Listeners

        // Priority Cycling
        const badge = li.querySelector('.badge');
        badge.style.cursor = 'pointer';
        badge.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent potentially triggering other clicks
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(task.priority || 'medium');
            const nextIndex = (currentIndex + 1) % priorities.length;
            task.priority = priorities[nextIndex];

            // Update UI immediately (optional, but renderTasks will do it)
            // Save and Re-render to sort
            saveTasks();
        });

        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked && !task.completed) {
                playSound(soundComplete);
            }
            task.completed = checkbox.checked;
            saveTasks();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            playSound(soundDelete);
            li.style.transform = 'translateY(-10px)';
            li.style.opacity = '0';
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
            }, 300);
        });

        // Task Editing
        const taskTextSpan = li.querySelector('.task-text');
        taskTextSpan.addEventListener('dblclick', () => {
            enableEditing(li, task, taskTextSpan);
        });

        return li;
    }

    function renderTasks() {
        taskList.innerHTML = '';

        let filteredTasks = tasks;
        if (currentFilter === 'active') filteredTasks = tasks.filter(t => !t.completed);
        else if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

        const priorityVal = { high: 3, medium: 2, low: 1 };

        filteredTasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;

            const pA = priorityVal[a.priority] || 2;
            const pB = priorityVal[b.priority] || 2;

            if (pB === pA) return b.id - a.id;

            return pB - pA;
        });

        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filteredTasks.forEach(task => {
                taskList.appendChild(createTaskElement(task));
            });
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    function enableEditing(li, task, span) {
        if (task.completed) return;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = task.text;

        input.addEventListener('click', e => e.stopPropagation());

        const parent = span.parentNode;
        parent.replaceChild(input, span);
        input.focus();

        let isSaving = false;

        const saveEdit = () => {
            if (isSaving) return;
            isSaving = true;

            const newText = input.value.trim();
            if (newText) {
                task.text = newText;
                span.textContent = newText;
                if (parent.contains(input)) {
                    parent.replaceChild(span, input);
                }
                saveTasks();
            } else {
                if (parent.contains(input)) {
                    parent.replaceChild(span, input);
                }
            }
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }

    function playSound(audio) {
        if (audio) {
            audio.volume = 0.4;
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio error:', e));
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;

        // Weighted Progress Logic
        const weights = { high: 3, medium: 2, low: 1 };

        let totalPoints = 0;
        let earnedPoints = 0;

        tasks.forEach(task => {
            const weight = weights[task.priority] || 2; // Default to medium
            totalPoints += weight;
            if (task.completed) {
                earnedPoints += weight;
            }
        });

        completedCountEl.textContent = completedTasks;
        totalCountEl.textContent = totalTasks;

        const percentage = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
        progressText.textContent = `${percentage}%`;

        // Circumference 2*PI*60 approx 377
        const circumference = 377;
        const offset = circumference - (percentage / 100) * circumference;
        progressIndicator.style.strokeDashoffset = offset;

        if (percentage === 100 && totalTasks > 0) {
            triggerConfetti();
        }
    }

    function triggerConfetti() {
        if (window.confettiCaught) return;
        window.confettiCaught = true;

        playSound(soundCheer);

        if (window.confetti) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        setTimeout(() => { window.confettiCaught = false; }, 3000);
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addTask);
    }
    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    }

    // --- Pomodoro Timer Logic ---
    let timerInterval;

    // Default Durations
    let durations = {
        standard: 25,
        long: 60,
        shortBreak: 5,
        longBreak: 10,
        cycleBreak25: 20, // Break after 4x25
        cycleBreak60: 30  // Break after 4x60
    };

    let timeLeft = durations.standard * 60;
    let isTimerRunning = false;
    let currentModeTime = durations.standard * 60;

    // Cycle Tracking
    let cycles25 = 0;
    let cycles60 = 0;

    const timerDisplay = document.getElementById('timerDisplay');
    const startTimerBtn = document.getElementById('startTimerBtn');
    const resetTimerBtn = document.getElementById('resetTimerBtn');
    const modeBtns = document.querySelectorAll('.mode-btn');

    // Expand/Collapse Controls
    const pomodoroWidget = document.getElementById('pomodoroWidget');
    const expandTimerBtn = document.getElementById('expandTimerBtn');
    const collapseTimerBtn = document.getElementById('collapseTimerBtn');

    // Settings Inputs
    const settingTimeStandard = document.getElementById('settingTimeStandard');
    const settingTimeLong = document.getElementById('settingTimeLong');
    const settingTimeShortBreak = document.getElementById('settingTimeShortBreak');
    const settingTimeLongBreak = document.getElementById('settingTimeLongBreak');

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startAutoBreak(minutes, message) {
        alert(message);
        currentModeTime = minutes * 60;
        timeLeft = currentModeTime;
        updateTimerDisplay();
        modeBtns.forEach(b => b.classList.remove('active'));
    }

    function toggleTimer() {
        if (isTimerRunning) {
            // Pause
            clearInterval(timerInterval);
            isTimerRunning = false;
            startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            // Start
            isTimerRunning = true;
            startTimerBtn.innerHTML = '<i class="fas fa-pause"></i>';
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    // Timer Finished
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
                    playSound(soundComplete);
                    triggerConfetti();

                    // Cycle Logic
                    if (currentModeTime === durations.standard * 60) {
                        cycles25++;
                        if (cycles25 % 4 === 0) {
                            startAutoBreak(durations.cycleBreak25, `🎉 4 Cycles Complete! Take a LONG break (${durations.cycleBreak25}m).`);
                        } else {
                            startAutoBreak(durations.shortBreak, `✅ Work Done! Take a short break (${durations.shortBreak}m).`);
                        }
                    } else if (currentModeTime === durations.long * 60) {
                        cycles60++;
                        if (cycles60 % 4 === 0) {
                            startAutoBreak(durations.cycleBreak60, `🎉 4 Cycles Complete! Take a LONG break (${durations.cycleBreak60}m).`);
                        } else {
                            startAutoBreak(durations.longBreak, `✅ Work Done! Take a short break (${durations.longBreak}m).`);
                        }
                    } else {
                        alert("Break over! Ready to focus again?");
                        // Reset to standard
                        timeLeft = durations.standard * 60;
                        currentModeTime = durations.standard * 60;
                        updateTimerDisplay();
                        modeBtns.forEach(b => b.classList.remove('active'));
                        if (modeBtns[0]) modeBtns[0].classList.add('active');
                    }
                }
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timeLeft = currentModeTime;
        updateTimerDisplay();
        startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    function setMode(durationMinutes, btn) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';

        currentModeTime = durationMinutes * 60;
        timeLeft = currentModeTime;
        updateTimerDisplay();

        // Update active button state
        modeBtns.forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
    }

    // Toggle Focus Mode (Expand)
    let pomodoroPlaceholder = document.createComment("pomodoro-placeholder");
    const focusQuote = document.getElementById('focusQuote');
    const quoteTextSource = document.getElementById('quoteText');

    // Settings Elements
    const pomoSettingsBtn = document.getElementById('pomoSettingsBtn');
    const pomoSettingsPanel = document.getElementById('pomoSettingsPanel');
    const closePomoSettings = document.getElementById('closePomoSettings');
    const pomoFontSelect = document.getElementById('pomoFontSelect');
    const colorBtns = document.querySelectorAll('.color-btn');

    function toggleFocusMode() {
        const isCurrentlyExpanded = pomodoroWidget.classList.contains('expanded');

        if (!isCurrentlyExpanded) {
            // Expand
            pomodoroWidget.parentNode.insertBefore(pomodoroPlaceholder, pomodoroWidget);
            document.body.appendChild(pomodoroWidget);

            // Sync Quote
            if (focusQuote && quoteTextSource) {
                focusQuote.textContent = quoteTextSource.textContent;
            }

            requestAnimationFrame(() => {
                pomodoroWidget.classList.add('expanded');
            });

            expandTimerBtn.classList.add('hidden');
            collapseTimerBtn.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            // Collapse
            pomodoroWidget.classList.remove('expanded');

            if (pomodoroPlaceholder.parentNode) {
                pomodoroPlaceholder.parentNode.insertBefore(pomodoroWidget, pomodoroPlaceholder);
                pomodoroPlaceholder.parentNode.removeChild(pomodoroPlaceholder);
            }

            expandTimerBtn.classList.remove('hidden');
            collapseTimerBtn.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // --- Personalization & Settings Logic ---
    if (pomoSettingsBtn && pomoSettingsPanel) {
        pomoSettingsBtn.addEventListener('click', () => {
            pomoSettingsPanel.classList.toggle('hidden');
        });

        closePomoSettings.addEventListener('click', () => {
            pomoSettingsPanel.classList.add('hidden');

            // Save & Apply Duration Settings
            durations.standard = parseInt(settingTimeStandard.value) || 25;
            durations.long = parseInt(settingTimeLong.value) || 60;
            durations.shortBreak = parseInt(settingTimeShortBreak.value) || 5;
            durations.longBreak = parseInt(settingTimeLongBreak.value) || 10;

            // Update Buttons Text
            if (modeBtns[0]) {
                modeBtns[0].textContent = `${durations.standard}m`;
                modeBtns[0].dataset.time = durations.standard;
                // If active, update display
                if (modeBtns[0].classList.contains('active')) {
                    setMode(durations.standard, modeBtns[0]);
                }
            }
            if (modeBtns[1]) {
                modeBtns[1].textContent = `${durations.long}m`;
                modeBtns[1].dataset.time = durations.long;
                // If active, update display
                if (modeBtns[1].classList.contains('active')) {
                    setMode(durations.long, modeBtns[1]);
                }
            }
        });

        // Change Font
        pomoFontSelect.addEventListener('change', (e) => {
            timerDisplay.style.fontFamily = e.target.value;
        });

        // Change Color
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                timerDisplay.style.color = color;
                timerDisplay.style.textShadow = `0 0 20px ${color}`;
            });
        });
    }

    if (startTimerBtn && resetTimerBtn && timerDisplay) {
        startTimerBtn.addEventListener('click', toggleTimer);
        resetTimerBtn.addEventListener('click', resetTimer);

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Dynamically read time from dataset as it might have changed
                const time = parseInt(btn.dataset.time);
                setMode(time, btn);
            });
        });

        if (expandTimerBtn && collapseTimerBtn) {
            expandTimerBtn.addEventListener('click', toggleFocusMode);
            collapseTimerBtn.addEventListener('click', toggleFocusMode);
        }

        updateTimerDisplay(); // Initial display
    }

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker Registered!', reg))
                .catch(err => console.log('Service Worker Registration Failed:', err));
        });
    }
});
