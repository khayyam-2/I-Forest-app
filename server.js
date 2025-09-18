const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check
app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

// POST /alert receives { lat, lng, message, imageUrl? }
app.post('/alert', (req, res) => {
	const { lat, lng, message, imageUrl } = req.body || {};
	if (typeof lat !== 'number' || typeof lng !== 'number') {
		return res.status(400).json({ error: 'lat and lng must be numbers' });
	}

	const payload = {
		lat,
		lng,
		message: message || 'Help requested',
		imageUrl: imageUrl || null,
		timestamp: new Date().toISOString()
	};

	io.emit('incoming-alert', payload);
	return res.json({ status: 'broadcasted', payload });
});

io.on('connection', socket => {
	// Optional: send a welcome event so the client knows the connection is live
	socket.emit('welcome', { message: 'Connected to Forest Watch dashboard' });
});

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});


