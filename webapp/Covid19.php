<?php
class Covid19
{
    const LINK_LATEST = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/refs/heads/master/dati-json/dpc-covid19-ita-province-latest.json";
    const LINK_ALL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/refs/heads/master/dati-json/dpc-covid19-ita-province.json";
    public static function updateLatest()
    {
        $jsonString = file_get_contents(self::LINK_LATEST);
        $data = json_decode($jsonString);

        if ($data === null && json_last_error() !== JSON_ERROR_NONE)
        {
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

            foreach ($data as $row)
            {
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

        if ($data === null && json_last_error() !== JSON_ERROR_NONE)
        {
            die("Can't read COVID-19 data: " . json_last_error_msg());
        }
        else
        {
            $upperBound = count($data);
            $lowerBound = 0;
            $i = intval($upperBound/2);
            while (true)
            {
                $currentDateObject = DateTime::createFromFormat('Y-m-d\TH:i:s', $data[$i]->data);

                if($currentDateObject->format('Y-m-d') == $dateObject->format('Y-m-d'))
                {
                    $index = $i;
                    break;
                }
                elseif($upperBound - $lowerBound < 2)
                {
                    // no data for selected date
                    return;
                }

                if($currentDateObject->format('Y-m-d') > $dateObject->format('Y-m-d'))
                {
                    // before
                    $upperBound = $i;
                }
                else
                {
                    // after
                    $lowerBound = $i;
                }
                $i = intval(($upperBound+$lowerBound)/2);
            }

            require_once "DataBase.php";
            $db = new DataBase();
            $qry = "INSERT INTO cases_per_province (timestamp, region_id, province_id, total_cases)
                        VALUES (:timestamp,:region_id,:province_id,:total_cases)
                        ON DUPLICATE KEY UPDATE total_cases = VALUES(total_cases)";
            $stmt = $db->getCovid19()->prepare($qry);

            $i = 1;
            do
            {
                $currentDateObjectAfter = DateTime::createFromFormat('Y-m-d\TH:i:s', $data[$index+$i]->data);
                $currentDateObjectBefore = DateTime::createFromFormat('Y-m-d\TH:i:s', $data[$index-$i]->data);
                if($currentDateObjectAfter->format('Y-m-d') == $dateObject->format('Y-m-d'))
                {
                    $stmt->execute([
                        'timestamp' => $data[$index+$i]->data,
                        'region_id' => utf8_encode($data[$index+$i]->codice_regione),
                        'province_id' => utf8_encode($data[$index+$i]->codice_provincia),
                        'total_cases' => intval($data[$index+$i]->totale_casi),
                    ]);
                }
                if($currentDateObjectBefore->format('Y-m-d') == $dateObject->format('Y-m-d'))
                {
                    $stmt->execute([
                        'timestamp' => $data[$index-$i]->data,
                        'region_id' => utf8_encode($data[$index-$i]->codice_regione),
                        'province_id' => utf8_encode($data[$index-$i]->codice_provincia),
                        'total_cases' => intval($data[$index-$i]->totale_casi),
                    ]);
                }
                $i += 1;
            }
            while ($currentDateObjectAfter->format('Y-m-d') == $dateObject->format('Y-m-d') ||
                $currentDateObjectBefore->format('Y-m-d') == $dateObject->format('Y-m-d'));
        }
    }
}