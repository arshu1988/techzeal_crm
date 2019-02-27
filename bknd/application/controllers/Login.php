<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

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

			function __construct()
		{
			parent::__construct();
			$this->load->library('ion_auth');
		}

	public function index()
	{
		$this->load->view('welcome_message');
	}

	public function check()
	{ 
		$id = 1;
    	/*$data = array(
          'first_name' => 'Ahtsham Uddin',
          'last_name' => 'Shaikha',
          'password' => 'admin',
		   );
		   
		$this->ion_auth->update($id, $data);
	*/
		$username = $this->input->post('username');
		$password  = $this->input->post('password');
	
		$response = array('status' => '1');
		if($username&&$password)
		{
			$result = $this->ion_auth->login($username, $password,false);
			if($result)
			{
				$response['data'] = $this->ion_auth->user()->row();
				$group = $this->ion_auth->get_users_groups()->result_array();
				$response['data']->user_group = $group ;
				$response['message'] = "User Authorized";
			}
			else
			{
				$response['status'] = "0";
				$response['message'] = "User UnAuthorized";
			}
		}
		else
		{
			$response['status'] ='0';
				
		}
		
		$this->output
						->set_status_header(200)
						->set_content_type('application/json', 'utf-8')
						->set_output(json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES))
						->_display();
				exit;
	}
}
