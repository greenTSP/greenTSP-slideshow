<?php
	$uploaddir = '../backoffice/js/tempimg/';
	$uploadfile = $uploaddir.basename($_FILES['userfile']['name']);
	echo '<pre>';
	if(move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)){
		$command = 'node ../backoffice/js/run.js';
		echo "Fichier téléchargé\n";
	} else {
		echo "Erreur de téléchargement.";
	}
	echo '</pre>';

?>