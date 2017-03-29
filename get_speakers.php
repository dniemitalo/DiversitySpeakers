<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

require_once('db.php');
$sql = "SELECT * FROM speakers";
$result = mysqli_query($conn,$sql);
$output_array = array();
while($row = mysqli_fetch_assoc($result)){
	$output_array[] = $row;
}
echo json_encode($output_array);
mysqli_close($conn);
?>