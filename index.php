<?php
    if ((isset($_GET['page'])) && ($_GET['page']==="controller_home") ){
		include("view/inc/top_page_home.html");
	}else{
		include("view/inc/top_page.html");
	}

	if ((isset($_GET['page'])) && ($_GET['page']==="controller_shop") ){
		include("view/inc/top_page_shop.html");
	}else{
		include("view/inc/top_page.html");
	}
	session_start();
?>
<div id="wrapper">		
    <div id="header">    	
    	<?php
    	    include("view/inc/header.html");
    	?>        
    </div>  
    <div id="menu">
		<?php
		    include("view/inc/menu.php");
		?>
    </div>	
    <div id="">
    	<?php 
		    include("view/inc/pages.php"); 
		?>        
        <br style="clear:both;" />
    </div>
    <div id="footer">   	   
	    <?php
	        include("view/inc/footer.html");
	    ?>        
    </div>
</div>
<?php
    include("view/inc/bottom_page.html");
?>
    