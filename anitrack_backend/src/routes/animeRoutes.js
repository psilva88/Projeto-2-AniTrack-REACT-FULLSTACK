const express = require('express');
const router = express.Router();
const controller = require('../controllers/animeController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, controller.listar);
router.get('/stats', auth, controller.estatisticas);
router.get('/:id', auth, controller.buscarPorId);
router.post('/', auth, controller.criar);
router.put('/:id', auth, controller.atualizar);
router.delete('/:id', auth, controller.remover);

module.exports = router;
