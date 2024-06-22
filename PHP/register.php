<?php


require("./db.php");

function sanitizeInput($user) {
    foreach($user as $key => $input){
        if($key == "confirmPassword"||"password"){
            $user[$key] = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
            continue;
        }
        $user[$key] = htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
    return $user;
}

function validateForm($block, $conn) {
    $errors = [];
    $user =sanitizeInput($_POST);

    switch ($block) {
        case 1:
            $errors = validatePersonalInfo($user);
            break;

        case 2:
            $errors = validateCredsInfo($user, $conn);
            break;

        case 3:
            $errors = validateExpInfo($user);
            break;

        case 4:
            $errors = validateEmploymentInfo($user);
            break;
        
        case 5:
            $errors =  validateEduInfo($user);
            break;

        case 6: 
            $errors = validateJobPrefInfo($user);
                 if(empty($errors))
                    registerUser($conn, $user);
        default:
            break;
    }

    return $errors;
}

function validatePersonalInfo($user) {
    $errors = [];
    $fields = ['firstName', 'lastName', 'birthDay', 'country', 'gender'];

    foreach ($fields as $field) {
        if (empty($user[$field])) {
            $errors[$field] = "Field must be filled";
        }
        elseif($field == "birthDay" && checkAge($user[$field])){
            $errors[$field] = "Must be at least 18";
        }
        
        elseif (strlen($user[$field]) < 3 && $field != "country") {
            $errors[$field] = "Must be at least 3 characters";
        } 
        
        elseif (strlen($user[$field]) > 10 && $field != "country") {
            $errors[$field] = "Must be at most 10 characters";
        }
        elseif($field == "gender"){
            if($user[$field] != "Male" && $user[$field] != "Female"){
                $errors["gender"] = "There Are Only Two Genders";
            }
        }
    }

    return $errors;
}

function validateCredsInfo($user ,$conn) {
    $errors = [];
    $fields = ['email', 'number', 'password', 'confirmPassword', 'personalLinks'];

    foreach ($fields as $field) {
        if (empty($user[$field]) && $field != "personalLinks") {
            $errors[$field] = "Field must be filled";
        }
        
        elseif ($field == 'email' && !filter_var($user[$field], FILTER_VALIDATE_EMAIL)) {
            $errors[$field] = "Invalid email address";
            
        } 

        elseif ($field == 'email' && isAlreadyRegistered($conn, $user[$field]) ) {
            $errors[$field] = "User already exists";
        } 

        elseif ($field == 'number' && (!ctype_digit($user[$field]) || strlen($user[$field]) != 11)) {
            $errors[$field] = "Enter a valid phone number";
        } 

        elseif ($field == 'password' && strlen($user[$field]) < 10) {
            $errors[$field] = "Must be at least 10 characters";
        } 
        
        elseif ($user["password"] != $user["confirmPassword"]) {
            $errors["confirmPassword"] = "Password does not match";
        }
        elseif($field == "personalLinks" && !empty($user[$field]) &&!isValidSocialMediaProfile($user[$field])){
            $errors["personalLinks"] = "Invalid Link";
        }
    
    }

    return $errors;
}

function validateExpInfo($user){
  $errors = [];
  $fields = ['FOEog', 'FOE2', 'FOE3', 'FOE4', 'YOEog', 'YOE2', 'YOE3', 'YOE4'];


  foreach($fields as $field){
      if(isset($user[$field])){
        if(empty($user[$field])){
          $errors[$field] = "Field must be filled";
        }
      }
  }

  return $errors;
}

function validateJobPrefInfo($user) {
    $errors = [];
    $fields = ['role', 'salary', 'vision', 'notes'];

    foreach ($fields as $field) {
        if (empty($user[$field])) {
            $errors[$field] = "Field must be filled";
        }

         elseif ($field != 'salary' && strlen($user[$field]) < 3) {
            $errors[$field] = "Must be at least 3 characters";
        }
        
        elseif ($field == 'salary' && $user[$field] < 2000) {
            $errors[$field] = "Must be at least 2000";
        }
    }

    return $errors;
} 


function validateEmploymentInfo($user){
    $errors = [];
    $fields = ['positionOne', 'positionTwo', 'positionThree', 'positionFour'];

    if(empty($user["positionOne"])){
        $errors["positionOne"] = "Field must be filled";
    }

    return $errors;
}


function validateEduInfo($user){
    $errors = [];
    $fields = ["personalBackground", "collegeDegrees", "additionalEducation"];
    foreach($fields as $field){
        if(empty($user[$field])){
            $errors[$field] = "Field must be filled";
        }
    }

    return $errors;
}

function isAlreadyRegistered($conn, $email){
    $stmt = $conn->prepare("SELECT email FROM creds WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    return ($result->num_rows) ? true : false;
  
} 

function checkAge($date){

    $currentDate = new DateTime();
    $providedDate = new DateTime($date);
    $age = $currentDate->diff($providedDate)->y;
    return($age < 18 ? true: false);

}

function isValidSocialMediaProfile($url) {
    $patterns = [
        'facebook' => '/^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]+$/',
        'twitter' => '/^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/',
        'instagram' => '/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_\.]+$/',
        'linkedin' => '/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+$/',
        'github' => '/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+$/'
    ];

    foreach ($patterns as $platform => $pattern) {
        if (preg_match($pattern, $url)) {
            return true;
        }
    }

    return false;
}


function registerUser($conn, $user) {
   
    if (isAlreadyRegistered($conn, $user["email"])) {
        echo json_encode(["email" => "User Already Registered"]);
        die();
    }
    

    $firstName = $user["firstName"];
    $lastName = $user["lastName"];
    $birthday = $user["birthDay"];
    $country = $user["country"];
    $gender = $user["gender"];

//4
    $email = $user["email"];
    $number = $user["number"];
    $personalLinks = !empty($user["personalLinks"]) ? $user["personalLinks"] : null;
    $password = password_hash($user["password"], PASSWORD_DEFAULT);

//8
    $FOEog = $user["FOEog"];
    $YOEog = $user["YOEog"];
    $FOE2 = isset($user["FOE2"]) ? $user["FOE2"] : null;
    $YOE2 = isset($user["YOE2"]) ? (int)$user["YOE2"] : null;
    $FOE3 = isset($user["FOE3"]) ? $user["FOE3"] : null;
    $YOE3 = isset($user["YOE3"]) ? (int)$user["YOE3"] : null;
    $FOE4 = isset($user["FOE4"]) ? $user["FOE4"] : null;
    $YOE4 = isset($user["YOE4"]) ? (int)$user["YOE4"] : null;

//4
    $positionOne = $user["positionOne"];
    $positionTwo = !empty($user["positionTwo"]) ? $user["positionTwo"] : null;
    $positionThree = !empty($user["positionThree"]) ? $user["positionThree"] : null;
    $positionFour = !empty($user["positionFour"]) ? $user["positionFour"] : null;

    //3
    $personalBackground = $user["personalBackground"];
    $collegeDegrees = $user["collegeDegrees"];
    $additionalEducation = $user["additionalEducation"];
//4
    $role = $user["role"];
    $salary = $user["salary"];
    $vision = $user["vision"];
    $notes = $user["notes"];

 
    $stmt = $conn->prepare("INSERT INTO creds (first_name, last_name, birthday, country, gender, email, number, personal_links, password, FOEog, YOEog, FOE2, YOE2, FOE3, YOE3, FOE4, YOE4, position_one, position_two, position_three, position_four, personal_background, college_degrees, additional_education, role, salary, vision, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssssisisisissssssssiss",
        $firstName, $lastName, $birthday, $country, $gender, $email, $number, $personalLinks, $password,
        $FOEog, $YOEog, $FOE2, $YOE2, $FOE3, $YOE3, $FOE4, $YOE4,
        $positionOne, $positionTwo, $positionThree, $positionFour,
        $personalBackground, $collegeDegrees, $additionalEducation,
        $role, $salary, $vision, $notes
    );

    $stmt->execute();
    $stmt->close();
}





$block = $_POST["block"];
$errors = validateForm($block, $conn);
echo json_encode($errors);
?>