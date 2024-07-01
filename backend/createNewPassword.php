<?php
session_start();
require("db.php");
function sanitizeInput($user) {
    foreach ($user as $key => $input) {
        $user[$key] = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
    return $user;
}

function validateInput($user) {
    foreach ($user as $key => $input) {
        if (empty($input)) {
            die(json_encode(["status" => false, "message" => "All fields must be filled."]));
        }
    }
    if ($user["password"] != $user["confirmPassword"]) {
        die(json_encode(["status" => false, "message" => "Entered passwords do not match!"]));
    }
}

if (!isset($_SESSION["email"]) || !isset($_SESSION["passcode"]) || !isset($_SESSION["enteredPasscode"])) {
    die(json_encode(["status" => false, "message" => "Either the session or the passcode has expired. Please request another reset code."]));
}

if ($_SESSION["passcode"] != $_SESSION["enteredPasscode"]) {
    die(json_encode(["status" => false, "message" => "Invalid request"]));
}

$email = $_SESSION["email"];
$passcode = $_SESSION["passcode"];
$user = sanitizeInput($_POST);
validateInput($user);

$stmt = $conn->prepare("SELECT `reset_status` FROM `reset_password_attempts` WHERE `email` = ? AND `passcode` = ?");
$stmt->bind_param("ss", $email, $passcode);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows == 0) {
    die(json_encode(["status" => false, "message" => "Invalid request"]));
}

$row = $result->fetch_assoc();
if ($row["reset_status"] == 0) {
    die(json_encode(["status" => false, "message" => "Invalid request"]));
}

$stmt = $conn->prepare("DELETE FROM `reset_password_attempts` WHERE `email` = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->close();

$password = password_hash($user["password"], PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE creds SET `password` = ? WHERE email = ?");
$stmt->bind_param("ss", $password, $email);
$stmt->execute();
$stmt->close();

echo(json_encode(["status" => true, "message" => "Password has been successfully reset."]));
session_unset();
session_destroy();
exit();

?>