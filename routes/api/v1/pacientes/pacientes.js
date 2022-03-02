const express = require('express');
const router = express.Router();

const Pacientes = new require('../../../../dao/pacientes/pacientes.model');
const pacienteModel = new Pacientes();

//GET 
router.get('/', (req, res) => {
    res.status(200).json({
        endpoint: 'Pacientes',
        updates: new Date(2022, 0, 19, 18, 41, 00),
        author: 'José Ordoñez en pacientes'
    });
}); 

// GET TODOS LOS DATOS DE LA DB
router.get('/all', async(req, res) => {
    try {
        const rows = await pacienteModel.getAll();
        res.status(200).json({ status: 'OK', Pacientes: rows });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: 'FAILED' });
    }
}); 

// GET INDIVIDUAL
router.get('/byid/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const row = await pacienteModel.getById(id);
        res.status(200).json({ status: 'OK', paciente: row });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: 'EL ID NO EXISTE' });
    }
}); 

//POST /new
router.post('/new', async(req, res) => {
    const {nombres, apellidos, identidad, email, telefono } = req.body;

    rslt = await pacienteModel.new(nombres, apellidos, identidad, email,telefono);

    res.status(200).json({
        status: 'OK',
        recieved: {
            nombres,
            apellidos,
            nombrecompleto: `${nombres} ${apellidos}`,
            identidad,
            email,
            telefono
        }
    });
}); 

//ACTUALIZAR
router.put('/update/:id', async(req, res) => {
    try {
        const { nombres, apellidos, identidad, email, telefono } = req.body;
        const { id } = req.params;
        const result = await pacienteModel.updateOne(id, nombres, apellidos, identidad, email, telefono);
        res.status(200).json({
            status: 'ok',
            result
        })
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: 'FAILED' });
    }
});

//ELIMINAR
router.delete('/delete/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await pacienteModel.deleteOne(id);
        res.status(200).json({
            status: 'ok',
            result
        })
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: 'FAILED' });
    }
});

module.exports = router;