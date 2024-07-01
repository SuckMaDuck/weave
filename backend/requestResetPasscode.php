<?php
    session_start();
    require("db.php");
    if(isset($_POST["email"])){
        $email =  htmlspecialchars(trim($_POST["email"]), ENT_QUOTES, 'UTF-8');
        if(empty($email) ){
            die(json_encode(["status"=> false, "message"=>"Field must be filled"]));
        }
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            die(json_encode(["status"=> false, "message"=>"Invalid email address"]));
        }else{
            $stmt = $conn->prepare("SELECT email FROM creds WHERE `email` = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            if($result->num_rows === 0){
                die(json_encode(["status"=> false, "message"=>"This email does not exist in our database"]));
            }else{
                $stmt =  $conn->prepare("SELECT * FROM reset_password_attempts WHERE `email` = ?");
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();
                $stmt->close();
                if($result->num_rows !=0){
                    $row = $result->fetch_assoc();
                    $currentTime = new DateTime(); 
                    $lastAttempt = new DateTime($row["reset_attempt"]); 
                    $timeDiffSeconds = $currentTime->getTimestamp() - $lastAttempt->getTimestamp();
                    if($row["wrong_passcode_attempts"] > 5 && $timeDiffSeconds < 7200 ){
                        die(json_encode(["status"=>false, "message"=>"Too many failed attempts! this feature has been blocked for two hours"]));
                    }

                    if($timeDiffSeconds > 120){
                        $stmt = $conn->prepare("DELETE FROM reset_password_attempts WHERE email = ?");
                        $stmt->bind_param("s", $email);
                        $stmt->execute();
                        $stmt->close();
                    }else{
                        die(json_encode(["status"=> false, "message"=>"An email was already sent, You have to wait 2 minutes before requesting another one"]));
                    }
                  
                }

                $passcode = bin2hex(random_bytes(3));
                $_SESSION["email"] =  $email;
                $_SESSION["passcode"] =  $passcode;
                
                $receiver = $email;
                $subject = "reset password email";
                $body = "This is your verification code: " .$passcode;
                $headers = "From: Weave";
                
                $currentTime = (new DateTime())->format('Y-m-d H:i:s');
                $failed_attempts = 0;
                $stmt = $conn->prepare("INSERT INTO reset_password_attempts (email, reset_attempt, passcode, wrong_passcode_attempts) VALUES(?, ?, ?, ?) ");
                $stmt->bind_param("sssi", $email, $currentTime, $passcode,  $failed_attempts);
                $stmt->execute();
                $stmt->close();

                if(mail($receiver, $subject, $body, $headers)){
                    exit(json_encode(["status"=> true, "message"=>"Please check your email"]));
                }else{
                    echo "failed";
                }
            }
        }
    }
?>