<?php
namespace Arii\BlocklyBundle\Service;

class JobScheduler {
    
    protected $root;
    protected $config;

    public function __construct($root, $config)
    {
        $this->root = $root.'/../src/Arii/BlocklyBundle';
        $this->config  = $config;
    }
    
    public function getLive() {        
        return $this->config['jobscheduler'].'/live';
    }
    
    public function Generate( $Blocks ) {        
        // On decoupe en fonction des fichiers
        return $Blocks;
    }
   
}