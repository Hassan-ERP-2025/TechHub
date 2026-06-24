const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const https = require('https');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store the current products data
let sharedProducts = [];

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json({ limit: '1mb' }));

// Proxy endpoint to send order to FormSubmit from server
app.post('/api/send-order-email', (req, res) => {
    try {
        const fields = req.body;
        if (!fields || typeof fields !== 'object') {
            return res.status(400).json({ ok: false, error: 'Invalid payload' });
        }

        // Prefer Resend if API key is available
        if (process.env.RESEND_API_KEY) {
            const emailPayload = buildResendPayload(fields);
            const postData = JSON.stringify(emailPayload);

            const options = {
                hostname: 'api.resend.com',
                path: '/emails',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const request = https.request(options, (response) => {
                let rawData = '';
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    console.log('Resend status:', response.statusCode, 'body:', rawData);
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
                        return res.json({ ok: true, method: 'resend' });
                    }
                    // If Resend fails, fallback to FormSubmit
                    return sendViaFormSubmit(fields, res);
                });
            });

            request.on('error', (err) => {
                console.error('Resend error:', err);
                // Fallback to FormSubmit
                return sendViaFormSubmit(fields, res);
            });

            request.write(postData);
            request.end();
            return; // handled asynchronously
        }

        // Otherwise, use FormSubmit directly
        return sendViaFormSubmit(fields, res);
    } catch (err) {
        console.error('Email proxy error:', err);
        return res.status(500).json({ ok: false, error: 'Server error sending email' });
    }
});

function sendViaFormSubmit(fields, res) {
    const postData = JSON.stringify(fields);
    const options = {
        hostname: 'formsubmit.co',
        path: '/ajax/erp2025h@gmail.com',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const request = https.request(options, (response) => {
        let rawData = '';
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => {
            console.log('FormSubmit status:', response.statusCode, 'body:', rawData);
            try {
                const data = JSON.parse(rawData || '{}');
                if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
                    return res.json({ ok: true, method: 'formsubmit' });
                }
                return res.status(response.statusCode || 500).json({ ok: false, error: data?.message || 'Email service error' });
            } catch (e) {
                if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
                    return res.json({ ok: true, method: 'formsubmit' });
                }
                return res.status(response.statusCode || 500).json({ ok: false, error: 'Email service error' });
            }
        });
    });

    request.on('error', (err) => {
        console.error('FormSubmit error:', err);
        return res.status(500).json({ ok: false, error: 'Server error sending email' });
    });

    request.write(postData);
    request.end();
}

function buildResendPayload(fields) {
    const subject = fields._subject || 'New Order - TechHub';
    const to = 'erp2025h@gmail.com';
    const from = 'onboarding@resend.dev'; // Works without domain setup for testing
    const replyTo = fields['Customer Email'] || fields.email || undefined;

    const lines = Object.keys(fields).map(k => `${k}: ${fields[k]}`).join('\n');
    return {
        from,
        to,
        subject,
        text: lines,
        reply_to: replyTo
    };
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Send current products to new client
    socket.emit('productsUpdate', sharedProducts);

    // Listen for admin changes
    socket.on('adminProductChange', (newProducts) => {
        console.log('Admin made changes, broadcasting to all clients');
        sharedProducts = newProducts;
        // Broadcast to all connected clients except the sender
        socket.broadcast.emit('productsUpdate', sharedProducts);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Real-time synchronization enabled');
}); 