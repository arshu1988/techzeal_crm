<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Class Auth
 * @property Ion_auth|Ion_auth_model $ion_auth        The ION Auth spark
 * @property CI_Form_validation      $form_validation The form validation library
 */
class Cron_jobs extends CI_Controller
{
	public $data = [];
    public $response = array('status'=>0,'message'=>'Invalid Input','data'=>null);
	public function __construct()
	{
        parent::__construct();
        //$this->load->model('admin_modal');
		$this->load->library('email');
    }
    
    private function reset_respo()
    {
        $this->response = array('status'=>0,'message'=>'Invalid Input','data'=>null);
    }
	
	public function web_stats()
	{
	
			$this->email->from('update@teczealsolutions.com', 'Web Stats');
			$this->email->to('arshu1988@gmail.com');

			$this->email->subject('Email Test');
			$this->email->message('Testing the email class.');
			echo "mail sent";
			return;
				//website url
			$siteURL = "http://www.codexworld.com/";

			//call Google PageSpeed Insights API
			$googlePagespeedData = file_get_contents("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=$siteURL&screenshot=true");

			//decode json data
			$googlePagespeedData = json_decode($googlePagespeedData, true);

			//screenshot data
			$screenshot = $googlePagespeedData['screenshot']['data'];
			$screenshot = str_replace(array('_','-'),array('/','+'),$screenshot); 

			//display screenshot image
			echo "<img src=\"data:image/jpeg;base64,".$screenshot."\" />";
	}
}
?>