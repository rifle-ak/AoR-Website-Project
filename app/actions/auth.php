<?php
/**
 * Art of Rust - Authentication actions
 */

if (!defined('AOR_APP')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * Finish a Steam OpenID sign-in: verify the assertion with Steam, upsert the
 * user, start the session, and return the visitor to where they were headed.
 */
function handle_steam_callback(): void {
    $steamId = SteamAuth::validate();

    if (!$steamId) {
        flash('error', 'Steam sign-in failed. Please try again.');
        redirect('/login');
    }

    if (!db_available()) {
        flash('error', 'Sign-in is unavailable right now - the database could not be reached.');
        redirect('/login');
    }

    $profile = SteamAuth::getUserProfile($steamId);
    $user = data_upsert_steam_user($profile);

    Auth::login($user['steam_id']);

    $intended = $_SESSION['intended'] ?? '/profile';
    unset($_SESSION['intended']);

    flash('success', 'Welcome back, ' . $user['display_name'] . '.');
    redirect($intended);
}

/**
 * The blank state of the sign-in form.
 */
function login_form_state(string $mode = ''): array {
    if ($mode === '') {
        $mode = query('mode') === 'register' ? 'register' : 'login';
    }

    return ['mode' => $mode, 'errors' => [], 'values' => ['username' => '', 'email' => '']];
}

/**
 * Validate a submitted account form.
 *
 * Password accounts are not enabled - Steam is the only way in - so a valid
 * submission is answered with a clear explanation rather than a silent no-op.
 */
function handle_login_post(): array {
    csrf_verify();

    $mode = input('mode') === 'register' ? 'register' : 'login';
    $username = input('username');
    $email = input('email');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    $errors = [];

    if ($mode === 'register') {
        if ($username === '') {
            $errors['username'] = 'Username is required';
        } elseif (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
            $errors['username'] = 'Username must be 3-20 characters, alphanumeric and underscores only';
        }

        if ($email === '') {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Please enter a valid email address';
        }
    }

    if ($password === '') {
        $errors['password'] = 'Password is required';
    } elseif ($mode === 'register' && password_strength($password)['score'] < 3) {
        $errors['password'] = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
    }

    if ($mode === 'register' && $password !== $confirmPassword) {
        $errors['confirm_password'] = 'Passwords do not match';
    }

    if (!$errors) {
        $errors['form'] = $mode === 'register'
            ? 'Account registration is not enabled yet. Sign in with Steam instead - it creates your account automatically.'
            : 'Password sign-in is not enabled. Use the "Sign in with Steam" button above.';
    }

    return [
        'mode' => $mode,
        'errors' => $errors,
        'values' => ['username' => $username, 'email' => $email],
    ];
}

/**
 * Score a password 0-6 and describe it, matching the strength meter the form
 * shows while typing.
 */
function password_strength(string $password): array {
    $score = 0;

    if (strlen($password) >= 8) {
        $score++;
    }
    if (strlen($password) >= 12) {
        $score++;
    }
    if (preg_match('/[A-Z]/', $password)) {
        $score++;
    }
    if (preg_match('/[a-z]/', $password)) {
        $score++;
    }
    if (preg_match('/[0-9]/', $password)) {
        $score++;
    }
    if (preg_match('/[^A-Za-z0-9]/', $password)) {
        $score++;
    }

    if ($score <= 2) {
        $message = 'Weak';
    } elseif ($score <= 4) {
        $message = 'Medium';
    } elseif ($score <= 5) {
        $message = 'Strong';
    } else {
        $message = 'Very Strong';
    }

    return ['score' => $score, 'message' => $message];
}
