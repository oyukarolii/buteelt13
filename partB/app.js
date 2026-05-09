const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const booksRouter   = require('./routes/books.routes');
const membersRouter = require('./routes/members.routes');
const loansRouter   = require('./routes/loans.routes');
const errorHandler  = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/books',   booksRouter);
app.use('/api/members', membersRouter);
app.use('/api/loans',   loansRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Central error handler (must be last)
app.use(errorHandler);

module.exports = app;
