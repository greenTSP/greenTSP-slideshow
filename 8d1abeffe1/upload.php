<?php
	$uploaddir = '/var/www/backoffice/js/tempimg/';
	$uploadfile = $uploaddir.basename($_FILES['image']['name']);
	echo '<pre>';
	if(move_uploaded_file($_FILES['image']['tmp_name'], $uploadfile)){
		$command = 'node /var/www/backoffice/js/runUpload.js';
		exec($command, $out);
		echo "Fichier téléchargé\n";
		var_dump($out);
	} else {
		echo "Erreur de téléchargement.";
	}
	echo '</pre>';

?>