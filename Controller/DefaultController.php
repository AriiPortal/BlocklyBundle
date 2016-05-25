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
        return $this->render('AriiBlocklyBundle:Default:ribbon.json.twig' );
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

    public function saveAction()
    {
        $request = Request::createFromGlobals();
        $name = $request->get('name');
        if ($name=='')
            $name = 'saved';
        $xml = $request->get('xml');        
        
        $file = $this->container->getParameter('workspace').'/Blockly/'.$name.".xml";
        if (file_put_contents($file,$xml)) {
            print $name;
        }
        else {
            print "ERROR!";
        }
        exit();
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
