<?php

namespace Arii\BlocklyBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('AriiBlocklyBundle:Default:index.html.twig', array('name' => $name));
    }
}
