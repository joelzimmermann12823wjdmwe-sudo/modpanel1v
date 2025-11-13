document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;
    
    // 1. Prüfen, ob der Dark Mode gespeichert ist
    const savedMode = localStorage.getItem('theme');

    const updateToggleText = (isDark) => {
        modeToggle.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i> Light Mode'
            : '<i class="fas fa-moon"></i> Dark Mode';
    };

    if (savedMode === 'dark') {
        body.classList.add('dark-mode');
        updateToggleText(true);
    } else {
        body.classList.remove('dark-mode');
        updateToggleText(false);
    }

    // 2. Event-Listener für den Toggle-Button
    modeToggle.addEventListener('click', () => {
        const isDark = !body.classList.contains('dark-mode');
        body.classList.toggle('dark-mode');

        // 3. Modus im localStorage speichern und Button-Text aktualisieren
        if (isDark) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        updateToggleText(isDark);
    });

    // Hier könnten Sie Ihren Code zum Abrufen von api.php einfügen
    // (Achtung: api.php muss unter /src/api.php oder /api.php erreichbar sein)
});