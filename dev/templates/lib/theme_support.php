<?php

/*----------------------------------------------------------------*\
		ENQUEUE JS AND CSS FILES
\*----------------------------------------------------------------*/
function wp_main_assets() {
  wp_enqueue_style( 'style-name', get_stylesheet_uri() );
  wp_enqueue_style('main', get_template_directory_uri() . '/assets/css/main.css', array(), '1.5', 'all');
//   wp_enqueue_script('vendors', get_template_directory_uri() . '/dist/scripts/vendors/vendors.js', array( 'jquery' ), '1.0', true);
  wp_enqueue_script('main', get_template_directory_uri() . '/assets/js/main.min.js', array( 'jquery' ), '1.5', true);
}
add_action('wp_enqueue_scripts', 'wp_main_assets');