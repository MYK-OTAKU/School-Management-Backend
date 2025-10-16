const path = require('path');
const { Sequelize } = require('sequelize');

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'test') {
  const testEnvPath = path.resolve(__dirname, '..', '.env.test');
  require('dotenv').config({ path: testEnvPath, override: true });
} else {
  require('dotenv').config();
}

const dbType = (process.env.DB_TYPE || (NODE_ENV === 'test' ? 'sqlite' : 'postgres')).toLowerCase();

let sequelize;

const ensurePgModule = () => {
  try {
    require('pg');
  } catch (error) {
    console.error('Erreur de chargement du module pg, tentative de correction...', error);
    try {
      const { execSync } = require('child_process');
      execSync('npm install pg --no-save', { stdio: 'ignore' });
      console.log('Module pg installé en runtime');
    } catch (installError) {
      console.error('Impossible d\'installer le module pg dynamiquement:', installError);
      throw installError;
    }
  }
};

switch (dbType) {
  case 'sqlite': {
    const storage = process.env.SQLITE_PATH || ':memory:';
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage,
      logging: false
    });
    break;
  }
  case 'postgres': {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    ensurePgModule();
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: NODE_ENV === 'test'
        ? {}
        : {
            ssl: {
              require: true,
              rejectUnauthorized: false
            },
            timezone: '+00:00'
          },
      logging: false
    });
    break;
  }
  case 'mysql':
  case 'mariadb': {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: dbType,
      logging: false
    });
    break;
  }
  default:
    throw new Error(`Unsupported DB_TYPE configuration: ${dbType}`);
}

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connexion ${dbType} établie avec succès.`);
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
    throw error;
  }
};

module.exports = { sequelize, initDb };