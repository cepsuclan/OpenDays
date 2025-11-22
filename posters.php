<?php
header('Content-Type: application/json');

// adjust path as needed (relative to this PHP file)
$directory = __DIR__ . '/Posters';
$baseUrl = dirname($_SERVER['SCRIPT_NAME']) . '/Posters';

$files = glob($directory . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);

// convert absolute paths to web paths
$images = array_map(function($path) use ($directory, $baseUrl) {
    return $baseUrl . '/' . basename($path);
}, $files);

echo json_encode($images, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
