<?php

class Covid19
{
    const LINK_LATEST = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/refs/heads/master/dati-json/dpc-covid19-ita-province-latest.json";
    const LINK_ALL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/refs/heads/master/dati-json/dpc-covid19-ita-province.json";
    public static function updateLatest()
    {
        $jsonString = file_get_contents(self::LINK_LATEST);
        $data = json_decode($jsonString);

        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            die("Can't read COVID-19 data: " . json_last_error_msg());
        }
        else
        {
            require_once "DataBase.php";
            $db = new DataBase();
            $qry = "INSERT INTO cases_per_province (timestamp, region_id, province_id, total_cases)
                        VALUES (:timestamp,:region_id,:province_id,:total_cases)
                        ON DUPLICATE KEY UPDATE total_cases = VALUES(total_cases)";
            $stmt = $db->getCovid19()->prepare($qry);

            foreach ($data as $row) {
                $stmt->execute([
                    'timestamp' => $row->data,
                    'region_id' => utf8_encode($row->codice_regione),
                    'province_id' => utf8_encode($row->codice_provincia),
                    'total_cases' => intval($row->totale_casi),
                ]);
            }
        }
    }
    public static function updateByDate($date)
    {
        $dateObject = DateTime::createFromFormat('Y-m-d', $date);
        if (!($dateObject && $dateObject->format('Y-m-d') === $date))
        {
            die("Ivalid date value ({$date})");
        }

        $jsonString = file_get_contents(self::LINK_ALL);
        $data = json_decode($jsonString);

        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            die("Can't read COVID-19 data: " . json_last_error_msg());
        }
        else
        {
            // TODO
            var_dump($data);
            $data = array_filter(
                $data,
                function($row) {
                    echo $row->data;
                    $dateObject = DateTime::createFromFormat('Y-m-d', $row->data);
                    if ($dateObject && $dateObject->format('Y-m-d') === $row->data)
                    {
                        echo $dateObject->format('Y-m-d');
                        echo "<hr>";
                        return true;
                    }
                    echo "<hr>";
                    return false; //$row['age'] > 25;
                }
            );

//            require_once "DataBase.php";
//            $db = new DataBase();
//            $qry = "INSERT INTO cases_per_province (timestamp, region_id, province_id, total_cases)
//                        VALUES (:timestamp,:region_id,:province_id,:total_cases)
//                        ON DUPLICATE KEY UPDATE total_cases = VALUES(total_cases)";
//            $stmt = $db->getCovid19()->prepare($qry);
//
//            foreach ($data as $row) {
//                $stmt->execute([
//                    'timestamp' => $row->data,
//                    'region_id' => utf8_encode($row->codice_regione),
//                    'province_id' => utf8_encode($row->codice_provincia),
//                    'total_cases' => intval($row->totale_casi),
//                ]);
//            }
        }
    }
}