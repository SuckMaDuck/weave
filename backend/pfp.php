<?php
session_start();
require("db.php");

$email = $_SESSION["email"];
$file = $_FILES['pfp'];
$fileName =  $file["name"];
$fileTmpName =  $file["tmp_name"];
$fileSize = $file["size"];
$fileError =  $file["error"];
$fileInfo = explode(".", $fileName);
$fileExt = strtolower(end($fileInfo));

$stmt = $conn->prepare("SELECT `associated_files` FROM creds WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$folderName = $row["associated_files"];
$stmt->close();

$fileDirectory = validateFile($fileExt, $fileError, $fileSize, $folderName);


$oldPhoto = "uploads/" .$folderName. "/images/*";
$existingFiles = glob($oldPhoto);
foreach ($existingFiles as $file) {
    if (is_file($file)) {
        unlink($file);
    }
}


function validateFile($fileExt, $fileError, $fileSize, $folderName ){
    $validExts = ["jpg", "png", "jpeg"];
    if(in_array($fileExt, $validExts)){
        if($fileError === 0){
            if($fileSize < 15000000){
                $fileNewName =time()."." .$fileExt;
                $fileDirectory = "uploads/" . $folderName . "/images/" . $fileNewName;
            }else{
                die(json_encode(["status"=> false, "message"=> "Too large!"]));
            }
        }else{
            die(json_encode(["status"=> false, "message"=> "There was an error uploading your file"]));
        }
    }else{
        die(json_encode(["status"=> false, "message"=> "Wrong File Ext"]));
    }
    return $fileDirectory;
}



move_uploaded_file($fileTmpName, $fileDirectory);
echo json_encode(["status"=> true])

?>