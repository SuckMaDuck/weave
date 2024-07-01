<?php
    session_start();
    require("db.php");

    $email = $_SESSION["email"];
    $stmt = $conn->prepare("DELETE FROM sessions WHERE `email` = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->close();
    setcookie("user_session", $cookie, time() - 1, "/", "", true, true);
    session_unset();
    session_regenerate_id(true);
    session_destroy();

?>