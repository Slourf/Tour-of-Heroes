import { Router } from 'express';
import heroes from './heroes/index';

var router = Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.use('/heroes', heroes);

// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});

export default router;
