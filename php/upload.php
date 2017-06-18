<?php
$output_dir = "../uploads/";
$newFileName = time().'.jpg';
//$target_file = $output_dir . basename($_FILES["myfile"]["name"]);
$target_file = $output_dir . $newFileName;

if(isset($_FILES["myfile"]))
{
	//Filter the file types , if you want.
	if ($_FILES["myfile"]["error"] > 0)
	{
	  echo "Error: " . $_FILES["file"]["error"] . "<br>";
	}
	else
	{
		
		//move the uploaded file to uploads folder;
    	move_uploaded_file($_FILES["myfile"]["tmp_name"], $target_file);
		
		//echo json_encode($_FILES["myfile"]); //for log purpose, please comment it and see log in response section in browser.


		//This echo is for printing the filename,Becasue the filename is created dynamically here. So the client side script will read the file name whihc should be passed from here. 
		//This echo is important.
    	echo $newFileName;
	}

}
?>