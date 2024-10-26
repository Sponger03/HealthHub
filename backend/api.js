const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPEN_FOOD_FACTS_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
const USER_AGENT = 'HealthHub/1.0 (mcd@vip.onet.pl)';

router.post('/food/search', async (req, res) => {
    const { query } = req.body;
    try {
      const response = await axios.get(OPEN_FOOD_FACTS_URL, {
        headers: {
          'User-Agent': USER_AGENT,
        },
        params: {
          search_terms: query,
          search_simple: 1,
          action: 'process',
          json: 1,
        },
      });
  
      res.json(response.data.products);
    } catch (error) {
      console.error('Błąd pobierania danych produktu:', error);
      res.status(500).json({ error: 'Błąd pobierania danych produktu' });
    }
  });
  
module.exports = router;