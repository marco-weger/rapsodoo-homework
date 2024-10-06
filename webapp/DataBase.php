<?php


class DataBase
{
    const SEPARATOR = '*~*';
    const BUSINESS_SHARING = '\\\\192.168.100.242\\BusinessDir';
    private $gestionale;
    private $fabdynamics;
    private $taglierine;
    private $gavo;

    function __construct()
    {
        $this->gestionale = null;
        $this->fabdynamics = null;
        $this->bimec1 = [];
        $this->gavo = null;
    }

    /* Destructor */
    public function __destruct()
    {

    }

    function getGestionale(): PDO
    {
        if(is_null($this->gestionale))
        {
            try{
                $mssqldriver = '{SQL Server}';
                //$mssqldriver = '{SQL Server Native Client 11.0}';
                //$mssqldriver = '{ODBC Driver 11 for SQL Server}';

                $hostname='192.168.100.242\NTS';
                $dbname='UNIPACK';
                $username='sa';
                $password='1234567abc!';
                $this->gestionale = new PDO("odbc:Driver=$mssqldriver;
                Server=$hostname;
                Database=$dbname",
                    $username,
                    $password
                );
            }catch(PDOException  $ex){
                exit("GESTIONALE: " . $ex->getMessage());
            }
        }
        return $this->gestionale;
    }

    function getTaglierina($t): PDO
    {
        if(!isset($this->taglierine[$t]))
        {
            $this->taglierine[$t] = null;
        }

        if(is_null($this->taglierine[$t]))
        {
            require_once "Macchina.php";
            $ip = Macchina::getMacchina("TAGLIERINA{$t}")->getIp();
            try{
                $mssqldriver = '{SQL Server}';
                //$mssqldriver = '{SQL Server Native Client 11.0}';
                //$mssqldriver = '{ODBC Driver 11 for SQL Server}';

                $hostname=$ip.'\SQLEXPRESS';
                $dbname='test';
                $username='bimecuser';
                $password='sa01';
                $this->taglierine[$t] = new PDO("odbc:Driver=$mssqldriver;
                Server=$hostname;
                Database=$dbname",
                    $username,
                    $password
                );
            }catch(PDOException  $ex){
                exit("T{$t}: " . $ex->getMessage());
            }
        }
        return $this->taglierine[$t];
    }

    function getFabDynamics(): PDO
    {
        if(is_null($this->fabdynamics)) {
            try {
                $mssqldriver = '{SQL Server}';
                //$mssqldriver = '{SQL Server Native Client 11.0}';
                //$mssqldriver = '{ODBC Driver 11 for SQL Server}';

                $hostname = '192.168.100.243\SQLEXPRESS';
                $dbname = 'FABDYNAMICS';
                $username = 'sa';
                $password = '1234567abc!';
                $this->fabdynamics = new PDO("odbc:Driver=$mssqldriver;
                    Server=$hostname;
                    Database=$dbname",
                    $username,
                    $password
                );
            } catch (PDOException  $ex) {
                exit("FABDYNAMICS: " . $ex->getMessage());
            }
        }
        return $this->fabdynamics;
    }

    function getTagliamandrini(): PDO
    {
        if(is_null($this->gavo))
        {
            $_conn = 'mysql:host=192.168.100.170;dbname=gavo';
            $_user = 'root';
            $_pass = 'mysql';
            try
            {
                $this->gavo = new PDO(
                    $_conn,
                    $_user,
                    $_pass
                );
            }
            catch(PDOException  $ex)
            {
                die("TAGLIAMANDRINI NON RAGGIUNGIBILE!");
            }
        }
        return $this->gavo;
    }

    public static function CRYPT($foo): string
    {
        $secret_key = 'my_simple_secret_key';
        $secret_iv = 'my_simple_secret_iv';

        $output = false;
        $encrypt_method = "AES-256-CBC";
        $key = hash( 'sha256', $secret_key );
        $iv = substr( hash( 'sha256', $secret_iv ), 0, 16 );

        return base64_encode(openssl_encrypt( "ForzaMilanSempre".$foo, $encrypt_method, $key, 0, $iv));
    }

    public static function DECRYPT($foo): string
    {
        $secret_key = 'my_simple_secret_key';
        $secret_iv = 'my_simple_secret_iv';

        $encrypt_method = "AES-256-CBC";
        $key = hash( 'sha256', $secret_key );
        $iv = substr( hash( 'sha256', $secret_iv ), 0, 16 );

        $bar = openssl_decrypt( base64_decode( $foo ), $encrypt_method, $key, 0, $iv );
        return substr($bar,strlen("ForzaMilanSempre"),strlen($bar)-strlen("ForzaMilanSempre"));
    }

    public static function HASH($foo): string
    {
        return hash('sha256', 'ForzaMilanSempre'.$foo);
    }

    public static function getRandomPassword(): string
    {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }
}