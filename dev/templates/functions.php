<?php
/*----------------------------------------------------------------*\

	VARIOUS THEME FUNCTIONS AND SETUP
	Refer to the Lib folder to view, edit, add funcions

\*----------------------------------------------------------------*/

$file_includes = [
    'lib/theme_support.php',          // General
];

foreach ($file_includes as $file) {
    if (!$filepath = locate_template($file)) {
        trigger_error(sprintf(__('Error locating %s for inclusion', 'starting-point'), $file), E_USER_ERROR);
    }
    require_once $filepath;
}
unset($file, $filepath);

add_theme_support( 'title-tag' );

function register_menus() {
  register_nav_menus(
    array(
      'header-menu' => __( 'Header Menu' ),
      'footer-menu' => __( 'Footer Menu' ),
      'footer-secondary-menu' => __( 'Footer Secondary Menu' )
    )
  );
}
add_action( 'init', 'register_menus' );


?>