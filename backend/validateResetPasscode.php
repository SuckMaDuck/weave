<?php

session_start();
require("db.php");


$passcode = htmlspecialchars(trim($_POST["passcode"]), ENT_QUOTES, 'UTF-8');
if (empty($passcode)) {
    die(json_encode(["status" => false, "message" => "Field must be filled"]));
}


if (!isset($_SESSION["email"]) || !isset($_SESSION["passcode"])) {
    die(json_encode(["status" => false, "message" => "Either the session or the passcode has expired, please request another reset code."]));
}

$email = $_SESSION["email"];


$stmt = $conn->prepare("SELECT * FROM reset_password_attempts WHERE `email` = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows == 0) {
    die(json_encode(["status" => false, "message" => "Either the session or the passcode has expired, please request another reset code."]));
}

$row = $result->fetch_assoc();
$attemptTime = $row["reset_attempt"];

$currentTime = new DateTime();
$lastAttempt = new DateTime($row["reset_attempt"]);
$timeDiffSeconds = $currentTime->getTimestamp() - $lastAttempt->getTimestamp();

if ($row["wrong_passcode_attempts"] > 5 && $timeDiffSeconds < 7200) {
    die(json_encode(["status" => false, "message" => "Too many failed attempts! This feature has been blocked for two hours."]));
}

if ($timeDiffSeconds > 300) {
    $stmt = $conn->prepare("DELETE FROM reset_password_attempts WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->close();
    die(json_encode(["status" => false, "message" => "Either the session or the passcode has expired, please request another reset code."]));
}

if ($passcode == $_SESSION["passcode"]) {
    $_SESSION["enteredPasscode"] = $passcode;
    $stmt = $conn->prepare("UPDATE reset_password_attempts SET `reset_status` = ? WHERE `email` = ?");
    $reset_status = 1;
    $stmt->bind_param("is", $reset_status, $email);
    $stmt->execute();
    $stmt->close();
    exit(json_encode(["status" => true]));
} else {
    $stmt = $conn->prepare("UPDATE reset_password_attempts SET `wrong_passcode_attempts` = ? WHERE `email` = ?");
    $wrong_passcode_attempts = $row["wrong_passcode_attempts"] + 1;
    $stmt->bind_param("is", $wrong_passcode_attempts, $email);
    $stmt->execute();
    $stmt->close();
    die(json_encode(["status" => false, "message" => "Wrong passcode"]));
}

?>
