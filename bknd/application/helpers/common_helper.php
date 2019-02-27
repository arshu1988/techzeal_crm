<?php
/**
 * @author   Ahtsham Uddin Shaikh <arshu1988@gmail.com>
 */
defined('BASEPATH') OR exit('No direct script access allowed');

if ( ! function_exists('select_all'))
{
    function select_all($main_qry,$tablename,$where,$orderby)
    {
        $CI =& get_instance();
        $query = false;
        $CI->db->select($main_qry);
        if($where)
        {
            $query = $CI->db->get_where($tablename,$where);
        }
        else
        {
            $query = $CI->db->get($tablename);
        }

        $count = $query->num_rows();
        if($count>0)
        {
            return $query->result_array();
        }
        else
        {
            return false;
        }
    }


}

if( ! function_exists('tz_response'))
{

    function tz_response($res)
    {
        $CI = & get_instance();
        $CI ->output
        ->set_content_type('application/json')
        ->set_output(json_encode($res));
    }
}

if( ! function_exists('tz_row_count'))
{
    function tz_row_count($tablename,$where)
    {
        $CI = & get_instance();

        $rowcount = $CI->db->select('*')->from($tablename)->where($where)->get()->num_rows();
        return $rowcount;
    }
}