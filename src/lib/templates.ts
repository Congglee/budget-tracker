export const VERIFY_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Registration Confirmation</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #ce7ed3;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }

        .logo {
            margin-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 20px;
            line-height: 1.6;
        }

        .content h2 {
            margin-top: 0;
            font-size: 20px;
            color: #ce7ed3;
        }

        .greeting a {
            text-decoration: none;
            color: inherit;
        }

        .button {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 20px;
            font-size: 16px;
            color: #ffffff !important;
            background-color: #ce7ed3;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            padding: 10px 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            background-color: #f9f9f9;
        }

        .footer a {
            color: #ce7ed3;
            text-decoration: none;
        }

        .automated-message {
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://utfs.io/f/rXMtqs6lu3kd6bCiVaO1uz3PMWNec4vABLiRwQSfakoZF69I" alt="Logo" class="logo" width="120" height="auto">
            <h1>Welcome to Budget Tracker</h1>
        </div>
        <div class="content">
            <h2>Account Registration Confirmation</h2>
            <p class="greeting">Hi {{user_name}},</p>
            <p>Thank you for registering an account with Budget Tracker. To complete your registration, please confirm
                your email address by clicking the button below:</p>
            <a href="{{confirm_link}}" class="button">Confirm Your Email</a>
            <p>If you did not create an account, you can safely ignore this email.</p>
            <p class="automated-message">This is an automated email, please do not reply to this message.</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact our support team at <a href="mailto:congldqn888@gmail.com">support@budget-tracker.com</a>.</p>
            <p>&copy; 2024 Budget Tracker. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
`;

export const RESET_PASSWORD_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #ce7ed3;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }

        .logo {
            margin-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 20px;
            line-height: 1.6;
        }

        .content h2 {
            margin-top: 0;
            font-size: 20px;
            color: #ce7ed3;
        }

        .greeting a {
            text-decoration: none;
            color: inherit;
        }

        .button {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 20px;
            font-size: 16px;
            color: #ffffff !important;
            background-color: #ce7ed3;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            padding: 10px 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            background-color: #f9f9f9;
        }

        .footer a {
            color: #ce7ed3;
            text-decoration: none;
        }

        .automated-message {
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://utfs.io/f/rXMtqs6lu3kd6bCiVaO1uz3PMWNec4vABLiRwQSfakoZF69I" alt="Logo" class="logo" width="120" height="auto">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Forgot Your Password?</h2>
            <p class="greeting">Hi {{user_name}},</p>
            <p>We received a request to reset your password for your Budget Tracker account. Click the button below to reset your password:</p>
            <a href="{{reset_link}}" class="button">Reset Your Password</a>
            <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p class="automated-message">This is an automated email, please do not reply to this message.</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact our support team at <a href="mailto:congldqn888@gmail.com">support@budget-tracker.com</a>.</p>
            <p>&copy; 2024 Budget Tracker. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
`;

export const TWO_FACTOR_AUTHENTICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-Factor Authentication Code</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #ce7ed3;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }

        .logo {
            margin-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 20px;
            line-height: 1.6;
        }

        .content h2 {
            margin-top: 0;
            font-size: 20px;
            color: #ce7ed3;
        }

        .greeting a {
            text-decoration: none;
            color: inherit;
        }

        .code-box {
            display: block;
            margin: 20px 0;
            padding: 15px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            color: #333333;
            background-color: #f4f4f4;
            border: 2px dashed #ce7ed3;
            border-radius: 5px;
            letter-spacing: 3px;
        }

        .footer {
            padding: 10px 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            background-color: #f9f9f9;
        }

        .footer a {
            color: #ce7ed3;
            text-decoration: none;
        }

        .automated-message {
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://utfs.io/f/rXMtqs6lu3kd6bCiVaO1uz3PMWNec4vABLiRwQSfakoZF69I" alt="Logo" class="logo" width="120" height="auto">
            <h1>Two-Factor Authentication</h1>
        </div>
        <div class="content">
            <h2>Your Authentication Code</h2>
            <p class="greeting">Hi {{user_name}},</p>
            <p>To complete your login, please use the following authentication code:</p>
            <div class="code-box">{{auth_code}}</div>
            <p>This code will expire in 5 minutes. If you did not attempt to log in, please secure your account immediately.</p>
            <p class="automated-message">This is an automated email, please do not reply to this message.</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact our support team at <a href="mailto:congldqn888@gmail.com">support@budget-tracker.com</a>.</p>
            <p>&copy; 2024 Budget Tracker. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
`;
