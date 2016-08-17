<?php

namespace Arii\BlocklyBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->editAction(1);
        
        $level = 1;
        return $this->render('AriiBlocklyBundle:Default:index.html.twig', array('level' => $level, 'scripts'=> array()) );
    }

    public function editAction($level=0)
    {
        $request = Request::createFromGlobals();
        if ($request->get('level')>0)
            $level = $request->get('level');
        
        // recuperation des scripts
        $session = $this->container->get('arii_core.session');
        $basedir = $this->getBaseDir();
        $folder = $this->container->get('arii_core.folder');
        $Files = $folder->FilesList($basedir ,'',array('*','!code','!xml'));
        $Scripts = array();
        foreach ($Files as $file) {
            $Scripts[$file]['file'] = $file;
            $Scripts[$file]['label'] = str_replace(array('/'),array('_'),$file);
            $Scripts[$file]['code'] = base64_encode(str_replace("\r\n","\n",file_get_contents("$basedir/$file")));
            $p = strrpos($file,'.');
            $ext = substr($file,$p+1);
            switch($ext) {
                case 'pl':
                    $Scripts[$file]['lang'] = 'perlscript';
                    break;
                case 'js':
                    $Scripts[$file]['lang'] = 'javascript';
                    break;
                case 'jar':
                    $Scripts[$file]['lang'] = 'java';
                    break;
                case 'cmd':
                case 'bat':
                    $Scripts[$file]['lang'] = 'bat';
                    break;
                default:
                    $Scripts[$file]['lang'] = 'shell';
            }            
        }
        return $this->render('AriiBlocklyBundle:Default:index.html.twig', array('level' => $level,'scripts'=>$Scripts) );
    }
    
    public function ribbonAction()
    {
        $request = Request::createFromGlobals();
        $level = $request->get('level');
        
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
        return $this->render('AriiBlocklyBundle:Default:ribbon.json.twig',array('level' => $level, 'Schedulers' => $Dir), $response);
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

        $root = $this->getBaseDir();
       
        // Creation de l'arborescence
        $Paths = explode('/',$name);
        $filename = array_pop($Paths);
        $dir = $this->CreatePath($root,$Paths);
        
        print "$filename -> $dir</br>";
        
        if (file_put_contents("$dir/$filename.xml",$xml)) {
            file_put_contents("$dir/$filename.code",$code);            
        }
        else {
            print "ERROR!";
        }
        exit();
    }

    private function CreatePath($root,$Paths) {        
        $path = $root;
        foreach ($Paths as $p) {
            $path .= "/$p";
            @mkdir($path);
        }
        return $path;
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
        $name = $request->get('name');
        $code = $request->get('code');
        
        print "<b>$name</b><br/>\n";
        $ojs = $this->container->get('arii_blockly.jobscheduler');
        $live = $ojs->getLive();   
        $Paths = explode('/',$name);
        $version = array_pop($Paths);
        $dir = $this->CreatePath($live,$Paths);

        print $this->split($code,$dir);        
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

        $file = $this->getBaseDir().'/'.$name.'.xml';

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
       
        $folder = $this->container->get('arii_core.folder');
        $Files = $folder->FilesList($this->getBaseDir() ,'',array('xml'));

        foreach ($Files as $file) {
            $f = substr($file,0,strlen($file)-4);
            $list .= '<row id="'.$f.'"><cell>'.$f.'</cell></row>';
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
        
        $file = $this->getBaseDir().'/'.$name.".xml";
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');
        
        $generator = $this->container->get('blockly_generate.'.$output);  
        
        $tools = $this->container->get('arii_core.tools');
        $array = $tools->xml2array( file_get_contents($file) );
        
        $response->setContent( $generator->generate( $array ) );
        return $response;    
    }

    private function getBaseDir() {
        $session = $this->container->get('arii_core.session');
        return $session->get('workspace').'/Blockly/JobScheduler';    
    }
}
