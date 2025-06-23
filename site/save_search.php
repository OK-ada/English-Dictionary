<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $word = $_POST['word'];
    
    $stmt = $pdo->prepare("INSERT INTO searches (word) VALUES (?)");
    $stmt->execute([$word]);
    
    echo json_encode(['success' => true]);
}