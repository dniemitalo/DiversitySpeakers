<?php
require_once 'db.php';

$teacher = mysqli_real_escape_string($conn,$_GET['teacher']);
$room = mysqli_real_escape_string($conn,$_GET['room']);
$topic = mysqli_real_escape_string($conn,$_GET['topic']);
$facilitators = mysqli_real_escape_string($conn,$_GET['facilitators']);
$sql = "INSERT INTO speakers (teacher, room, topic, facilitators) VALUES ('$teacher','$room','$topic','$facilitators')";

if(mysqli_query($conn, $sql)){
echo "Speaker saved successfully.";
} else{
echo "<br>Error:<br>".mysqli_error($conn);
}
mysqli_close($conn);
?>