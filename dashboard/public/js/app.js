document.addEventListener('DOMContentLoaded', () => {
    // !! WICHTIG: Ersetzen Sie dies durch die tatsächliche URL Ihres Render Web Services (API) !!
    const API_URL = '/src/api.php'; // Pfad zum Backend-Skript

    const form = document.getElementById('punishmentForm');
    const tableBody = document.getElementById('punishmentTable').querySelector('tbody');
    const messageDiv = document.getElementById('message');

    // Funktion zum Laden und Anzeigen der Historie
    async function loadPunishments() {
        try {
            const response = await fetch(`${API_URL}?action=get`);
            const punishments = await response.json();
            
            tableBody.innerHTML = ''; // Vorherige Einträge löschen

            punishments.forEach(p => {
                const row = tableBody.insertRow();
                
                // CSS-Klasse für Farbkodierung
                let typeClass = p.type.replace(/\s/g, '-'); // Leerzeichen durch Bindestriche ersetzen
                row.classList.add(`row-${typeClass}`);

                row.insertCell().textContent = new Date(p.date).toLocaleString();
                row.insertCell().textContent = p.type;
                row.insertCell().textContent = p.user_id;
                row.insertCell().textContent = p.reason;
                row.insertCell().textContent = p.moderator_id;
            });
        } catch (error) {
            console.error('Fehler beim Laden der Strafen:', error);
            tableBody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Fehler beim Laden der Daten.</td></tr>';
        }
    }

    // Event-Listener für das Formular
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Daten im JSON-Format an das Backend senden
                body: JSON.stringify({ ...data, action: 'save' }) 
            });

            const result = await response.json();

            if (result.success) {
                messageDiv.innerHTML = '<div class="alert alert-success">Strafe erfolgreich gespeichert!</div>';
                form.reset(); // Formular zurücksetzen
                loadPunishments(); // Liste aktualisieren
            } else {
                messageDiv.innerHTML = `<div class="alert alert-danger">Fehler: ${result.message}</div>`;
            }

        } catch (error) {
            messageDiv.innerHTML = `<div class="alert alert-danger">Ein unerwarteter Fehler ist aufgetreten: ${error.message}</div>`;
        }
    });

    // Dashboard beim Laden füllen
    loadPunishments();
});