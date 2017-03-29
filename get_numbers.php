<?php
require_once('db.php');
$sql = "SELECT speakers.id, speakers.topic, period, COUNT(students.speaker) as studentCount FROM students JOIN speakers ON speakers.id = students.speaker GROUP BY topic, period;";
$result = mysqli_query($conn,$sql);
$output_array = array();
while($row = mysqli_fetch_assoc($result)){
	$output_array[] = $row;
}
echo json_encode($output_array);
mysqli_close($conn);
?>