<?php

namespace Arii\BlocklyBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class ScriptsController extends Controller
{
    
    public function indexAction()
    {
        return $this->render('AriiBlocklyBundle:Scripts:index.html.twig' );
    }

    public function listAction()
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');
        $list = '<?xml version="1.0" encoding="UTF-8"?>';
        $list .= '<rows>';        
       
        $folder = $this->container->get('arii_core.folder');
        $basedir = $this->getBaseDir();
        $Files = $folder->FilesList($basedir ,'',array('*','!code','!xml'));

        foreach ($Files as $file) {
            $list .= '<row id="'.$file.'"><cell>'.$file.'</cell></row>';
        }
        $list .= '</rows>';

        $response->setContent( $list );
        return $response;        
    }

    private function getBaseDir() {
        $session = $this->container->get('arii_core.session');
        return $session->get('workspace').'/Blockly/JobScheduler';    
    }
    
}
