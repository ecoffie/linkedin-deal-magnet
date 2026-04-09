/**
 * Email sending utilities
 * Uses Resend API (requires RESEND_API_KEY in .env)
 */

const fs = require('fs');
const path = require('path');

// Initialize Resend client (will be null if API key not set)
let resend = null;
try {
    if (process.env.RESEND_API_KEY) {
        const { Resend } = require('resend');
        resend = new Resend(process.env.RESEND_API_KEY);
    }
} catch (error) {
    console.warn('Resend not available:', error.message);
}

/**
 * Send audit completion email with results
 */
async function sendAuditEmail(auditData) {
    if (!resend) {
        console.warn('⚠️ Resend API not configured. Email not sent.');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        // Load email template
        const templatePath = path.join(__dirname, '..', 'email-templates', 'audit-complete.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        // Determine score color
        let scoreColor = '#ef4444'; // red
        let scoreColorDark = '#dc2626';
        if (auditData.score >= 80) {
            scoreColor = '#10b981'; // green
            scoreColorDark = '#059669';
        } else if (auditData.score >= 60) {
            scoreColor = '#0077B5'; // blue
            scoreColorDark = '#005582';
        } else if (auditData.score >= 40) {
            scoreColor = '#f59e0b'; // yellow
            scoreColorDark = '#d97706';
        }

        // Get top 5 high-priority fixes
        const topFixes = (auditData.fixes || [])
            .filter(fix => fix.priority === 'high')
            .slice(0, 5)
            .map((fix, index) => `
                <div style="margin-bottom: 16px; padding: 16px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px;">
                    <div style="display: flex; align-items: start;">
                        <span style="display: inline-block; width: 24px; height: 24px; background-color: #ef4444; color: #ffffff; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${index + 1}</span>
                        <div>
                            <h4 style="margin: 0 0 8px; color: #1f2937; font-size: 16px; font-weight: 600;">${fix.title || 'Fix Issue'}</h4>
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">${fix.description || fix.suggestion || ''}</p>
                        </div>
                    </div>
                </div>
            `).join('');

        // Build dashboard URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const dashboardUrl = `${baseUrl}/dashboard?email=${encodeURIComponent(auditData.email)}`;
        const upgradeUrl = `${baseUrl}/onboarding?audit=${auditData.id}&email=${encodeURIComponent(auditData.email)}#upgrade`;

        // Replace placeholders
        html = html
            .replace(/{{score}}/g, auditData.score)
            .replace(/{{scoreLabel}}/g, auditData.scoreLabel)
            .replace(/{{scoreColor}}/g, scoreColor)
            .replace(/{{scoreColorDark}}/g, scoreColorDark)
            .replace(/{{aiHeadline}}/g, auditData.aiHeadline || 'Your optimized headline')
            .replace(/{{topFixes}}/g, topFixes || '<p style="color: #6b7280;">No high-priority fixes found. Great job!</p>')
            .replace(/{{dashboardUrl}}/g, dashboardUrl)
            .replace(/{{upgradeUrl}}/g, upgradeUrl)
            .replace(/{{unsubscribeUrl}}/g, `${baseUrl}/unsubscribe?email=${encodeURIComponent(auditData.email)}`);

        // Send email
        const result = await resend.emails.send({
            from: 'LinkedIn Deal Magnet <onboarding@resend.dev>', // Using Resend's test domain
            to: auditData.email,
            subject: `Your LinkedIn Profile Score: ${auditData.score}/100 🎯`,
            html: html
        });

        console.log('✅ Email sent successfully:', result.id);
        return { success: true, emailId: result.id };
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send welcome email for Pro subscribers
 */
async function sendWelcomeEmail(email, subscriptionData) {
    if (!resend) {
        console.warn('⚠️ Resend API not configured. Email not sent.');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Deal Magnet Pro!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #0077B5 0%, #005582 100%);">
            <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Welcome to Deal Magnet Pro! 🚀</h1>
        </div>
        <div style="padding: 40px;">
            <p style="font-size: 18px; color: #1f2937; line-height: 1.6;">
                Thank you for upgrading to Pro! You now have access to:
            </p>
            <ul style="font-size: 16px; color: #374151; line-height: 1.8;">
                <li>✅ Unlimited LinkedIn profile audits</li>
                <li>✅ AI-powered content generation</li>
                <li>✅ Premium optimization tools</li>
                <li>✅ Priority email support</li>
            </ul>
            <div style="text-align: center; margin-top: 32px;">
                <a href="${baseUrl}/dashboard?email=${encodeURIComponent(email)}" style="display: inline-block; padding: 16px 32px; background-color: #0077B5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Go to Dashboard</a>
            </div>
        </div>
        <div style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            © 2026 LinkedIn Deal Magnet. All rights reserved.
        </div>
    </div>
</body>
</html>
        `;

        const result = await resend.emails.send({
            from: 'LinkedIn Deal Magnet <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to Deal Magnet Pro! 🚀',
            html: html
        });

        console.log('✅ Welcome email sent:', result.id);
        return { success: true, emailId: result.id };
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendAuditEmail,
    sendWelcomeEmail
};
