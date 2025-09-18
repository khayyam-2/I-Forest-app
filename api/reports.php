<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data) {
        // Add timestamp if not present
        if (!isset($data['timestamp'])) {
            $data['timestamp'] = date('c');
        }
        
        // Add ID if not present
        if (!isset($data['id'])) {
            $data['id'] = 'FW' . time() . rand(1000, 9999);
        }
        
        // Store in JSON file
        $reportsFile = '../data/reports.json';
        
        // Create data directory if it doesn't exist
        if (!file_exists('../data')) {
            mkdir('../data', 0777, true);
        }
        
        // Load existing reports
        $reports = [];
        if (file_exists($reportsFile)) {
            $reports = json_decode(file_get_contents($reportsFile), true) ?: [];
        }
        
        // Add new report
        $reports[] = $data;
        
        // Keep only last 100 reports
        if (count($reports) > 100) {
            $reports = array_slice($reports, -100);
        }
        
        // Save reports
        file_put_contents($reportsFile, json_encode($reports, JSON_PRETTY_PRINT));
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Report saved successfully',
            'report_id' => $data['id']
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return all reports
    $reportsFile = '../data/reports.json';
    
    if (file_exists($reportsFile)) {
        $reports = json_decode(file_get_contents($reportsFile), true) ?: [];
        echo json_encode(['status' => 'success', 'data' => $reports]);
    } else {
        echo json_encode(['status' => 'success', 'data' => []]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>
