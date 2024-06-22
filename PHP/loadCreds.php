<?php
session_start();

require("db.php");
if(empty ($_SESSION)){
    die(json_encode(["status"=> false]));
}
$email = $_SESSION["email"];

$stmt = $conn->prepare("SELECT * FROM creds WHERE `email` = ?");
$stmt->bind_param("s",$email);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if($result->num_rows > 0){
    $row = $result->fetch_assoc();
    echo json_encode($row);
    exit();
}

?>