<?php 

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Class Ion Auth Model
 * @property Bcrypt $bcrypt The Bcrypt library
 * @property Ion_auth $ion_auth The Ion_auth library
 */
class Welcome_modal extends CI_Model
{
    public function __construct()
	{

    }

    function get_basic_info()
    {
        $x =  select_all("*","masterinfo","","");
        if(!$x)
        {
            return $x;
        }
        $arr = array();
        foreach ($x as $row) {
            $arr[$row['name']] = $row['value'];
        }

        return $arr;
    
    }

}

?>