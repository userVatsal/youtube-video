import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import videoRoutes from './routes/videoRoutes';
// initialize background workers
import '../workers';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/videos', videoRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
