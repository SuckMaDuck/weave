<?php
session_start();

require("db.php");

if (!isset($_COOKIE["user_session"])) {
    die(false);
} 
else {
    $cookie = $_COOKIE["user_session"];
    $stmt = $conn->prepare("SELECT * FROM sessions WHERE `cookie` = ?");
    $stmt->bind_param("s", $cookie);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 0) {
        die(false);
    } 
    else {
        $row = $result->fetch_assoc();
        $stmt->close();
        if ($row["session_id"] != session_id()) {
            die(false);
        } 
        else {
            $stmt  = $conn->prepare("SELECT `email` FROM creds WHERE email = ?");
            $stmt->bind_param("s", $row["email"]);
            $stmt->execute();
            $anotherResult = $stmt->get_result();
            $stmt->close();
            if($anotherResult->num_rows == 0){
                die(false);
            }
            else{
                echo true;
            }
        }
    }
}
?>