<?php
$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "model/connect.php");

class DAOAuth{
function select_email($email) {
    $conexion = connect::con();
    $sql = "SELECT email FROM users WHERE email = :email";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([':email' => $email]);
    $result = $stmt->fetch(PDO::FETCH_OBJ);
    connect::close($conexion);
    return $result;
}

function select_username($username) {
    $conexion = connect::con();
    $sql = "SELECT email FROM users WHERE username = :username";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([':username' => $username]);
    $result = $stmt->fetch(PDO::FETCH_OBJ);
    connect::close($conexion);
    return $result;
}

function insert_user($username, $email, $password){
    $hashed_pass = password_hash($password, PASSWORD_ARGON2ID, [
                    'memory_cost' => 65536,
                    'time_cost'   => 4,
                    'threads'     => 2
                ]);
    $hashavatar = hash('sha256', strtolower(trim($username)));
    $avatar = "https://robohash.org/$hashavatar";

    $sql = "INSERT INTO `users`(`username`, `password`, `email`, `role`, `avatar`) 
            VALUES (:username, :password, :email, 'client', :avatar)";

    $conexion = connect::con();
    $stmt = $conexion->prepare($sql);
    $res = $stmt->execute([
        ':username' => $username,
        ':password' => $hashed_pass,
        ':email'    => $email,
        ':avatar'   => $avatar
    ]);
    connect::close($conexion);
    return $res;
}

function select_user($username) {
    $sql = "SELECT username,password,email,role,avatar FROM users WHERE username = :username OR email = :username";
    $conexion = connect::con();

    $stmt = $conexion->prepare($sql);
    $stmt->bindValue(':username', $username);
    $stmt->execute();

    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    connect::close($conexion);

    if ($res) {
        return $res;
    } else {
        return "error_user";
    }
}

function select_data_user($username) {
    $sql = "SELECT * FROM users WHERE username = :username OR email = :username";
    $conexion = connect::con();

    $stmt = $conexion->prepare($sql);
    $stmt->bindValue(':username', $username);
    $stmt->execute();

    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    connect::close($conexion);

    if ($res) {
        return $res;
    } else {
        return "error_user";
    }
}

}