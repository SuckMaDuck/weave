<?php
session_start();


$email = $_SESSION["email"];
require("db.php");

function sanitizeInput($user) {
    foreach($user as $key => $input){
        $user[$key] = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
    return $user;
}

function validateFields($user){
    foreach($user as $key => $input){
        if(strpos($key, "YOE") !== false && $input < 1){
            die(json_encode(["status"=> false, "message"=> "at least 1 year of exp"]));
        }
    }
}




function updateFields($conn, $user, $field){
    $stmt = $conn->prepare("UPDATE creds SET $field = ? WHERE email = ?");
    
    if(strpos($field, "YOE") !== false){
        $stmt->bind_param("is", $user[$field], $user['email']);
        $stmt->execute();
        $stmt->close();
    }
    else{
        
        $stmt->bind_param("ss", $user[$field], $user['email']);
        $stmt->execute();
        $stmt->close();
    }
    die(json_encode(["status"=> true]));
}


$user = sanitizeInput($_POST);
validateFields($user);
$user += ["email" => $email];
foreach($user as $key => $value){
    updateFields($conn, $user, $key);
}



?>