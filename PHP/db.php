<?php

function DbConnectionError() {
    return ["status" =>false, "message"=>"Database connection failed"];
}

$db_host = "localhost"; 
$db_user = "root";
$db_password = "";
$db_name = "db";
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);


 if ($conn->connect_errno) {
    die(DbConnectionError());
}

   

?>