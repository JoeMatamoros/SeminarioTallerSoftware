const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuarios = require('../../../../dao/usuarios/usuarios.model');
const usuariosModel = new Usuarios;

//CREACION DE USUARIO
router.post('/signin', async (req, res)=>{
  try {
    const {email, password} = req.body;
    //TODO: Rrealizar validaciones de entrada de datos
    let rslt = await usuariosModel.new(email, password);
    // joi()
    res.status(200).json({status: 'success', result: rslt});
  } catch (ex) {
    console.log(ex);
    res.status(500).json({status:'failed'});
  }
});

//CREACION DE LOGIN
router.post('/login', async (req, res)=>{
  try {
    const {email, password} = req.body;
    const userInDb = await usuariosModel.getByEmail(email);
    if (userInDb) {
      const isPasswordValid = await usuariosModel.comparePassword(password, userInDb.password);
      if (isPasswordValid) {
        const {email, role, _id} = userInDb;
        const payload = {
          jwt: jwt.sign({email, role, _id}, process.env.JWT_SECRET),
          user: {email, role, _id}
        }
        res.status(200).json(payload);
      } else {
        res.status(400).json({status: 'failed', error: 2});
      }
    } else {
      res.status(400).json({status: 'failed', error: 1});
    }
  } catch (ex) {
    console.log(ex);
    res.status(500).json({status: 'failed'});
  }
});

/*RECUPERACION DE PASSWORD*/
//Forgot my password?
router.post('/forget-password', async (req, res) => {
    try {
        const email = req.body.email;
        const hostUrl = req.get('host');
        const user = await usuariosModel.getByEmail(email);
  
        if (!user) {
            res.status(400).json({status: 'failed', msg: 'Bad request'});
            return;
        }
  
        const payload = {
            _id: user._id,
            roles: user.roles,
            email: user.email
        }
  
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '5m'});
  
        const link = `http://${hostUrl}/api/v1/seguridad/recovery-question/${user._id}/${token}`;
  
        res.status(200).json(
            {
                status: 'ok',
                questionLink: link
            }
        );
  
    } catch (error) {
        res.status(500).json({status: 'failed', msg: 'Internal Server error'});
    }
  });

// PREGUNTA DE RECUPERACION
router.post('/question/:id/:token', async (req, res) => {
  try {
      const {id, token} = req.params;
      const answer = req.body.answer;
      const hostUrl = req.get('host');
      
      const user = await usuariosModel.getById(id);

      if ( !user ){
          res.status(404).json({status: 'Not found'});
          return;
      }

      const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!verifyToken) {
          res.status(404).json({status: 'Not found'});
          return;
      }

      if( user.recovery !== answer) {
          res.status(401).json({status: 'failed', msg: 'Unauthorized'});
          return;
      }

      const payload = {
          _id: user._id,
          roles: user.roles,
          email: user.email
      }

      const resetToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '5m'});

      const resetLink = `http://${hostUrl}/api/v1/seguridad/reset-password/${user._id}/${resetToken}`;

      res.status(200).json(
          {
              status: 'ok',
              resetPasswordLink: resetLink
          }
      );

  } catch (error) {
      console.error(error);
      res.status(500).json({status: 'failed', msg: 'Internal Server error'});
  }
});

//Change pass...
router.post('/change-pass/:id/:token', async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password, confirmPassword } = req.body;
  
        const user = await usuariosModel.getById(id);
  
        if ( !user ){
            res.status(404).json({status: 'Not found'});
            return;
        }
  
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
  
        if (!verifyToken) {
            res.status(404).json({status: 'Not found'});
            return;
        }
  
        if( password !== confirmPassword) {
            res.status(400).json({status: 'failed', msg: 'password and confirmPassword must be the same'});
            return;
        }
  
        const result = await usuariosModel.updatePassword(user._id, password);
        res.status(200).json(
            {
                status: 'ok',
                msg: 'Password reset successful',
                result
            }
        );
  
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'failed', msg: 'Internal Server error'});
    }
  });

  module.exports = router;