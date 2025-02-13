const express = require('express');
const KekoController = require('../controllers/kekos-controller');

const router = express.Router();

router.get('/', KekoController.getAll);
router.get('/:idKeko', KekoController.getById);
router.get('/', KekoController.searchKekos);
router.post('/', KekoController.create);
router.put('/:idKeko', KekoController.update);

module.exports = router;