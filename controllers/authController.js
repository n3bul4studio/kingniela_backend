const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UsersModel } = require('../models');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const findUser = await UsersModel.findOne({ 
      where: { usr_user: username }
    });

    if (findUser) {
      return res.status(401).json({ error: 'Usuario ya existe' });
    }

    const user = await UsersModel.create({
      usr_user: username, 
      usr_mail: email, 
      usr_pass: password,
      usr_pfl: 2,
      usr_stat: 13,
    });

    const token = jwt.sign({ userId: user.usr_id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
    res.status(201).json({ token, id: user.usr_id, });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscar usuario por 'username'
    const user = await UsersModel.findOne({ 
      where: { usr_user: username }
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });


    // Verificar la contraseña (comparación directa)
    if (password !== user.usr_pass) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Verificar la contraseña
    // const isPasswordValid = await bcrypt.compare(password, user.usr_pass);
    // if (!isPasswordValid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Generar un token
    const token = jwt.sign({ userId: user.usr_id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, id: user.usr_id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
