<?php
$servername = "localhost";
$username = "root";
$password = "root";
$mydb = "test";
$link = mysqli_connect("localhost:3306", "root", "root", $mydb);

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    exit;
}

$sql = "SELECT * FROM ".$mydb.".pledgebook";
$result = $link->query($sql);

$stack = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        array_push($stack, $row);
    }
} else {
    //echo "empty";
}

echo json_encode($stack);
mysqli_close($link);

?>