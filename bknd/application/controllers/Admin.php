<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Class Auth
 * @property Ion_auth|Ion_auth_model $ion_auth        The ION Auth spark
 * @property CI_Form_validation      $form_validation The form validation library
 */
class Admin extends CI_Controller
{
	public $data = [];
    public $response = array('status'=>0,'message'=>'Invalid Input','data'=>null);
	public function __construct()
	{
        parent::__construct();
        $this->load->model('admin_modal');
    }
    
    private function reset_respo()
    {
        $this->response = array('status'=>0,'message'=>'Invalid Input','data'=>null);
    }
    function get_customer_list()
    {
        $res = array(
            'status'=>1,
            'data'=>''
        );

        $res['data'] = $this->admin_modal->get_customer_list('view');
        tz_response($res);
    }

    function get_po_list()
    {
        $this->reset_respo();
        $this->response['data'] = $this->admin_modal->get_po_list('view');
        $this->response['status'] = 1;
        unset($this->response['message']);
        tz_response($this->response);

    }

    function process_po()
    {
        $this->reset_respo();
        unset($this->response['data']);
        $req_type = $this->input->post('req_type');
        $po_id = $this->input->post('po_id');
        $result = $this->admin_modal->process_po($req_type,$po_id);
        if($result)
        {
            $this->response['status'] =1;
            $this->response['message'] ="PO Processed Successfully";
            unset($this->response['data']);
        }
        tz_response($this->response);
    }
    function add_customer()
    {
        $res = array(
            'status'=>0,
            'message'=>'Invalid Data Supplied'
        );
        $name = $this->input->post('tz_name');
        $address = $this->input->post('tz_address');
        $gst = $this->input->post('tz_gst_number');
        $email = $this->input->post('tz_email');
        $contact = $this->input->post('tz_contact');
        if($name&&$address&&$gst&&$email&&$contact)
        {
            $data = array();
            $data['name'] = $name;
            $data['address'] = $address;
            $data['gst_number'] = $gst;
            $data['email_address'] = $email;
            $data['contact'] = $contact;
            $res = $this->admin_modal->save_customer($data);
        }

        tz_response($res);
    }

    function add_po()
    {
        
        $rsult = false;
        $tz_cust_name = $this->input->post('tz_cust_name');
        $tz_po_date = $this->input->post('tz_po_date_');
        $tz_po_number = $this->input->post('tz_po_number');
        if(isset($_FILES['tz_po_file'])&&$tz_cust_name&&$tz_po_date&&$tz_po_number)
        {
            $new_name =  time();
            $file_name = $_FILES['tz_po_file']['tmp_name'];
            $filename = $_FILES['tz_po_file']['name'];
            $ext = ".".pathinfo($filename, PATHINFO_EXTENSION);
            $res = move_uploaded_file($file_name,FCPATH.'uploads/po/'.$new_name.$ext);
         
            if($res)
            {
                $data['customer_id']  = $tz_cust_name;
                $data['po_date']  = $tz_po_date;
                $data['po_number']  = $tz_po_number;
                $data['po_document']  = $new_name.$ext;
                $rsult = $this->admin_modal->save_po($data);
            }
        }

        if($rsult)
        {
            $this->response['status'] = 1;
            $this->response['message'] = 'PO Created Successfuly';
        }

        tz_response($this->response);
        
    }

    //Get Customer Information
    function customer_info()
    {
        $cust_id = $this->input->post('cust_id');
        if(!$cust_id)
        {
            tz_response($this->response);
            return;   
        }

     $this->response['status']=1;
     $this->response['cust_info']=$this->admin_modal->customer_info($cust_id);
     tz_response($this->response);
    }

    //Get New Invoice NO
    function get_new_invoiceno()
    {
        $invouce_no = $this->admin_modal->get_new_invoice_no();
        $this->response['status']=1;
        $this->response['invoice']=$invouce_no;
        tz_response($this->response);
    }
}
?>