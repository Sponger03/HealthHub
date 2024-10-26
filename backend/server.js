//node server.js
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const session = require('express-session');
const bodyParser = require('body-parser');
const apiRoutes = require('./api');


const app = express();
app.use(cors({ origin: 'http://192.168.69.198:3000', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use('/api', apiRoutes);



const config = {
    user: 'sa',
    password: 'haslo123',
    server: '192.168.69.198',
    database: 'HealthHub',
    options: {
      trustServerCertificate: true,
      enableArithAbort: true,
    },
  };

  app.use(session({
    secure: false,
    resave: false,
    saveUninitialized: false,
    secret: 'moj-sekret-sesji'
  }));
  
  async function connect() {
    try {
      await sql.connect(config);
      console.log('Połączono z DB');
    } catch (err) {
      console.error('Error w połączeniu z DB:', err.message);
    }
  }
  
  connect();

  const bcrypt = require('bcrypt');

  app.post('/user/register', async (req, res) => {
    const { email, haslo } = req.body;
    try {
      const pool = await sql.connect(config);
  
      const checkUserQuery = `SELECT * FROM users WHERE email = @email`;
      const checkUserResult = await pool.request().input('email', sql.VarChar, email).query(checkUserQuery);
  
      if (checkUserResult.recordset.length > 0) {
        return res.status(400).json({ error: 'Podany użytkownik już istnieje' });
      }
      const hashedPassword = await bcrypt.hash(haslo, 10);
  
      const insertUserQuery = `INSERT INTO users (email, haslo) VALUES (@email, @hashedPassword)`;
      await pool.request().input('email', sql.VarChar, email).input('hashedPassword', sql.VarChar, hashedPassword).query(insertUserQuery);
  
      return res.status(200).json({ message: 'Zarejestrowano użytkownika' });
    } catch (error) {
      return res.status(500).json({ error: 'Błąd rejestracji' });
    }
  });

  app.post('/user/login', async (req, res) => {
    if(req.session.user){return res.status(400).json({ error: 'Jesteś już zalogowany' });}
    const { email, haslo } = req.body;
    try {
      const pool = await sql.connect(config);
  
      const result = await pool.request().input('email', sql.VarChar, email).query('SELECT * FROM users WHERE email = @email');
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Użytkownik nie istnieje' });
      }
  
      const hashedPasswordFromDB = result.recordset[0].haslo;
  
      const isPasswordMatch = await bcrypt.compare(haslo, hashedPasswordFromDB);
  
      if (isPasswordMatch) {
        req.session.user = result.recordset[0].email;
        req.session.save(function (err) {
          if (err) return next(err);
          res.status(200).json({ message: 'Zalogowano pomyślnie' });
        });
      } else {
        return res.status(401).json({ message: 'Błędne hasło' });
      }
    } catch (error) {
      console.error('Błąd logowania użytkownika:', error.message);
      return res.status(500).json({ message: 'Wystąpił błąd logowania użytkownika' });
    }
  });

  app.get('/user/info', (req, res) => {
    const userEmail = req.session.user;
    if (userEmail) {
      res.status(200).json({ email: userEmail });
    } else {
      res.status(401).json({ error: 'Nie zalogowany' });
    }
  });

  app.post('/user/logout', (req, res) => {
    if (req.session.user) {
      delete req.session.user;
      res.status(200).json({ message: 'Wylogowano pomyślnie.' });
    } else {
      res.status(404).json({ error: 'Nie znaleziono aktywnej sesji.' });
    }
  });


  app.post('/data/dieta', async (req, res) => {
    const { email } = req.body;
  
    try {
      const pool = await sql.connect(config);
      const getUserIdQuery = `SELECT id FROM users WHERE email = @email`;
      const getUserIdResult = await pool.request().input('email', sql.VarChar, email).query(getUserIdQuery);
      const userId = getUserIdResult.recordset[0].id;
  
      const getDietaQuery = `SELECT Dieta FROM data WHERE user_id = @userId`;
      const getDietaResult = await pool.request().input('userId', sql.Int, userId).query(getDietaQuery);
      const proposedCalories = getDietaResult.recordset[0].Dieta;

      return res.status(200).json({ proposedCalories });
    } catch (error) {
      console.error('Błąd przetwarzania proponowanej diety:', error.message);
      return res.status(500).json({ error: 'Wystąpił błąd przetwarzania proponowanej diety' });
    }
  });


  app.post('/data/info', async (req, res) => {
    const { email, waga, wzrost, wiek, plec } = req.body;
  
    try {
      if (!email || !waga || !wzrost || !wiek || !plec) {
        return res.status(400).json({ error: 'Brak wymaganych danych' });
      }
  
      const pool = await sql.connect(config);
      
      const getUserIdQuery = `SELECT id FROM users WHERE email = @email`;
      const getUserIdResult = await pool.request().input('email', sql.VarChar, email).query(getUserIdQuery);
  
      const userId = getUserIdResult.recordset[0].id;
  
      const checkDataEntryQuery = `SELECT * FROM data WHERE user_id = @userId`;
      const checkDataEntryResult = await pool.request().input('userId', sql.Int, userId).query(checkDataEntryQuery);
  
      if (checkDataEntryResult.recordset.length > 0) {
        const updateDataQuery = `UPDATE data SET waga = @waga, wiek = @wiek, wzrost = @wzrost, plec = @plec WHERE user_id = @userId`;
        await pool.request().input('userId', sql.Int, userId).input('waga', sql.Decimal, waga).input('wiek', sql.Int, wiek).input('wzrost', sql.Decimal, wzrost).input('plec', sql.VarChar, plec).query(updateDataQuery);
      } else {
        const insertDataQuery = `INSERT INTO data (user_id, waga, wiek, wzrost, plec, Dieta) VALUES (@userId, @waga, @wiek, @wzrost, @plec, -1)`;
        await pool.request().input('userId', sql.Int, userId).input('waga', sql.Decimal, waga).input('wiek', sql.Int, wiek).input('wzrost', sql.Decimal, wzrost).input('plec', sql.VarChar, plec).query(insertDataQuery);
      }
      let proposedCalories = 0;
      if (plec === 'male') {
        proposedCalories = 10 * waga + 6.25 * wzrost - 5 * wiek + 5;
      } else {
        proposedCalories = 10 * waga + 6.25 * wzrost - 5 * wiek - 161;
      }

      const insertDietaQuery = `UPDATE data SET Dieta = @proposedCalories WHERE user_id = @userId`;
      await pool.request().input('userId', sql.Int, userId).input('proposedCalories', sql.Int, proposedCalories).query(insertDietaQuery);
  
      return res.status(200).json({ proposedCalories });
    } catch (error) {
      console.error('Błąd podczas zapisywania informacji:', error.message);
      return res.status(500).json({ error: 'Błąd podczas zapisywania informacji' });
    }
  });


  app.post('/data/zapis', async (req, res) => {
    const { email, calories } = req.body;
    if (!calories) {
        return res.status(400).json({ error: 'Kalorie nie mogą być puste' });
    }
    try {
        const pool = await sql.connect(config);

        const getUserIdQuery = `SELECT id FROM users WHERE email = @email`;
        const getUserIdResult = await pool.request().input('email', sql.VarChar, email).query(getUserIdQuery);

        const userId = getUserIdResult.recordset[0].id;

        const checkUserCaloriesQuery = `SELECT * FROM userCalories WHERE user_id = @userId`;
        const checkUserCaloriesResult = await pool.request().input('userId', sql.Int, userId).query(checkUserCaloriesQuery);

        if (checkUserCaloriesResult.recordset.length > 0) {
            const currentCalories = checkUserCaloriesResult.recordset[0].dailyCalories;
            const updatedCalories = currentCalories ? `${currentCalories},${calories}` : calories.toString();
            const updateCaloriesQuery = `UPDATE userCalories SET dailyCalories = @updatedCalories WHERE user_id = @userId`;
            await pool.request().input('updatedCalories', sql.NVarChar, updatedCalories).input('userId', sql.Int, userId).query(updateCaloriesQuery);
        } else {
            const insertCaloriesQuery = `INSERT INTO userCalories (user_id, dailyCalories) VALUES (@userId, @calories)`;
            await pool.request().input('userId', sql.Int, userId).input('calories', sql.NVarChar, calories.toString()).query(insertCaloriesQuery);
        }
        return res.status(200).json({ message: 'Kalorie zapisane' });
    } catch (error) {
        console.error('Błąd podczas zapisywania kalorii:', error.message);
        return res.status(500).json({ error: 'Błąd zapisywania kalorii' });
    }
});

app.post('/data/odczyt', async (req, res) => {
    const { email } = req.body;
    try {
        const pool = await sql.connect(config);
        const getUserIdQuery = `SELECT id FROM users WHERE email = @email`;
        const getUserIdResult = await pool.request().input('email', sql.VarChar, email).query(getUserIdQuery);
        const userId = getUserIdResult.recordset[0].id;

        const getUserCaloriesQuery = `SELECT dailyCalories FROM userCalories WHERE user_id = @userId`;
        const result = await pool.request().input('userId', sql.Int, userId).query(getUserCaloriesQuery);
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Użytkownik nie ma zapisanych kalorii' });
        }
        const dailyCalories = result.recordset[0].dailyCalories;
        const caloriesArray = dailyCalories.split(',').map(Number);
        return res.status(200).json(caloriesArray);
    } catch (error) {
        console.error('Błąd odczytywania kalorii:', error.message);
        return res.status(500).json({ error: 'Błąd odczytywania kalorii' });
    }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});