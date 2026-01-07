<?php
session_start();

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if($username == '' && $password == ''){
    $_SESSION
header("location: ../summary_user.html");
exit;
}
?>
