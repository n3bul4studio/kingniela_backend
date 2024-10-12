const { BetsModel } = require('../models');

// Crear una nueva apuesta
exports.createBet = async (req, res) => {
  const { bet_name, bet_ini_dt, bet_end_dt, bet_phs, bet_usr, bet_stat } = req.body;
  try {
    const newBet = await BetsModel.create({ bet_name, bet_ini_dt, bet_end_dt, bet_phs, bet_usr, bet_stat });
    res.status(201).json(newBet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todas las apuestas
exports.getBets = async (req, res) => {
  try {
    const bets = await BetsModel.findAll();
    res.json(bets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener una apuesta por ID
exports.getBetById = async (req, res) => {
  const { id } = req.params;
  try {
    const bet = await BetsModel.findByPk(id);
    if (bet) {
      res.json(bet);
    } else {
      res.status(404).json({ error: 'Bet not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar una apuesta
exports.updateBet = async (req, res) => {
  const { id } = req.params;
  const { bet_name, bet_ini_dt, bet_end_dt, bet_phs, bet_usr, bet_stat } = req.body;
  try {
    const [updated] = await BetsModel.update(
      { bet_name, bet_ini_dt, bet_end_dt, bet_phs, bet_usr, bet_stat },
      { where: { bet_id: id } }
    );
    if (updated) {
      const updatedBet = await BetsModel.findByPk(id);
      res.json(updatedBet);
    } else {
      res.status(404).json({ error: 'Bet not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar una apuesta
exports.deleteBet = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await BetsModel.destroy({ where: { bet_id: id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Bet not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
