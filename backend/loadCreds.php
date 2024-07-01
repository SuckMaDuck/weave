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
    $photoDir = "uploads/" .$row["associated_files"]."/images/";

    if(is_dir($photoDir)){
        if(!empty(glob($photoDir."*"))){
            $pfp = glob($photoDir."*")[0];
            $row["pfp"] = $pfp; 
        }
    }

   
    
    unset($row["associated_files"]);
    unset($row["password"]);

    
    echo json_encode($row);
    exit();
}

?>