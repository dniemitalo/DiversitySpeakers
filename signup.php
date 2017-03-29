<?php
require_once('db.php');
$first = mysqli_real_escape_string($conn,$_POST['first']);
$last = mysqli_real_escape_string($conn,$_POST['last']);
$teacher = mysqli_real_escape_string($conn,$_POST['teacher']);
$periodA = $_POST['periodA'];
$speakerA = $_POST['speakerA'];
$periodB = $_POST['periodB'];
$speakerB = $_POST['speakerB'];

//Check if session A has availability
$rowA = NULL; //result row
$rowB = NULL; //result row
$spaceA = FALSE; //Is space available in period A
$spaceB = FALSE; //Is space available in period B

$sql = "SELECT COUNT(speaker) FROM students WHERE period=$periodA AND speaker=$speakerA";
if ($resultA=mysqli_query($conn,$sql)){
	$rowA = mysqli_fetch_array($resultA);
	if ($rowA[0]<28){ $spaceA = TRUE; }
}
else{echo mysqli_error($conn);}

$sql = "SELECT COUNT(speaker) FROM students WHERE period=$periodB AND speaker=$speakerB";
if($result=mysqli_query($conn,$sql)){
	$rowB = mysqli_fetch_array($result);
	if($rowB[0]<28){ $spaceB = TRUE; }	
}
else{echo mysqli_error($conn);}

if($spaceA && $spaceB){
	$sql = "INSERT INTO students (first, last, teacher, period, speaker) 
		VALUES ('$first','$last','$teacher',$periodA,$speakerA)";
	if(mysqli_query($conn,$sql)){
		echo "Successfully registered for period $periodA session.<br>";
	}
	else{
		echo "The database had a problem. Please register again.<br>";
	}

	//Period B signup
	$sql = "INSERT INTO students (first, last, teacher, period, speaker) 
		VALUES ('$first','$last','$teacher',$periodB,$speakerB)";
	if(mysqli_query($conn,$sql)){
		echo "Successfully registered for period $periodB session.<br>";
	}
	else{
		echo "The database had a problem. Please register again.<br>";
	}
}
	
else{
	echo "One or more of your sessions has filled. Please choose again.";
}

mysqli_close($conn);
?>