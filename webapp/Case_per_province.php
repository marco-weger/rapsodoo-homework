<?php


class Case_per_province
{
    public $dateObject;
    public $values;

    function __construct($date, $values = [])
    {
        $dateObject = DateTime::createFromFormat('Y-m-d', $date);
        if (!($dateObject && $dateObject->format('Y-m-d') === $date))
        {
            throw new InvalidArgumentException("Ivalid date value ({$date})");
        }

        $this->dateObject = $dateObject;
        $this->values = $values;
    }

    public function __destruct()
    {
        $this->covid19 = null;
    }
    public static function getLatestGroupedByRegion(): Case_per_province
    {
        require_once "DataBase.php";
        $db = new DataBase();

        $qry = "SELECT DATE(MAX(timestamp)) timestamp FROM cases_per_province;";
        $stmt = $db->getCovid19()->prepare($qry);
        $stmt->execute([]);

        $data = $stmt->fetchAll();
        $timestamp = $data[0]['timestamp'];

        $qry = "SELECT name, SUM(total_cases) total_cases
                FROM cases_per_province
                    LEFT OUTER JOIN regions ON region_id = regions.id
                WHERE DATE(timestamp) = :timestamp
                GROUP BY name
                ORDER BY SUM(total_cases) DESC, name ASC";
        $stmt = $db->getCovid19()->prepare($qry);
        $stmt->execute([
            'timestamp' => $timestamp
        ]);

        $data = $stmt->fetchAll();
        $values = [];
        foreach ($data as $row)
        {
            $values[$row['name']] = intval($row['total_cases']);
        }
        return new Case_per_province($timestamp, $values);
    }

    public static function getByDateGroupedByRegion($date): ?array
    {
        require_once "DataBase.php";

        $db = new DataBase();

        $qry = "INSERT INTO gstord (IDDATE_DD, IDDATE_MM, IDDATE_YYYY, IDTIME,
                    IDCOM, COMDESC, DEST, DIAM, TICK, LENG, N_PC_SV, N_PC_EV, TYPE_CIC, TYPE_MAT, STAT, ID_FILE)
                VALUES (DAY(NOW()), MONTH(NOW()), YEAR(NOW()), CONCAT(HOUR(NOW()),':',MINUTE(NOW())),
                        :IDCOM, :COMDESC, '', :DIAM, :TICK, :LENG, :N_PC_SV, :N_PC_EV, 1, 0, 2, 0)";

        $stmt = $db->getTagliamandrini()->prepare($qry);

        // TODO controllare se è ok
        if (isset($quantity) && $stmt->execute([
                'IDCOM' => $id,
                'COMDESC' => $band,
                'DIAM' => floatval($mandrel['DIAMETER']),   // float
                'TICK' => floatval($mandrel['THICKNESS']),  // float
                'LENG' => $length,                          // float
                'N_PC_SV' => $quantity,
                'N_PC_EV' => 0,
            ])) {
            $qry = "INSERT INTO M_TAGLIAMANDRINI_JOB (ID, FASCIA, ARTICOLO, LOTTO, START_USERNAME, START_COUNTER)
                    VALUES (:ID, :FASCIA, :ARTICOLO1, 
                            (SELECT LOTTO FROM MANDRINI_LOTTI WHERE TIMESTAMP_CHIUSURA IS NULL AND MANDRINI_LOTTI.ARTICOLO = :ARTICOLO2), 
                            :START_USERNAME, (SELECT ATTUALE FROM CONTATORI_TAGLIAMANDRINI))";

            $stmt = $db->getFabDynamics()->prepare($qry);

            return $stmt->execute([
                'ID' => $id,
                'FASCIA' => $band,
                'ARTICOLO1' => $mandrel['MANDREL'],
                'ARTICOLO2' => $mandrel['MANDREL'],
                'START_USERNAME' => strtoupper($username)
            ]);
        }
        return false;
    }
}