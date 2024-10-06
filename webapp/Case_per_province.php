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

    public static function getByDateGroupedByRegion($date): Case_per_province
    {
        require_once "DataBase.php";
        $db = new DataBase();

        $qry = "SELECT name, SUM(total_cases) total_cases
                FROM cases_per_province
                    LEFT OUTER JOIN regions ON region_id = regions.id
                WHERE DATE(timestamp) = :timestamp
                GROUP BY name
                ORDER BY SUM(total_cases) DESC, name ASC";
        $stmt = $db->getCovid19()->prepare($qry);
        $stmt->execute([
            'timestamp' => $date
        ]);

        $data = $stmt->fetchAll();
        $values = [];
        foreach ($data as $row)
        {
            $values[$row['name']] = intval($row['total_cases']);
        }
        return new Case_per_province($date, $values);
    }
}