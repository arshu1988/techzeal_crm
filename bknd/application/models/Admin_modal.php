<?php

defined('BASEPATH') OR exit('No direct script access allowed');


class Admin_modal extends CI_Model
{
	function __construct()
  {
    parent::__construct(); // construct the Model class
  }

    function save_customer($data)
    {
        if(tz_row_count('customers'," name='".$data['name']."'")>0)
        {
            return array('status'=>0,'message'=>'Customer Already Present!!!!');
        }

        $this->db->insert('customers',$data);
        return array('status'=>1,'message'=>'Customer Saved Sucessfully!!!!');
    }


    function get_customer_list($prose)
    {

        if($prose=='view')
        {
            return select_all('*','customers','','');
        }
    }

    function get_po_list($prose)
    {

        if($prose=='view')
        {
           $this->db->select('po.id,cust.name as cust_name,po.status,po_date,po_number,po_document as download_link');
           $this->db->from('purchase_orders as po');
           $this->db->join('customers as cust','po.customer_id=cust.id');

           $qry = $this->db->get();
           return $qry->result_array();
        }
    }
    
    function save_po($data)
    {
        $this->db->insert('purchase_orders',$data);
        return true;
    }

    function process_po($req_type,$po_id)
    {
        if($req_type=='expire')
        {
            $this->db->set('status', 'expired');
            $this->db->where('id', $po_id);
            $this->db->update('purchase_orders'); 
            return true;
        }
    }

    //Get Customer Information
    function customer_info($cust_id)
    {
     $qry = $this->db->select('*')->where('id='.$cust_id)->get('customers');
     $result = $qry->result_array();
     for($i=0;$i<count($result);$i++)
     {
         $result[$i]['po_list'] = $this->db->select('*')->from('purchase_orders')->where("status='active' and customer_id=".$result[$i]['id'])->get()->result_array();
     }

     return $result;

    }

    //Get New Invoice No
    function get_new_invoice_no()
    {
        $qry = $this->db->select('invoice_no')->order_by('id','DESC')->limit(1)->get('invoice_master');
        $result = $qry->result_array();
        if($result)
        {
            $result = $result[0]['invoice_no'];
            $result = int($result);
            ++$result;
            return $result;
        }
        else
        {
            $result = date('Y');
            $result = (int)$result;
            $result = $result*1000+1;
            return $result;
        }
    }
}

?>