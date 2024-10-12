const { ScoresModel } = require('../models');
const sequelize = require('../config/database');

// Crear un nuevo puntaje
exports.createScore = async (req, res) => {
  const { tdb_master, tdb_bet, tdb_phs, tdb_local_tms, tdb_local_score, tdb_visit_tms, tdb_visit_score, tdb_usr, tdb_usr_score } = req.body;
  try {
    const newScore = await ScoresModel.create({
      tdb_master,
      tdb_bet,
      tdb_phs,
      tdb_local_tms,
      tdb_local_score,
      tdb_visit_tms,
      tdb_visit_score,
      tdb_usr,
      tdb_usr_score,
    });
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createScoreFromUser = async (req, res) => {
  // const { id, tdb_local_score, tdb_visit_score } = req.body;
  const { userId } = req;

  try {
    const response = [];
    const data = req.body;

    for (const id of Object.keys(data)) {
      const { tdb_local_score, tdb_visit_score } = data[id];
      const score = await ScoresModel.findByPk(id);

      if (score) {
        const data = score.dataValues;
        const newScore = await ScoresModel.create({
          tdb_master: 0,
          tdb_bet: data.tdb_bet,
          tdb_phs: data.tdb_phs,
          tdb_local_tms: data.tdb_local_tms,
          tdb_local_score,
          tdb_visit_tms: data.tdb_visit_tms,
          tdb_visit_score,
          tdb_usr: userId,
          tdb_usr_score: null,
        });

        response.push(newScore);
      }
    }

    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los puntajes
exports.getScores = async (req, res) => {
  try {
    const scores = await ScoresModel.findAll();
    res.json(scores);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener un puntaje por ID
exports.getScoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const score = await ScoresModel.findByPk(id);
    if (score) {
      res.json(score);
    } else {
      res.status(404).json({ error: 'Score not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar un puntaje
exports.updateScore = async (req, res) => {
  const { id } = req.params;
  const {
    tdb_master,
    tdb_bet,
    tdb_phs,
    tdb_local_tms,
    tdb_local_score,
    tdb_visit_tms,
    tdb_visit_score,
    tdb_usr,
    tdb_usr_score
  } = req.body;
  try {
    const [updated] = await ScoresModel.update(
      { tdb_master, tdb_bet, tdb_phs, tdb_local_tms, tdb_local_score, tdb_visit_tms, tdb_visit_score, tdb_usr, tdb_usr_score },
      { where: { tdb_id: id } }
    );
    if (updated) {
      const updatedScore = await ScoresModel.findByPk(id);
      res.json(updatedScore);
    } else {
      res.status(404).json({ error: 'Score not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar un puntaje
exports.deleteScore = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ScoresModel.destroy({ where: { tdb_id: id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Score not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Querys Especiales

exports.getLeadGlobal = async (req, res) => {
  const { bet_id } = req.params;

  try {
    const query = `
      SELECT tdb_usr, usr_user, SUM(tdb_usr_score) AS fix_usr_score,
             DENSE_RANK() OVER (PARTITION BY tdb_bet ORDER BY SUM(tdb_usr_score) DESC) AS fix_usr_rank
      FROM trn_det_bet
      LEFT JOIN cat_users ON usr_id = tdb_usr
      WHERE tdb_bet = ${bet_id} AND tdb_master = 0 AND usr_stat = 13
      GROUP BY tdb_usr
      ORDER BY fix_usr_score DESC;
    `;

    const [results] = await sequelize.query(query);
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllIndex = async (req, res) => {
  try {
    const query = `
      SELECT tdb_id, tdb_master, tdb_bet, bet_name, tdb_phs,
             phs_name, phs_sub, tdb_local_tms, t2.tms_name AS local_name, tdb_local_score,
             tdb_visit_tms, t3.tms_name AS visit_name, tdb_visit_score, tdb_usr, usr_user, tdb_usr_score
      FROM trn_det_bet
      LEFT JOIN trn_bets ON bet_id = tdb_bet
      LEFT JOIN sys_phases ON phs_id = tdb_phs
      LEFT JOIN cat_users ON usr_id = tdb_usr
      LEFT JOIN cat_teams t2 ON t2.tms_id = tdb_local_tms
      LEFT JOIN cat_teams t3 ON t3.tms_id = tdb_visit_tms
      WHERE tdb_master >= 1
      ORDER BY tdb_usr ASC;
    `;

    const [results] = await sequelize.query(query);

    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.predictionByUserId = async (req, res) => {
  const { userId } = req;

  try {
    const query = `
      SELECT tdb_id, tdb_bet, tdb_phs, bet_name, phs_name, phs_sub, tdb_usr, tdb_master,
             tdb_local_tms, t2.tms_name AS local_name, t2.tms_flag AS local_flag, tdb_local_score,
             tdb_visit_tms, t3.tms_name AS visit_name, t3.tms_flag AS visit_flag, tdb_visit_score
      FROM trn_det_bet
      LEFT JOIN trn_bets ON bet_id = tdb_bet
      LEFT JOIN sys_phases ON phs_id = tdb_phs
      LEFT JOIN cat_teams t2 ON t2.tms_id = tdb_local_tms
      LEFT JOIN cat_teams t3 ON t3.tms_id = tdb_visit_tms
      WHERE tdb_master = 0 AND tdb_usr = ${userId}
        AND tdb_local_score IS NOT NULL
        AND tdb_visit_score IS NOT NULL
      ORDER BY tdb_phs DESC, tdb_id ASC;
    `;

    const [results] = await sequelize.query(query);
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.predictionsEndByUserId = async (req, res) => {
  const { userId } = req;

  try {
    const query = `
    SELECT
        tdb.tdb_id,
        tdb.tdb_bet,
        tdb.tdb_phs,
        bet_name,
        phs_name,
        phs_sub,
        tdb.tdb_usr,
        tdb.tdb_master,
        tdb.tdb_local_tms,
        t2.tms_name AS local_name,
        t2.tms_flag AS local_flag,
        tdb.tdb_local_score,
        tdb.tdb_visit_tms,
        t3.tms_name AS visit_name,
        t3.tms_flag AS visit_flag,
        tdb.tdb_visit_score,
        root.tdb_id AS root_id,
        root.tdb_bet AS root_bet,
        root.tdb_phs AS root_phs,
        root.tdb_usr AS root_usr,
        root.tdb_local_score AS root_local_score,
        root.tdb_visit_score AS root_visit_score
    FROM
      trn_det_bet tdb
    LEFT JOIN
      trn_bets ON bet_id = tdb.tdb_bet
    LEFT JOIN
      sys_phases ON phs_id = tdb.tdb_phs
    LEFT JOIN
      cat_teams t2 ON t2.tms_id = tdb.tdb_local_tms
    LEFT JOIN
      cat_teams t3 ON t3.tms_id = tdb.tdb_visit_tms
    LEFT JOIN
      trn_det_bet root ON
        root.tdb_local_tms = tdb.tdb_local_tms AND
        root.tdb_visit_tms = tdb.tdb_visit_tms AND
        root.tdb_phs = tdb.tdb_phs AND
        root.tdb_usr = 1
    WHERE
      tdb.tdb_master = 0
      AND tdb.tdb_usr = ${userId}
      AND tdb.tdb_visit_score IS NOT NULL
      AND tdb.tdb_local_score IS NOT NULL
      AND tdb.tdb_local_tms IS NOT NULL
      AND tdb.tdb_visit_tms IS NOT NULL
    ORDER BY
      tdb.tdb_phs DESC, tdb.tdb_id ASC;
    `;

    const [results] = await sequelize.query(query);
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNewScores = async (req, res) => {
  const { userId } = req;

  try {
    const query = `
      SELECT tdb_id, tdb_bet, tdb_phs, bet_name, phs_name, phs_sub, tdb_usr, tdb_master,
             tdb_local_tms, t2.tms_name AS local_name, t2.tms_flag AS local_flag, tdb_local_score,
             tdb_visit_tms, t3.tms_name AS visit_name, t3.tms_flag AS visit_flag, tdb_visit_score
      FROM trn_det_bet
      LEFT JOIN trn_bets ON bet_id = tdb_bet
      LEFT JOIN sys_phases ON phs_id = tdb_phs
      LEFT JOIN cat_teams t2 ON t2.tms_id = tdb_local_tms
      LEFT JOIN cat_teams t3 ON t3.tms_id = tdb_visit_tms
      WHERE tdb_master = 1
        AND tdb_local_score IS NULL
        AND tdb_visit_score IS NULL
      ORDER BY tdb_phs DESC, tdb_id ASC;
    `;

    const [results] = await sequelize.query(query);
    console.log("🚀 ~ exports.getNewScores= ~ results:", results)

    if (results[0]?.tdb_phs) {
      const resultsPhs = await ScoresModel.findOne({
        where: {
          tdb_usr: userId,
          tdb_phs: results[0]?.tdb_phs
        }
      });

      if (resultsPhs) {
        return res.json([]);
      }
    }

    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.setScores = async (req, res) => {
  try {
    const query = `
      SELECT tdb_id, tdb_bet, tdb_phs, bet_name, phs_name, phs_sub, tdb_usr, tdb_master,
             tdb_local_tms, t2.tms_name AS local_name, t2.tms_flag AS local_flag, tdb_local_score,
             tdb_visit_tms, t3.tms_name AS visit_name, t3.tms_flag AS visit_flag, tdb_visit_score
      FROM trn_det_bet
      LEFT JOIN trn_bets ON bet_id = tdb_bet
      LEFT JOIN sys_phases ON phs_id = tdb_phs
      LEFT JOIN cat_teams t2 ON t2.tms_id = tdb_local_tms
      LEFT JOIN cat_teams t3 ON t3.tms_id = tdb_visit_tms
      WHERE tdb_master = 1
      ORDER BY tdb_phs DESC, tdb_id ASC;
    `;

    const [results] = await sequelize.query(query);
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controlador para obtener los resultados por fase
exports.getLeadByPhase = async (req, res) => {
  // Obtener los parámetros bet_id y phs_id desde la solicitud
  const { bet_id, phs_id } = req.params;

  try {
    // Definir la consulta SQL
    const query = `
      SELECT tdb_usr, usr_user, SUM(tdb_usr_score) AS fix_usr_score,
      DENSE_RANK() OVER (PARTITION BY tdb_bet ORDER BY SUM(tdb_usr_score) DESC) AS fix_usr_rank
      FROM trn_det_bet
      LEFT JOIN cat_users ON usr_id = tdb_usr
      WHERE tdb_bet = :bet_id AND tdb_phs = :phs_id AND tdb_master = 0 AND usr_stat = 13
      GROUP BY tdb_usr
      ORDER BY fix_usr_score DESC`;

    // Ejecutar la consulta con Sequelize y reemplazar los parámetros
    const results = await sequelize.query(query, {
      replacements: { bet_id, phs_id },
      type: sequelize.QueryTypes.SELECT
    });

    // Responder con los resultados
    res.json(results);
  } catch (err) {
    // Manejo de errores y respuesta en caso de error
    res.status(400).json({ error: err.message });
  }
};

// exports.getScores = async (req, res) => {
//   const { bet_id, phs_id } = req.params; 

//   try {
//     const query = `
//       SELECT tdb_usr, usr_user, SUM(tdb_usr_score) AS fix_usr_score,
//       DENSE_RANK() OVER (PARTITION BY tdb_bet ORDER BY SUM(tdb_usr_score) DESC) AS fix_usr_rank
//       FROM trn_det_bet 
//       LEFT JOIN cat_users ON usr_id = tdb_usr
//       WHERE tdb_bet = :bet_id AND tdb_phs = :phs_id AND tdb_master = 0 AND usr_stat = 13
//       GROUP BY tdb_usr 
//       ORDER BY fix_usr_score DESC`;

//     const scores = await sequelize.query(query, {
//       replacements: { bet_id, phs_id },
//       type: sequelize.QueryTypes.SELECT
//     });

//     res.json(scores);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
