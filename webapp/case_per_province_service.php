<?php
if(isset($_GET['type']))
{
    if(strcmp($_GET['type'],'GetLatest') == 0)
    {
        require_once "Covid19.php";
        require_once "Case_per_province.php";
        Covid19::updateLatest();
        echo json_encode(Case_per_province::getLatestGroupedByRegion());
    }
    else if(strcmp($_GET['type'],'GetByDate') == 0)
    {
        require_once "Covid19.php";
        require_once "Case_per_province.php";
        Covid19::updateByDate($_GET['date']);
        echo json_encode(Case_per_province::getByDateGroupedByRegion($_GET['date']));
    }
}
?>