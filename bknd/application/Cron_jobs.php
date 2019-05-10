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
        $this->load->model('Cron_modal');
		$this->load->library('email');
		date_default_timezone_set('Asia/Kolkata');
    }
    
	
	public function web_stats()
	{
	
	$list = $this->Cron_modal->get_urls_list();
	foreach($list as $row)
	{
		$this->update_stats_db($row->url);
	}
	
	
	
			$this->email->from('arshu1988@techzealsolutions.com', 'Web Stats');
		//	$this->email->from('arshu1988@gmail.com', 'Web Stats');
			$this->email->to('arshu1988@gmail.com');

			$this->email->subject('Daily Website updates');
			
			$this->email->set_mailtype('html');
			//display screenshot image
			//echo "<img src=\"data:image/jpeg;base64,".$screenshot."\" />";
			//$this->email->message('Testing the email class.');
			$message = $this->get_html();
			$message = "<a href=".base_url('cron_jobs/view_web_stats').">View Stats</a>".$message;
			$this->email->message($message);
			$this->email->send();
			
	}
	private function update_stats_db($url)
	{
			
			//initlize blanks
			$response_code = '404';
			$screenshot = array();
			$web_title = '404 Not Found';
			$speed_score = 0;
			//timestamp 
			$timestamp_cur = date('Y-m-d H:i:s');
			
			
			
			//start fetching data
			//$googlePagespeedData = file_get_contents("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=$url&screenshot=true");
			$googlePagespeedData = $this->get_curl_info($url);
			
			//decode json data
			$googlePagespeedData = json_decode($googlePagespeedData, true);
			//screenshot data
			if(!isset($googlePagespeedData['screenshot']))
			{
			goto save_blank;	
			}
			$screenshot = $googlePagespeedData['screenshot'];
			$screenshot['data'] = str_replace(array('_','-'),array('/','+'),$screenshot['data']); 
			//Response_code
			$response_code =$googlePagespeedData['responseCode'];
			
			//Speed Score 
			$speed_score = $googlePagespeedData['ruleGroups']['SPEED']['score'];
			
			//Title
			$web_title =$googlePagespeedData['title'];
			
			
			
			save_blank:
			$data = array();
			$data = array(
				'last_accessed'=>$timestamp_cur,
				'response_code'=>$response_code,
				'speed_score'=>$speed_score,
				'title'=>$web_title,
				'screenshot'=>serialize($screenshot)
			);
			
			$this->db->where('url', $url);
			$this->db->update('website_stats', $data);
	}
	private function get_html($image=false)
	{
		//Start of Data Fetch
		$list = $this->Cron_modal->get_urls_stats($image);
		
	$message = '<html><body>';
	$message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
	$message .= "<tr style='background: #eee;'>";
		$message .= "<td>ID</td>";
		$message .= "<td>Url</td>";
		$message .= "<td>Title</td>";
		$message .= "<td>Last Accessed</td>";
		$message .= "<td>Response Code</td>";
		$message .= "<td>Speed Score</td>";
		if($image)
		{
			$message .= "<td>Image</td>";
		}
	$message .= "</tr>";
	
		foreach($list as $row)
		{
		$bg = ($row->response_code=='200')? 'white': 'red';
		$last_accessed = date('d-M-Y H:i:s',strtotime($row->last_accessed));
		$message .= "<tr style='background: $bg;'>";
			$message .= "<td>$row->id</td>";
			$message .= "<td>$row->url</td>";
			$message .= "<td>$row->title</td>";
			$message .= "<td>$last_accessed</td>";
			$message .= "<td>$row->response_code</td>";
			$message .= "<td>$row->speed_score</td>";
				if($image)
			{
				$screenshot =unserialize($row->screenshot);
				if(isset($screenshot['data']))
				{
			$screenshot = $screenshot['data'];
				$message .= "<td><img src=\"data:image/jpeg;base64,".$screenshot."\"/></td>";
					}
					else
						
						{
						
				$message .= "<td>Error</td>";
							}
				
			}
		$message .= "</tr>";		
		}
	$message .= "</table>";
	$message .= "</body></html>";
	return $message;
	
	}
	
	private function get_curl_info($url_)
	{
	
		$handle = curl_init();
 
			$url = "https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=$url_&screenshot=true";

			// Set the url
			curl_setopt($handle, CURLOPT_URL, $url);
			// Set the result output to be a string.
			curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

			$output = curl_exec($handle);

			curl_close($handle);

			return $output;
		}
	
	
	public function view_web_stats()
	{
		echo $this->get_html(true);
	}
}
?>