const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Modelo de Usuario
const UsersModel = sequelize.define('Users', {
  usr_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usr_user: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  usr_mail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  usr_pass: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 12],
    },
  },
  usr_pfl: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
  usr_stat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
}, {
  tableName: 'cat_users',
  timestamps: false,
});

// Modelo Score
const ScoresModel = sequelize.define('Scores', {
  tdb_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  tdb_master: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tdb_bet: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tdb_phs: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tdb_local_tms: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tdb_local_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tdb_visit_tms: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tdb_visit_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tdb_usr: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tdb_usr_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'trn_det_bet',
  timestamps: false,
});

// Modelo Bets
const BetsModel = sequelize.define('Bets', {
  bet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bet_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isAlphanumeric: true,
    },
  },
  bet_ini_dt: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  bet_end_dt: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  bet_phs: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
  bet_usr: {
    type: DataTypes.INTEGER,
    references: {
      model: 'cat_users',
      key: 'usr_id',
    },
  },
  bet_stat: {
    type: DataTypes.INTEGER,
    references: {
      model: 'sys_status',
      key: 'stat_id',
    },
  },
}, {
  tableName: 'trn_bets',
  timestamps: false,
  underscored: true,
});

// Modelo Phase
const PhasesModel = sequelize.define('Phases', {
  phs_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  phs_name: {
    type: DataTypes.STRING(30),
    allowNull: true, 
  },
  phs_sub: {
    type: DataTypes.STRING(30),
    allowNull: true, 
  },
}, {
  tableName: 'sys_phases',
  timestamps: false,
});


// Relaciones
UsersModel.hasMany(BetsModel, { as: 'bets', foreignKey: 'bet_usr' });
BetsModel.belongsTo(UsersModel, { foreignKey: 'bet_usr' });

UsersModel.hasMany(ScoresModel, { as: 'scores', foreignKey: 'tdb_usr' });
ScoresModel.belongsTo(UsersModel, { foreignKey: 'tdb_usr' });

BetsModel.hasMany(ScoresModel, { as: 'scores', foreignKey: 'tdb_bet' });
ScoresModel.belongsTo(BetsModel, { foreignKey: 'tdb_bet' });

// Sincronizar la base de datos
sequelize.sync({ force: false }).then(() => {
  console.log('Base de datos sincronizada');
});

module.exports = { UsersModel, ScoresModel, BetsModel, PhasesModel, sequelize };
