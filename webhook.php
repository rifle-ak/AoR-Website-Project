<?php
/**
 * Git Webhook Handler
 * Receives webhooks from GitHub/GitLab and triggers deployment
 */

// Configuration
define('DEPLOY_SCRIPT', __DIR__ . '/deploy.sh');
define('LOG_FILE', __DIR__ . '/webhook.log');
define('SECRET_TOKEN', getenv('WEBHOOK_SECRET') ?: 'change-this-secret'); // Set in .env

// Log function
function logMessage($message) {
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents(LOG_FILE, "[$timestamp] $message\n", FILE_APPEND);
}

// Verify webhook signature (GitHub)
function verifyGitHubSignature($payload, $signature) {
    if (empty($signature)) {
        return false;
    }

    $hash = 'sha256=' . hash_hmac('sha256', $payload, SECRET_TOKEN);
    return hash_equals($hash, $signature);
}

// Main execution
try {
    logMessage("========================================");
    logMessage("Webhook received from " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));

    // Get payload
    $payload = file_get_contents('php://input');
    $data = json_decode($payload, true);

    // Get headers
    $signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
    $event = $_SERVER['HTTP_X_GITHUB_EVENT'] ?? $_SERVER['HTTP_X_GITLAB_EVENT'] ?? 'push';

    logMessage("Event type: $event");

    // Verify signature (optional but recommended)
    if (SECRET_TOKEN !== 'change-this-secret' && !empty($signature)) {
        if (!verifyGitHubSignature($payload, $signature)) {
            logMessage("ERROR: Invalid signature");
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Invalid signature']);
            exit;
        }
    }

    // Only deploy on push events
    if ($event !== 'push') {
        logMessage("Skipping non-push event: $event");
        echo json_encode(['status' => 'ignored', 'message' => 'Not a push event']);
        exit;
    }

    // Get branch info
    $branch = '';
    if (isset($data['ref'])) {
        $branch = str_replace('refs/heads/', '', $data['ref']);
    }

    logMessage("Branch: $branch");

    // Log commit info
    if (isset($data['commits']) && !empty($data['commits'])) {
        $latestCommit = end($data['commits']);
        logMessage("Commit: " . ($latestCommit['id'] ?? 'unknown'));
        logMessage("Message: " . ($latestCommit['message'] ?? 'no message'));
        logMessage("Author: " . ($latestCommit['author']['name'] ?? 'unknown'));
    }

    // Trigger deployment
    if (file_exists(DEPLOY_SCRIPT)) {
        logMessage("Triggering deployment script...");

        // Make sure script is executable
        chmod(DEPLOY_SCRIPT, 0755);

        // Run deployment in background
        $command = DEPLOY_SCRIPT . ' > /dev/null 2>&1 &';
        exec($command, $output, $returnCode);

        logMessage("Deployment triggered (exit code: $returnCode)");

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Deployment triggered',
            'branch' => $branch
        ]);
    } else {
        logMessage("ERROR: Deploy script not found at " . DEPLOY_SCRIPT);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Deploy script not found'
        ]);
    }

} catch (Exception $e) {
    logMessage("ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
