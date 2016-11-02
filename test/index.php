<?php
$string = file_get_contents("data.json");
$json_a = json_decode($string, true);
print_r($json_a[lastmodified]);
?>