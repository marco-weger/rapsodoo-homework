<?php
require_once "Covid19.php";
require_once "Case_per_province.php";
//Covid19::updateByDate('2024-10-02');
echo json_encode(Case_per_province::getByDateGroupedByRegion('2024-10-02'));
?>
sdfdsffs
