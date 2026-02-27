import express from 'express';
import usersRouter from './users.js';
import projectsRouter from './projects.js';
import authRouter from './auth.js';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: 'Serveris veikia' });
});

// pajungiame auth maršrutus
router.use('/', authRouter);

// pajungiame users maršrutus
router.use('/users', usersRouter);

// pajungiame projects maršrutus
router.use('/projects', projectsRouter);

// pajungiame products maršrutus
import productsRouter from '../routes/products.js';
router.use('/products', productsRouter);

// pajungiame categories maršrutus
import categoriesRouter from '../routes/categories.js';
router.use('/categories', categoriesRouter);

// pajungiame contact maršrutus
import contactRouter from '../routes/contact.js';
router.use('/contact', contactRouter);

// pajungiame orders maršrutus
import ordersRouter from '../routes/orders.js';
router.use('/orders', ordersRouter);

// pajungiame stats maršrutus
import statsRouter from '../routes/stats.js';
router.use('/stats', statsRouter);

export default router;