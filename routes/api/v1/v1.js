const express = require('express');
const router = express.Router();
const { verifyApiHeaderToken }=require('./headerVerifyMiddleware');
const PacientesRoutes = require('./pacientes/pacientes');
const ExpedientesRoutes = require('./expedientes/expedientes');
const seguridadRoutes = require('./seguridad/seguridad');

const {passport,jwtMiddleware} = require('./seguridad/jwtHelper');
router.use(passport.initialize());

router.use('/pacientes',verifyApiHeaderToken,jwtMiddleware,PacientesRoutes);
router.use('/expedientes', ExpedientesRoutes);
router.use('/seguridad',verifyApiHeaderToken,seguridadRoutes);

module.exports = router;