# Real-Time Synchronization Setup Guide

This guide will help you set up real-time synchronization for your TechHub website, so that when the admin makes changes, all users see them instantly.

## What This Does

- When the admin adds, edits, or deletes products on the admin page, all connected users will see the changes immediately
- No need to refresh the page - changes appear in real-time
- Works across multiple browser tabs, devices, and users

## Prerequisites

1. **Node.js** - Download and install from [nodejs.org](https://nodejs.org/)
2. **Your existing TechHub files** (index.html, admin.html, script.js, etc.)

## Setup Instructions

### Step 1: Install Dependencies

Open a terminal/command prompt in your project folder and run:

```bash
npm install
```

This will install the required packages (Express and Socket.IO).

### Step 2: Start the Server

Run the server:

```bash
node server.js
```

You should see:
```
Server running on http://localhost:3000
Real-time synchronization enabled
```

### Step 3: Access Your Website

Instead of opening your HTML files directly, now access them through the server:

- **Main website**: http://localhost:3000/index.html
- **Admin panel**: http://localhost:3000/admin.html

## How to Test

1. **Open multiple browser tabs/windows** with http://localhost:3000/index.html
2. **Open the admin panel** in another tab: http://localhost:3000/admin.html
3. **Make changes in the admin panel** (add, edit, or delete products)
4. **Watch the changes appear instantly** in all the other tabs

## Features

### Real-Time Updates
- ✅ Product additions
- ✅ Product edits
- ✅ Product deletions
- ✅ Price changes
- ✅ Category changes
- ✅ All product details

### User Experience
- ✅ Toast notifications when updates are received
- ✅ Connection status indicators
- ✅ Automatic reconnection if connection is lost
- ✅ No page refresh required

## Troubleshooting

### Server won't start
- Make sure Node.js is installed
- Check that all dependencies are installed (`npm install`)
- Ensure port 3000 is not already in use

### Changes not appearing
- Make sure you're accessing the site through http://localhost:3000 (not file://)
- Check the browser console for any error messages
- Verify the server is running

### Connection issues
- Check that the server is running on port 3000
- Ensure firewall isn't blocking the connection
- Try refreshing the page

## File Structure

```
your-project/
├── server.js              # Real-time server
├── package.json           # Dependencies
├── index.html            # Main website
├── admin.html            # Admin panel
├── script.js             # Main JavaScript
├── styles.css            # Styles
└── REALTIME_SETUP.md    # This guide
```

## Advanced Configuration

### Change Port
To use a different port, edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to your preferred port
```

### Custom Server URL
If your server is on a different machine, update the socket connection in both `script.js` and `admin.html`:
```javascript
socket = io('http://your-server-ip:3000');
```

## Security Notes

- This setup is for development/testing
- For production, consider adding authentication for admin actions
- Implement rate limiting and input validation
- Use HTTPS in production

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the server console for error messages
3. Ensure all files are in the correct locations
4. Verify Node.js and dependencies are properly installed 