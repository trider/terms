<?php
$TERM = $_REQUEST['TERM'];
$con = mysql_connect("localhost","wikiuser","wikiuser");
  if (!$con)
    {
      die('Could not connect: ' . mysql_error());
    }

mysql_select_db("wikidb", $con);


if ($TERM==NULL)
  {
    GetTerms("", $con);
    mysql_close($con);
  }
  
else
  {
    GetTerms($TERM, $con);
    mysql_close($con);
  }
  

function GetTerms($MyTerm, $MyCon)
{
    
    $MyTerm=strtolower(str_replace(' ', '_', $MyTerm));
   
    $result = mysql_query("SELECT REPLACE(page_title, '_', ' ' ) 
        'Title', CONCAT( 'http://localhost/wiki/dic/index.php?title=TERM:', page_title ) 'URL'
        FROM page WHERE page_namespace =117
        AND LOWER(page_title) like '%".$MyTerm."%'");

    while($row = mysql_fetch_array($result))
    {
	   echo '<option value="'.$row['Title'].'">'.$row['Title'].'</option>';
    }
    

}



?>
