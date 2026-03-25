<?php
session_start();

// Database connection
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'portfolio_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// If already logged in, redirect to dashboard
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: admin_dashboard.php');
    exit;
}

$error = '';
$debug = isset($_GET['debug']); // show debug info if ?debug=1

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($debug) {
        echo "<div style='background: #1e1e2f; padding: 15px; margin: 10px; border-radius: 8px; font-family: monospace;'>";
        echo "<h3>🔍 Debug Info</h3>";
        echo "Entered email: <strong>" . htmlspecialchars($email) . "</strong><br>";
        echo "Entered password: <strong>" . htmlspecialchars($password) . "</strong><br>";
    }

    // Query the database for the admin with the given email
    $stmt = $conn->prepare("SELECT id, email, password FROM admins WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        if ($debug) {
            echo "✅ Admin found in database.<br>";
            echo "Stored email: " . htmlspecialchars($admin['email']) . "<br>";
            echo "Stored password: <strong>" . htmlspecialchars($admin['password']) . "</strong><br>";
            echo "Password length (entered): " . strlen($password) . "<br>";
            echo "Password length (stored): " . strlen($admin['password']) . "<br>";
            echo "Exact match: " . (($password === $admin['password']) ? "✅ YES" : "❌ NO") . "<br>";
        }

        // Direct plain text comparison
        if ($password === $admin['password']) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_email'] = $admin['email'];
            header('Location: admin_dashboard.php');
            exit;
        } else {
            $error = 'Invalid email or password.';
            if ($debug) echo "❌ Password does NOT match.<br>";
        }
    } else {
        $error = 'Invalid email or password.';
        if ($debug) echo "❌ No admin found with that email.<br>";
    }

    if ($debug) echo "</div>";
    $stmt->close();
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Alinor Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #050810 0%, #0a0f1a 100%);
            font-family: 'Inter', sans-serif;
        }
        .glass-card {
            background: rgba(10, 15, 26, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen">
    <div class="glass-card rounded-2xl p-8 w-full max-w-md mx-4">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Admin Login</h1>
            <p class="text-gray-400 mt-2">Access message dashboard</p>
        </div>
        <?php if ($error): ?>
            <div class="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        <form method="POST" action="" class="space-y-5">
            <div>
                <label class="block text-gray-300 mb-2">Email Address</label>
                <input type="email" name="email" required
                       class="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition">
            </div>
            <div>
                <label class="block text-gray-300 mb-2">Password</label>
                <input type="password" name="password" required
                       class="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition">
            </div>
            <button type="submit"
                    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-bold text-white hover:shadow-lg transition">
                Login
            </button>
        </form>
    </div>
</body>
</html>