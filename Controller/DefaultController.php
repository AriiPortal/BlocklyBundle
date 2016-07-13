<?php

namespace Arii\BlocklyBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('AriiBlocklyBundle:Default:index.html.twig' );
    }
    
    public function ribbonAction()
    {
        $folder = $this->container->get('arii_core.folder');
        $session = $this->container->get('arii_core.session');
        $engine = $session->getSpoolerByName('arii');
        if (isset($engine[0]['shell']['data'])) {
            $config = $engine[0]['shell']['data'].'/config';
            $Dir = $folder->Remotes("$config/remote");
        }
        else {
            $Dir = array();
        }
        
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        return $this->render('AriiBlocklyBundle:Default:ribbon.json.twig',array('Schedulers' => $Dir), $response);
    }

    public function readmeAction()
    {
        return $this->render('AriiBlocklyBundle:Default:readme.html.twig');
    }

    public function toolbarAction()
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');
        return $this->render('AriiBlocklyBundle:Default:toolbar.xml.twig',array(), $response );
    }

    public function toolbar_checkAction()
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');
        return $this->render('AriiBlocklyBundle:Default:toolbar_check.xml.twig',array(), $response );
    }

    public function saveAction()
    {
        $request = Request::createFromGlobals();
        $name = $request->get('name');
        if ($name=='')
            $name = 'saved';
        $xml = $request->get('xml');        
        $code = $request->get('code');    
        
        $file = $this->container->getParameter('workspace').'/Blockly/'.$name.".xml";
        if (file_put_contents($file,$xml)) {
            print $name;
            $file = $this->container->getParameter('workspace').'/Blockly/'.$name.".code";
            file_put_contents($file,$code);            
        }
        else {
            print "ERROR!";
        }
        exit();
    }

    public function checkAction()
    {
        $request = Request::createFromGlobals();
        $code = $request->get('code');
        print $this->split($code,'C:\Program Files\jobscheduler\pgsql\scheduler_data\config\live\blockly');        
        exit();
    }

    public function deployAction()
    {        
        $request = Request::createFromGlobals();
        $code = $request->get('code');
        
        $ojs = $this->container->get('arii_blockly.jobscheduler');
        $live = $ojs->getLive();
        print $this->split($code,$live);        
        exit();
    }
    
    public function split($code,$target) {
        $txt = $msg = '';        
        foreach (explode("\n",$code) as $l) {
            if (($p=strpos($l,'<!--START['))!==false) {
                $p += 10;
                $e=strpos($l,']-->',$p);
                $name = substr($l,$p,$e-$p);
                $msg .= "$name</br>";
                $txt = '';
            }
            elseif (($p=strpos($l,'<!--END['))!==false) {
                $p += 10;
                $e=strpos($l,']-->',$p);
                $end = substr($l,$p,$e-$p); # verification ?                
                file_put_contents("$target/$name",$txt);
            }
            else {
                $txt .= trim($l)."\n";
            }
        }
        return $msg;
    }
            
    public function getAction()
    {
        $request = Request::createFromGlobals();
        $name = $request->get('name');
        
        $file = $this->container->getParameter('workspace').'/Blockly/'.$name.".xml";
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');
        $response->setContent( file_get_contents($file) );
        return $response;    
    }
    
    public function listAction()
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');
        $list = '<?xml version="1.0" encoding="UTF-8"?>';
        $list .= '<rows>';        
        $basedir = $this->container->getParameter('workspace').'/Blockly';
        if ($dh = @opendir($basedir)) {
            while (($file = readdir($dh)) !== false) {    
                if (substr($file,-4) == '.xml') {
                    $xml = substr($file,0,strlen($file)-4);
                    $list .= '<row id="'.$xml.'"><cell>'.$xml.'</cell></row>';
                }
            }
        }
        $list .= '</rows>';

        $response->setContent( $list );
        return $response;        
    }

    public function generateAction()
    {
        $request = Request::createFromGlobals();
        $name = $request->get('name');
        $output = $request->get('format');
        
        $file = $this->container->getParameter('workspace').'/Blockly/'.$name.".xml";
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');
        
        $generator = $this->container->get('blockly_generate.'.$output);  
        
        $tools = $this->container->get('arii_core.tools');
        $array = $tools->xml2array( file_get_contents($file) );
        
        $response->setContent( $generator->generate( $array ) );
        return $response;    
    }
   
    
}
