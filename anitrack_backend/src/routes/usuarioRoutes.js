const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.get('/', auth, controller.listar);
router.get('/:id', auth, controller.buscarPorId);
router.put('/:id', auth, controller.atualizar);
router.delete('/:id', auth, role('admin'), controller.deletar);

module.exports = router;
