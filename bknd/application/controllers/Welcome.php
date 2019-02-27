<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */


	function __construct() {
        parent::__construct();
         $this->load->model("Welcome_modal");
	}
	

	public function index()
	{
		$this->load->view('welcome_message');
	}

	public function get_basic_info()
	{
		$response = array('status'=>0);
		$dt = $this->Welcome_modal->get_basic_info();
		
		if($dt)
		{
			$response['status'] =1;
			$response['data'] =$dt;
		}
		$this->output
						->set_status_header(200)
						->set_content_type('application/json', 'utf-8')
						->set_output(json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES))
						->_display();
				exit;
	}
}
