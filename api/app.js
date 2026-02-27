import express from 'express';
import path from 'path';
import indexRouter from './routes/index.js';
import cors from 'cors';
import { log } from 'console';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(function(req, res, next) {
  res.status(404);
  next({message: 'Puslapis nerastas'});
});

app.use(function(err, req, res, next) {
  if (!res.statusCode || res.statusCode === 200) {
    res.status(500);
  }

  if (typeof err === 'object' && !Array.isArray(err)) 
    res.json(err);
  else  
    res.json({message: 'Serverio klaida'});
});

const port = process.env.PORT || 3000;
app.listen(port, "127.0.0.1", () => {
  console.log(`Programa veikia ant porto ${port}`);
});