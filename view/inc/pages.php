<?php
if(isset($_GET['page'])){

	switch($_GET['page']){
		
		case "controller_home":
			include("module/home/controller/".$_GET['page'].".php");
			break;
		case "controller_shop":
			include("module/shop/controller/".$_GET['page'].".php");
			break;
		case "controller_auth":
			include("module/auth/controller/".$_GET['page'].".php");
			break;
		case "404":
			include("view/inc/error".$_GET['page'].".php");
			break;
		case "503":
			include("view/inc/error".$_GET['page'].".php");
			break;
		default:
			header('Location: index.php?page=controller_home&op=view');
			exit();
		break;
	}
} else {
	 header('Location: index.php?page=controller_home&op=view');
	exit();
}
?>