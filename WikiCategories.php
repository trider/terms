<?php
$CAT = $_REQUEST['CAT'];
$con = mysql_connect("localhost","wikiuser","wikiuser");
  if (!$con)
    {
      die('Could not connect: ' . mysql_error());
    }

mysql_select_db("wikidb", $con);


if ($CAT==NULL)
  {
    GeCategories("", $con);
    mysql_close($con);
  }
  
else
  {
    GeCategories($CAT, $con);
    mysql_close($con);
  }
  

function GeCategories($CAT, $MyCon)
{
   
    $result = mysql_query("SELECT cat_title, REPLACE(cat_title, '_', ' ' )Title FROM category");

    while($row = mysql_fetch_array($result))
    {
	   echo '<option value="'.$row['cat_title'].'">'.$row['Title'].'</option>';
    }
    

}



?>
