<?php
session_start();

define('MAX_ATTEMPTS', 10);

require("./db.php");

function sanitizeInput($user) {
    foreach($user as $key => $input){
        if($key === "password"){
            $user[$key] = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
            continue;
        }
        $user[$key] = htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
    return $user;
}

function validateForm($user){
    $errors = [];
    $fields= ["email", "password"];
    foreach($fields as $field){
        if(empty($user[$field])){
            $errors[$field] = "* Field must be filled";
        }
    }
    return $errors;
}
function getLoginAttempts($conn, $email, $ip) {
    $stmt = $conn->prepare("SELECT * FROM login_attempts WHERE `email` = ? AND `ip_address` = ? ");
    $stmt->bind_param("ss", $email, $ip);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    return $result;
}
function resetAttempts($conn, $email){
    $stmt = $conn->prepare("DELETE FROM login_attempts WHERE `email` = ? AND `ip_address` = ?");
    $stmt->bind_param("ss", $email, $_SERVER["REMOTE_ADDR"]);
    $stmt->execute();
    $stmt->close();
}

function loginAttempts($conn, $email, $attemptTime, $ip){
    $result = getLoginAttempts($conn, $email, $ip);

    if($result->num_rows == 0){
        $stmt = $conn->prepare("INSERT INTO login_attempts (email, attempt_time, ip_address, attempts) VALUES(?, ?, ?, ?)");
        $attempt = 1;
        $stmt->bind_param("sssi", $email, $attemptTime, $ip, $attempt);
        $stmt->execute();
        $stmt->close();
    }

    else{
        $row = $result->fetch_assoc();
        $current_time = new DateTime($attemptTime); 
        $last_Attempt_time = new DateTime($row["attempt_time"]);
        $time_difference = $current_time->diff($last_Attempt_time); 
        $minutes = ($time_difference->days * 24 * 60) + ($time_difference->h * 60) + $time_difference->i; 
        
        if ($minutes >= 2) { 
            resetAttempts($conn, $email);
            return;
        }
        
        
        if($row["attempts"] < MAX_ATTEMPTS){
            $attempt = ++$row["attempts"];
            $stmt = $conn->prepare("UPDATE login_attempts SET `attempts` = ?, `attempt_time` = ? WHERE `email` = ? AND `ip_address` = ?");
            $current_time = date("Y-m-d H:i:s");
            $stmt->bind_param("isss", $attempt, $current_time, $email, $ip);
            $stmt->execute();
            $stmt->close();
        }
        else{
            die(json_encode(["status"=>false,"message"=>["email"=>"* Your account has been temporarily suspended"]]));
        }

    }
}

function checkSuspension ($conn, $email, $ip, $attemptTime) {
    $result = getLoginAttempts($conn, $email, $ip);

    if($result->num_rows != 0){
        $row = $result->fetch_assoc();
        if($row["attempts"] >= MAX_ATTEMPTS){
            $current_time = new DateTime($attemptTime); 
            $last_Attempt_time = new DateTime($row["attempt_time"]);
            $time_difference = $current_time->diff($last_Attempt_time); 
            $minutes = ($time_difference->days * 24 * 60) + ($time_difference->h * 60) + $time_difference->i; 
            
            if ($minutes >= 2) { 
                resetAttempts($conn, $email);
                return(false);
            }
            else{
                return(true);
            }
        }

    }
    return false;
}

function login($user, $conn){
    $stmt = $conn->prepare("SELECT email, password FROM creds WHERE `email` = ? ");
    $stmt->bind_param("s", $user["email"]);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows == 0){
        die(json_encode(["status" => false, "message" =>["email" => "* User does not exist!"]]));
    }

    $row = $result->fetch_assoc();
    $stmt->close();

    if(!password_verify($user["password"], $row["password"])){
        $current_time = date("Y-m-d H:i:s");
        loginAttempts($conn, $user["email"], $current_time, $_SERVER['REMOTE_ADDR']);
        die(json_encode(["status" => false, "message" => ["password"=>"* Wrong password"]]));
    } 
    else {
        $current_time = date("Y-m-d H:i:s");
        if(checkSuspension($conn, $user["email"], $_SERVER["REMOTE_ADDR"], $current_time) == true){
            die(json_encode(["status"=>false,"message"=>["email"=>"* Your account has been temporarily suspended"]]));
        }
        else{
            resetAttempts($conn, $user["email"]);
            $_SESSION["email"] = $user["email"];
            $cookie = bin2hex(random_bytes(16));
            setcookie("user_session", $cookie, time() + (86400 * 7), "/", "", true, true);
            $email = $user["email"];
            $_SESSION["id"] =  bin2hex(random_bytes(16));
            $id =   $_SESSION["id"];
            $stmt = $conn->prepare("INSERT INTO sessions (email, cookie, `session_id`) VALUES(?, ?, ?)");
            $stmt->bind_param("sss", $email, $cookie, $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => true]);
        }
    }
}

$user = sanitizeInput($_POST);
$errors = validateForm($user);

if(!empty($errors)){
    die(json_encode(["status" => false, "message" => $errors]));
} 
else{
    login($user, $conn);
}

?>