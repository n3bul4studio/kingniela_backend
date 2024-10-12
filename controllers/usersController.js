const { UsersModel } = require('../models');

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { usr_user, usr_mail, usr_pass, usr_pfl, usr_stat } = req.body;
  try {
    const newUser = await UsersModel.create({ usr_user, usr_mail, usr_pass, usr_pfl, usr_stat });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await UsersModel.findAll();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UsersModel.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { usr_user, usr_mail, usr_pass, usr_pfl, usr_stat } = req.body;
  try {
    const [updated] = await UsersModel.update(
      { usr_user, usr_mail, usr_pass, usr_pfl, usr_stat },
      { where: { usr_id: id } }
    );
    if (updated) {
      const updatedUser = await UsersModel.findByPk(id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await UsersModel.destroy({ where: { usr_id: id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
