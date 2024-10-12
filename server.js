const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const scoresRoutes = require('./routes/scoresRoutes');
const betsRoutes = require('./routes/betsRoutes');
const phasesRoutes = require('./routes/phasesRoutes')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log("🚀 ~ PORT:", PORT)


// const corsOptions = {
//   origin: 'http://localhost:4200',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], 
//   allowedHeaders: ['Content-Type', 'Authorization'], 
// };

// app.use(cors(corsOptions));

app.use(cors());

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/scores', scoresRoutes);
app.use('/bets', betsRoutes);
app.use('/phases', phasesRoutes);

sequelize.authenticate().then(() => {
  console.log('Conexión a la base de datos establecida');
  app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
}).catch(err => console.error('No se pudo conectar a la base de datos:', err));
