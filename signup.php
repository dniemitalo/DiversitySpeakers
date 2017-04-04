<?php
require_once('db.php');
$first = trim(mysqli_real_escape_string($conn,$_POST['first']));
$last = trim(mysqli_real_escape_string($conn,$_POST['last']));
$teacher = mysqli_real_escape_string($conn,$_POST['teacher']);
$periodA = $_POST['periodA'];
$speakerA = $_POST['speakerA'];
$periodB = $_POST['periodB'];
$speakerB = $_POST['speakerB'];
$skinny = $_POST['skinny'];

//Variables to prepare to check if space available
$rowA = NULL; //result row
$rowB = NULL; //result row
$spaceA = FALSE; //Is space available in period A
$spaceB = FALSE; //Is space available in period B

if($skinny != 8){
	//Look up period 7

	//Check if session A has availability
	$sql = "SELECT COUNT(speaker) FROM students WHERE period=$periodA AND speaker=$speakerA";
	if ($resultA=mysqli_query($conn,$sql)){
		$rowA = mysqli_fetch_array($resultA);
		if ($rowA[0]<28){ $spaceA = TRUE; }
	}
	else{echo mysqli_error($conn);}




} else{$spaceA = TRUE;}

if ($skinny != 7){
	//look up period 8


	//Check if session B has availability
	$sql = "SELECT COUNT(speaker) FROM students WHERE period=$periodB AND speaker=$speakerB";
	if($result=mysqli_query($conn,$sql)){
		$rowB = mysqli_fetch_array($result);
		if($rowB[0]<28){ $spaceB = TRUE; }	
	}
	else{echo mysqli_error($conn);}

} else{$spaceB= TRUE;}


if($spaceA && $spaceB){

	//If space was available, check if this combination of first/last/teacher already exists
	$first_lower = trim(strtolower($first));
	$last_lower = trim(strtolower($last));
	$sql ="SELECT id, period FROM students WHERE LOWER(first)='$first_lower' AND LOWER(last)='$last_lower' AND teacher='$teacher' ORDER BY period";
	if($result = mysqli_query($conn,$sql)){
		//$row = mysqli_fetch_array($result)
		if(mysqli_num_rows($result)>0){
			// echo "Duplicate(s) found.<br>";
			$row1 = mysqli_fetch_assoc($result);
			$prev_idA = $row1['id'];
			// echo "Previous ID A: $prev_idA<br>";
			if($row2 = mysqli_fetch_assoc($result)){
				$prev_idB = $row2['id'];
				// echo "Previous ID B: $prev_idB<br>";
			} else if($skinny==8){
				$prev_idB = $row1['id'];
			} else{
				$prev_idB = 0;
				// echo "No previous ID B<br>";
			}
			//*********Update existing record**************
			//Period A signup
			if ($skinny != 8){
				$sql = "REPLACE INTO students (id, first, last, teacher, period, speaker) 
					VALUES ($prev_idA,'$first','$last','$teacher',$periodA,$speakerA)";
				if(mysqli_query($conn,$sql)){
					echo "Successfully updated registration for period $periodA session.<br>";
				}
				else{
					echo "The database had a problem. Please register again.<br>";
				}
			}
			//Period B signup
			if ($skinny != 7){		
				if($prev_idB > 0){
					$sql = "REPLACE INTO students (id, first, last, teacher, period, speaker) 
						VALUES ($prev_idB,'$first','$last','$teacher',$periodB,$speakerB)";
				}
				else {
					$sql = "INSERT INTO students (first, last, teacher, period, speaker) 
					VALUES ('$first','$last','$teacher',$periodB,$speakerB)";
				}
				if(mysqli_query($conn,$sql)){
					echo "Successfully updated registration for period $periodB session.<br>";
				}
				else{
					echo "The database had a problem. Please register again.<br>";
				}
			}
		
			//***********Update record end of code******************


		}
		else{
			// echo "No duplicate found.<br>";

			//*********insert record**************
			if ($skinny != 8){
				//Period A signup
				$sql = "INSERT INTO students (first, last, teacher, period, speaker) 
					VALUES ('$first','$last','$teacher',$periodA,$speakerA)";
				if(mysqli_query($conn,$sql)){
					echo "Successfully registered for period $periodA session.<br>";
				}
				else{
					echo "The database had a problem. Please register again.<br>";
				}
			}

			//Period B signup
			if ($skinny != 7){
				$sql = "INSERT INTO students (first, last, teacher, period, speaker) 
					VALUES ('$first','$last','$teacher',$periodB,$speakerB)";
				if(mysqli_query($conn,$sql)){
					echo "Successfully registered for period $periodB session.<br>";
				}
				else{
					echo "The database had a problem. Please register again.<br>";
				}
			}
			//***********Insert record end of code******************


		}
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





	
	
