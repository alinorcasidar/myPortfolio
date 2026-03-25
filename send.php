<?php
// send.php
header('Content-Type: application/json');

// Database configuration (adjust as needed)
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'portfolio_db';

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $message  = trim($_POST['message'] ?? '');

    // Basic validation
    if (empty($fullname) || empty($email) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
        exit;
    }

    // Prepare and execute
    $stmt = $conn->prepare("INSERT INTO messages (fullname, email, message) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $fullname, $email, $message);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Message sent successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    exit;
} else {
    // Not a POST request
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}
?>