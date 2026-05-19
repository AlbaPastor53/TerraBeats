<?php
$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "model/connect.php");

class DAOHome
{
	function select_all_event(){
		// echo json_encode("select_all_user");
        // exit();
		$sql = "SELECT te.*, c.name_city 
				FROM terra_events te
				JOIN cities c ON te.id_city = c.id_city";
		$conexion = connect::con();
		$stmt = $conexion->prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		connect::close($conexion);
		return $res;
	}

	function select_category(){
		// echo json_encode("select_category");
        // exit();

		$sql = "SELECT * FROM categories";
		$conexion = connect::con();
		$stmt = $conexion->prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		connect::close($conexion);
		return $res;
	}

	function select_artist(){
		// echo json_encode("select_artist");
        // exit();

	
		$sql = "SELECT * FROM artists";
		$conexion = connect::con();
		$stmt = $conexion->prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		connect::close($conexion);
		return $res;
	}

	function select_city(){
		// echo json_encode("select_city");
        // exit();


		$sql = "SELECT * FROM cities";
		$conexion = connect::con();
		$stmt = $conexion->prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		connect::close($conexion);
		return $res;
	}

	function select_type(){
		// echo json_encode("select_type");
        // exit();
		
		$sql = "SELECT * FROM types";
		$conexion = connect::con();
		$stmt = $conexion->prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		connect::close($conexion);
		return $res;
	}

	function select_most_visited(){
		$sql = "SELECT te.*, c.name_city
				FROM terra_events te
				JOIN cities c ON te.id_city = c.id_city
				ORDER BY te.visits DESC
				LIMIT 4";
		$conexion = connect::con();
		$stmt = $conexion->prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		connect::close($conexion);
		return $res;
	}	
}