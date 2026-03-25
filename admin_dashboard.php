<?php
session_start();

// Check if logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin_login.php');
    exit;
}

// Database connection
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'portfolio_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Pagination variables
$limit = 10;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// Count total messages
$totalResult = $conn->query("SELECT COUNT(*) as total FROM messages");
$totalMessages = $totalResult->fetch_assoc()['total'];
$totalPages = ceil($totalMessages / $limit);

// Fetch messages for current page
$stmt = $conn->prepare("SELECT id, fullname, email, message, created_at FROM messages ORDER BY id DESC LIMIT ? OFFSET ?");
$stmt->bind_param("ii", $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();
$messages = $result->fetch_all(MYSQLI_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Messages</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background: #050810; font-family: 'Inter', sans-serif; }
        .glass-card { background: rgba(15, 25, 45, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(59, 130, 246, 0.2); }
        .table-row:hover { background: rgba(59, 130, 246, 0.1); }
    </style>
</head>
<body class="p-6">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                <i class="fas fa-envelope mr-2"></i> Contact Messages
            </h1>
            <div class="flex items-center gap-4">
                <span class="text-gray-400">Logged in as: <?php echo htmlspecialchars($_SESSION['admin_email']); ?></span>
                <a href="logout.php" class="bg-red-600/20 hover:bg-red-600/40 text-red-300 px-4 py-2 rounded-xl transition">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </div>

        <!-- Statistics Card -->
        <div class="glass-card rounded-2xl p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-500/10 rounded-xl p-4 text-center">
                    <i class="fas fa-inbox text-2xl text-blue-400 mb-2"></i>
                    <p class="text-gray-300">Total Messages</p>
                    <p class="text-3xl font-bold text-white"><?php echo $totalMessages; ?></p>
                </div>
                <div class="bg-purple-500/10 rounded-xl p-4 text-center">
                    <i class="fas fa-clock text-2xl text-purple-400 mb-2"></i>
                    <p class="text-gray-300">Last 30 Days</p>
                    <?php
                    $thirtyDays = $conn->query("SELECT COUNT(*) as count FROM messages WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
                    $count30 = $thirtyDays->fetch_assoc()['count'];
                    ?>
                    <p class="text-3xl font-bold text-white"><?php echo $count30; ?></p>
                </div>
                <div class="bg-green-500/10 rounded-xl p-4 text-center">
                    <i class="fas fa-calendar-day text-2xl text-green-400 mb-2"></i>
                    <p class="text-gray-300">Today</p>
                    <?php
                    $today = $conn->query("SELECT COUNT(*) as count FROM messages WHERE DATE(created_at) = CURDATE()");
                    $todayCount = $today->fetch_assoc()['count'];
                    ?>
                    <p class="text-3xl font-bold text-white"><?php echo $todayCount; ?></p>
                </div>
            </div>
        </div>

        <!-- Messages Table -->
        <div class="glass-card rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-white/5 border-b border-white/10">
                        <tr>
                            <th class="px-6 py-4 text-gray-300 font-semibold">ID</th>
                            <th class="px-6 py-4 text-gray-300 font-semibold">Name</th>
                            <th class="px-6 py-4 text-gray-300 font-semibold">Email</th>
                            <th class="px-6 py-4 text-gray-300 font-semibold">Message</th>
                            <th class="px-6 py-4 text-gray-300 font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($messages)): ?>
                             <tr><td colspan="5" class="px-6 py-8 text-center text-gray-400">No messages found.</td></tr>
                        <?php else: ?>
                            <?php foreach ($messages as $msg): ?>
                                <tr class="table-row border-b border-white/5 hover:bg-white/5 transition">
                                    <td class="px-6 py-4 text-gray-300"><?php echo $msg['id']; ?></td>
                                    <td class="px-6 py-4 font-medium text-white"><?php echo htmlspecialchars($msg['fullname']); ?></td>
                                    <td class="px-6 py-4 text-gray-300">
                                        <a href="mailto:<?php echo htmlspecialchars($msg['email']); ?>" class="text-blue-400 hover:underline">
                                            <?php echo htmlspecialchars($msg['email']); ?>
                                        </a>
                                    </td>
                                    <td class="px-6 py-4 text-gray-300 max-w-md">
                                        <div class="truncate"><?php echo htmlspecialchars($msg['message']); ?></div>
                                        <?php if (strlen($msg['message']) > 100): ?>
                                            <button onclick="showFullMessage(<?php echo $msg['id']; ?>)" class="text-xs text-blue-400 mt-1">Read more</button>
                                            <div id="fullmsg-<?php echo $msg['id']; ?>" class="hidden fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4" onclick="this.classList.add('hidden')">
                                                <div class="bg-[#0a0f1a] rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-auto border border-gray-700" onclick="event.stopPropagation()">
                                                    <div class="flex justify-between items-center mb-4">
                                                        <h3 class="text-xl font-bold text-white">Full Message</h3>
                                                        <button onclick="document.getElementById('fullmsg-<?php echo $msg['id']; ?>').classList.add('hidden')" class="text-gray-400 hover:text-white">&times;</button>
                                                    </div>
                                                    <p class="text-gray-300 whitespace-pre-wrap"><?php echo htmlspecialchars($msg['message']); ?></p>
                                                </div>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-6 py-4 text-gray-400 text-sm"><?php echo date('M j, Y g:i a', strtotime($msg['created_at'])); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <?php if ($totalPages > 1): ?>
                <div class="flex justify-center gap-2 py-4 border-t border-white/10">
                    <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                        <a href="?page=<?php echo $i; ?>" 
                           class="px-3 py-1 rounded-lg <?php echo ($page == $i) ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'; ?>">
                            <?php echo $i; ?>
                        </a>
                    <?php endfor; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script>
        function showFullMessage(id) {
            document.getElementById('fullmsg-' + id).classList.remove('hidden');
        }
    </script>
</body>
</html>
<?php $conn->close(); ?>