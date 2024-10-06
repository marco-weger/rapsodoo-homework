<?php
class DataBase
{
    private $covid19;

    function __construct()
    {
        $this->covid19 = null;
    }

    public function __destruct()
    {
        $this->covid19 = null;
    }

    function getCovid19(): PDO
    {
        if(is_null($this->covid19))
        {
            $_conn = 'mysql:host=localhost;dbname=covid19';
            $_user = 'root';
            $_pass = '';
            try
            {
                $this->covid19 = new PDO(
                    $_conn,
                    $_user,
                    $_pass
                );
            }
            catch(PDOException  $ex)
            {
                die("Can't reach 'covid19' databse!");
            }
        }
        return $this->covid19;
    }
}