<?php
	$uploaddir = '../backoffice/js/tempimg/';
	$uploadfile = $uploaddir.basename($_FILES['userfile']['name']);
	echo '<pre>';
	if(move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)){
		$command = 'node ../backoffice/js/run.js';
		echo "Fichier t�l�charg�\n";
	} else {
		echo "Erreur de t�l�chargement.";
	}
	echo '</pre>';

?>