<?php
if(isset($_POST['filterType']) && isset($_POST['date']))
{
    require_once "Case_per_province.php";
    if($_POST['filterType'] === 'latest')
    {
        $rows = Case_per_province::getLatestGroupedByRegion();
        $fileName = 'COVID-19 per-province - LATEST';
    }
    else if(strlen($_POST['date']) > 0)
    {
        $rows = Case_per_province::getByDateGroupedByRegion($_POST['date']);
        $fileName = 'COVID-19 per-province - ' . $_POST['date'];
    }
    else
    {
        die("Can't get parameters to export");
    }

    $excelRows = [['<b>Regione</b>', '<b>Casi totali</b>']];
    foreach ($rows->values as $key => $value) {
        $excelRows[] = [$key, $value];
    }

    require_once 'vendor/autoload.php';
    $xlsx = Shuchkin\SimpleXLSXGen::fromArray($excelRows);
    $xlsx->downloadAs($fileName . '.xlsx');
}
?>