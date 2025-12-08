<?php
// process-contact.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get POST data
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

// Fallback to regular POST if JSON decode fails
if ($data === null) {
    $data = $_POST;
}

// Extract form data
$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$service = isset($data['service']) ? trim($data['service']) : '';
$project = isset($data['project']) ? trim($data['project']) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (empty($service)) {
    $errors[] = 'Service is required';
}

if (empty($project)) {
    $errors[] = 'Project details are required';
}

// If there are validation errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Validation failed',
        'details' => $errors
    ]);
    exit();
}

// Email configuration - IMPORTANT: Use a valid from email
$toEmail = 'atsello4@gmail.com'; // Your business email
$fromEmail = 'noreply@yourdomain.com'; // Use a valid email from your domain
$subject = "Cascade Creations - New Inquiry: $service";

// Email headers
$headers = "From: Cascade Creations <$fromEmail>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// HTML email content
$htmlMessage = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2c5aa0 0%, #1a365d 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2c5aa0; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #2c5aa0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
            <p>Cascade Creations Website</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>" . htmlspecialchars($name) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>" . htmlspecialchars($email) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Service Interested In:</div>
                <div class='value'>" . htmlspecialchars($service) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Project Details:</div>
                <div class='value'>" . nl2br(htmlspecialchars($project)) . "</div>
            </div>
            <div class='footer'>
                <p>This message was sent from the Cascade Creations contact form at " . date('Y-m-d H:i:s') . "</p>
                <p>You can reply directly to this email to contact " . htmlspecialchars($name) . ".</p>
            </div>
        </div>
    </div>
</body>
</html>
";

// Send email
$mailSent = mail($toEmail, $subject, $htmlMessage, $headers);

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully.',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} else {
    // Provide helpful error message
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email. Please try again or contact us directly.',
        'suggestion' => 'You can also email us at atsello4@gmail.com or call 072 078 6569'
    ]);
}
?>