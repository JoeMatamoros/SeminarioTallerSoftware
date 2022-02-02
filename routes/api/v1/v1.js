const express = require('express');
const router = express.Router();
const { verifyApiHeaderToken }=require('./headerVerifyMiddleware');
const PacientesRoutes = require('./pacientes/pacientes');
const ExpedientesRoutes = require('./expedientes/expedientes');

router.use('/pacientes',verifyApiHeaderToken ,PacientesRoutes);
router.use('/expedientes', ExpedientesRoutes);

module.exports = router;