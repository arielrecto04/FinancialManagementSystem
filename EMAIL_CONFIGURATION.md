# Email Configuration Guide

## Introduction

This application uses Laravel's email system to send notifications to admin and superadmin users when new requests are submitted. This document provides instructions on how to properly configure the email settings in your `.env` file.

## Current Configuration

Your application currently has these email settings:

```
MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

With these settings, emails will be logged to the Laravel log files instead of being sent. This is good for development but not for production use.

## Configuration Options

### Option 1: Using SMTP (Recommended for Production)

To use a real SMTP server to send emails, update your `.env` file with settings similar to these:

```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com  # Or your SMTP server
MAIL_PORT=587             # Common ports: 25, 465, 587, 2525
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password-or-app-password
MAIL_ENCRYPTION=tls       # Options: tls, ssl, null
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="Financial Management System"
```

### Option 2: Using Gmail

If using Gmail, you will need to either:
1. Enable "Less secure app access" (not recommended), or
2. Create an "App Password" in your Google Account settings

### Option 3: Using Mailtrap (Recommended for Testing)

For testing without sending real emails:

```
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="test@example.com"
MAIL_FROM_NAME="Financial Management System"
```

### Option 4: Using Other Email Services

You can also use other email services like:
- SendGrid: `MAIL_MAILER=sendgrid`
- Amazon SES: `MAIL_MAILER=ses`
- Mailgun: `MAIL_MAILER=mailgun`

Each service requires its own specific configuration. Please refer to the Laravel documentation for more details.

## Testing Email Configuration

After configuring your email settings, you can verify it works by:

1. Making a new request in the system (this will trigger notifications to admin/superadmin users)
2. Check the email accounts of your admin users to confirm receipt
3. If emails are not being received, check your Laravel logs at `storage/logs/laravel.log`

## Troubleshooting

If emails are not being sent:

1. Verify the credentials in your `.env` file are correct
2. Check that the SMTP server is accessible from your server
3. Look for errors in `storage/logs/laravel.log`
4. Ensure that admin/superadmin users have valid email addresses in the database

For further assistance, please contact your system administrator or developer. 