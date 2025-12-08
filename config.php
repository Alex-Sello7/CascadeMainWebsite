<?php
// config.php - Configuration settings

// Email settings
define('BUSINESS_EMAIL', 'atsello4@gmail.com');
define('SITE_NAME', 'Cascade Creations');
define('SITE_URL', 'https://alex-sello7.github.io/CascadeMainWebsite'); 

// Database settings (if you add a database later)
define('DB_HOST', 'localhost');
define('DB_NAME', 'cascade_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Error reporting
if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
?>