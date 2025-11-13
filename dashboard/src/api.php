<?php
header('Content-Type: application/json');

// --- Datenbank-Verbindungseinstellungen ---
// !! DIESE WERTE MÜSSEN IN DEN RENDER UMGEBUNGSVARIABLEN GESETZT WERDEN !!
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'mod_dashboard';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';

$dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
$pdo = null;

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Datenbankverbindung fehlgeschlagen.']);
    exit;
}

// --- Hauptlogik ---

$action = $_REQUEST['action'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POST-Anfragen für Speichern
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? $action; // Aktion aus dem JSON-Body holen
    
    if ($action === 'save') {
        $userId = $data['userId'] ?? '';
        $type = $data['type'] ?? '';
        $reason = $data['reason'] ?? '';
        $moderatorId = $data['moderatorId'] ?? '';

        if (empty($userId) || empty($type) || empty($reason) || empty($moderatorId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Bitte alle Felder ausfüllen.']);
            exit;
        }

        try {
            $sql = "INSERT INTO punishments (user_id, moderator_id, type, reason, date) 
                    VALUES (?, ?, ?, ?, NOW())";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$userId, $moderatorId, $type, $reason]);

            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern in der Datenbank: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Ungültige POST-Aktion.']);
    }

} elseif ($action === 'get') {
    // GET-Anfragen für Abrufen der Historie
    try {
        $sql = "SELECT id, user_id, moderator_id, type, reason, date 
                FROM punishments 
                ORDER BY date DESC";
        $stmt = $pdo->query($sql);
        $punishments = $stmt->fetchAll();

        echo json_encode($punishments);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Daten.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ungültige oder fehlende Aktion.']);
}
?>