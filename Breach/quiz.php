<?php
// filepath: c:\Users\Chris F\OneDrive - UCLan\Documents\Open Day\Sql\cybersecurity_game.php

session_start();

// Initialize game data
if (!isset($_SESSION['score'])) {
    $_SESSION['score'] = 0;
    $_SESSION['current_puzzle'] = 0;
}

// Define puzzles
$puzzles = [
    [
        'question' => "What is the most common method attackers use to gain initial access to a network?",
        'options' => [
            'A' => "Phishing emails",
            'B' => "Physical break-ins",
            'C' => "Zero-day exploits",
            'D' => "Social media hacking"
        ],
        'answer' => 'A'
    ],
    [
        'question' => "Which of the following is a strong password?",
        'options' => [
            'A' => "123456",
            'B' => "password",
            'C' => "P@ssw0rd123!",
            'D' => "qwerty"
        ],
        'answer' => 'C'
    ],
    [
        'question' => "What does the CIA triad stand for in cybersecurity?",
        'options' => [
            'A' => "Confidentiality, Integrity, Availability",
            'B' => "Cybersecurity, Intelligence, Authentication",
            'C' => "Confidentiality, Information, Access",
            'D' => "Control, Integrity, Authorization"
        ],
        'answer' => 'A'
    ]
];

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selected_option = $_POST['option'] ?? '';
    $current_puzzle = $_SESSION['current_puzzle'];

    // Check if the answer is correct
    if ($selected_option === $puzzles[$current_puzzle]['answer']) {
        $_SESSION['score']++;
        $message = "Correct! Your score is now {$_SESSION['score']}.";
    } else {
        $message = "Incorrect. The correct answer was '{$puzzles[$current_puzzle]['answer']}'.";
    }

    // Move to the next puzzle
    $_SESSION['current_puzzle']++;
    if ($_SESSION['current_puzzle'] >= count($puzzles)) {
        $game_over = true;
    }
} else {
    $message = '';
    $game_over = false;
}

// Reset game
if (isset($_POST['reset'])) {
    session_destroy();
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

$current_puzzle = $_SESSION['current_puzzle'] ?? 0;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cybersecurity Puzzle Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #111;
            color: #0f0;
            text-align: center;
            padding: 20px;
        }
        .question {
            margin-bottom: 20px;
            font-size: 1.5em;
        }
        .options button {
            background-color: #222;
            color: #0f0;
            border: 2px solid #0f0;
            padding: 10px 20px;
            margin: 10px;
            cursor: pointer;
            font-size: 1em;
        }
        .options button:hover {
            background-color: #0f0;
            color: #000;
        }
        .scoreboard {
            margin-top: 20px;
            font-size: 1.2em;
        }
        .jigsaw-container {
            margin-top: 30px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            width: 300px;
            margin-left: auto;
            margin-right: auto;
        }
        .jigsaw-piece {
            width: 100px;
            height: 100px;
            margin: 2px;
            background-color: #222;
            border: 1px solid #0f0;
            cursor: pointer;
        }
        .jigsaw-piece.correct {
            background-color: #0f0;
        }
    </style>
</head>
<body>
    <h1>Cybersecurity Puzzle Game</h1>

    <?php if ($game_over): ?>
        <div class="question">Game Over! Your final score is <?= $_SESSION['score'] ?>.</div>
        <form method="post">
            <button type="submit" name="reset">Restart Game</button>
        </form>
    <?php else: ?>
        <div class="question">
            <?= $puzzles[$current_puzzle]['question'] ?>
        </div>
        <form method="post" class="options">
            <?php foreach ($puzzles[$current_puzzle]['options'] as $key => $option): ?>
                <button type="submit" name="option" value="<?= $key ?>"><?= $key ?>: <?= $option ?></button>
            <?php endforeach; ?>
        </form>
        <div class="scoreboard">
            <?= $message ?>
            <br>
            Current Score: <?= $_SESSION['score'] ?>
        </div>
    <?php endif; ?>

    <h2>Jigsaw Puzzle</h2>
    <div class="jigsaw-container" id="jigsaw-container">
        <div class="jigsaw-piece" data-correct="1"></div>
        <div class="jigsaw-piece" data-correct="0"></div>
        <div class="jigsaw-piece" data-correct="0"></div>
        <div class="jigsaw-piece" data-correct="1"></div>
        <div class="jigsaw-piece" data-correct="0"></div>
        <div class="jigsaw-piece" data-correct="1"></div>
        <div class="jigsaw-piece" data-correct="0"></div>
        <div class="jigsaw-piece" data-correct="1"></div>
        <div class="jigsaw-piece" data-correct="0"></div>
    </div>

    <script>
        const pieces = document.querySelectorAll('.jigsaw-piece');
        pieces.forEach(piece => {
            piece.addEventListener('click', () => {
                if (piece.dataset.correct === "1") {
                    piece.classList.add('correct');
                } else {
                    alert("Incorrect piece! Try again.");
                }
            });
        });
    </script>
</body>
</html>