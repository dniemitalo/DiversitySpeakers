<?php
require_once('db.php');
$sql = "SELECT students.teacher, first, last, period, topic, room FROM students JOIN speakers ON students.speaker = speakers.id";
$result = mysqli_query($conn,$sql);
$filename = 'diversity_speakers.csv';
$f = fopen('php://memory', 'w'); 
$field_list=array('First Name','Last Name','Teacher','Period','Topic');
fputcsv($f, $field_list);
while ($row=mysqli_fetch_assoc($result)){
	fputcsv($f,$row);
}
fseek($f, 0);
header('Content-Type: application/csv');
header('Content-Disposition: attachment; filename="'.$filename.'";');
fpassthru($f);

mysqli_close($conn);
?>

