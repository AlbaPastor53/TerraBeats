<?php
$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "model/connect.php");

class DAOProfile {

    // 1. Obtener los datos del usuario usando el username del token
    public function select_data_user($username) {
        $sql = "SELECT id_user, username, password, email, role, avatar 
        FROM users 
        WHERE username = :username 
        OR email = :username";
        $conexion = connect::con();

        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(':username', $username);
        $stmt->execute();

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        connect::close($conexion);

        return $res ? $res : "error_user";
    }

    // Escenario A: Cambiar SOLO el Nombre de Usuario
    public function update_username_only($id_user, $new_username) {
        $sql = "UPDATE users 
                SET username = :new_username 
                WHERE id_user = :id_user";
        $conexion = connect::con();
        
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(':new_username', $new_username);
        $stmt->bindValue(':id_user', $id_user, PDO::PARAM_INT);
        
        $res = $stmt->execute();
        connect::close($conexion);
        return $res;
    }

    // Escenario B: Cambiar SOLO la Contraseña
    public function update_password_only($id_user, $hashed_password) {
        $sql = "UPDATE users 
                SET password = :password 
                WHERE id_user = :id_user";
        $conexion = connect::con();
        
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(':password', $hashed_password);
        $stmt->bindValue(':id_user', $id_user, PDO::PARAM_INT);
        
        $res = $stmt->execute();
        connect::close($conexion);
        return $res;
    }

    // Escenario C: Cambiar AMBAS cosas a la vez
    public function update_user_full($id_user, $new_username, $hashed_password) {
        $sql = "UPDATE users 
                SET username = :new_username, password = :password 
                WHERE id_user = :id_user";
        $conexion = connect::con();
        
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(':new_username', $new_username);
        $stmt->bindValue(':password', $hashed_password);
        $stmt->bindValue(':id_user', $id_user, PDO::PARAM_INT);
        
        $res = $stmt->execute();
        connect::close($conexion);
        return $res;
    }

}