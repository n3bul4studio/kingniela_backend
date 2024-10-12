const { PhasesModel } = require('../models');

// Crear una nueva fase
exports.createPhase = async (req, res) => {
  const { phs_name, phs_sub } = req.body;
  try {
    const newPhase = await PhasesModel.create({ phs_name, phs_sub });
    res.status(201).json(newPhase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todas las fases
exports.getPhases = async (req, res) => {
  try {
    const phases = await PhasesModel.findAll();
    res.json(phases);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener una fase por ID
exports.getPhaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const phase = await PhasesModel.findByPk(id);
    if (phase) {
      res.json(phase);
    } else {
      res.status(404).json({ error: 'Phase not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar una fase
exports.updatePhase = async (req, res) => {
  const { id } = req.params;
  const { phs_name, phs_sub } = req.body;
  try {
    const [updated] = await PhasesModel.update(
      { phs_name, phs_sub },
      { where: { phs_id: id } }
    );
    if (updated) {
      const updatedPhase = await PhasesModel.findByPk(id);
      res.json(updatedPhase);
    } else {
      res.status(404).json({ error: 'Phase not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar una fase
exports.deletePhase = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await PhasesModel.destroy({ where: { phs_id: id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Phase not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
