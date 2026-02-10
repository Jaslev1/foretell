// api/kalshi-markets.js
// Vercel Serverless Function to fetch Kalshi markets

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const KALSHI_API_BASE = 'https://api.elections.kalshi.com/trade-api/v2';
    
    // Fetch markets from Kalshi
    const response = await fetch(`${KALSHI_API_BASE}/markets?limit=1000&status=open`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Kalshi API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process markets
    const opportunities = processMarkets(data.markets || []);
    
    res.status(200).json({ 
      success: true,
      opportunities,
      count: opportunities.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching Kalshi data:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

function processMarkets(markets) {
  return markets
    .filter(m => {
      // Must have pricing data
      if (!m.yes_bid || !m.yes_ask) return false;
      
      // Filter out extremely wide spreads
      const spread = (m.yes_ask - m.yes_bid) / 100;
      if (spread > 0.35) return false;
      
      return true;
    })
    .map(m => {
      const midpoint = (m.yes_bid + m.yes_ask) / 2;
      const probability = midpoint / 100;
      const spread = (m.yes_ask - m.yes_bid) / 100;
      
      // Calculate days to expiry
      const expiryDate = new Date(m.close_time);
      const now = new Date();
      const expiryDays = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)));
      
      return {
        id: m.ticker,
        title: m.title.replace(/^yes\s+/i, '').trim(),
        category: categorizeMarket(m.ticker, m.title),
        probability,
        payout: probability > 0 ? 1 / probability : 0,
        volume: m.volume || 0,
        riskScore: calculateRiskScore(m, spread, probability),
        spread,
        expiryDays,
        marketUrl: m.market_url || `https://kalshi.com/markets/${m.ticker.toLowerCase()}`
      };
    })
    .sort((a, b) => {
      // Sort by risk score first, then volume
      if (a.riskScore !== b.riskScore) return a.riskScore - b.riskScore;
      return b.volume - a.volume;
    })
    .slice(0, 100); // Top 100 opportunities
}

function categorizeMarket(ticker, title) {
  const t = (ticker + ' ' + title).toLowerCase();
  
  // Sports
  if (t.includes('nba') || t.includes('nfl') || t.includes('mlb') || t.includes('nhl') ||
      t.includes('lakers') || t.includes('chiefs') || t.includes('super bowl') ||
      t.includes('march madness') || t.includes('ncaa') || t.includes('premier league') ||
      t.includes('champions league') || t.includes('world cup') || t.includes('masters') ||
      t.includes('pga') || t.includes('ufc') || t.includes('boxing')) return 'Sports';
  
  // Economics
  if (t.includes('fed') || t.includes('gdp') || t.includes('inflation') || 
      t.includes('cpi') || t.includes('unemployment') || t.includes('jobs') ||
      t.includes('treasury') || t.includes('housing') || t.includes('retail sales')) return 'Economics';
  
  // Crypto
  if (t.includes('btc') || t.includes('bitcoin') || t.includes('eth') || 
      t.includes('ethereum') || t.includes('crypto') || t.includes('sol') ||
      t.includes('solana') || t.includes('coinbase')) return 'Crypto';
  
  // Stocks
  if (t.includes('nvda') || t.includes('nvidia') || t.includes('tsla') || 
      t.includes('tesla') || t.includes('stock') || t.includes('earnings') ||
      t.includes('aapl') || t.includes('apple') || t.includes('amzn') ||
      t.includes('meta') || t.includes('msft') || t.includes('s&p')) return 'Stocks';
  
  // Tech
  if (t.includes('ai ') || t.includes('google') || t.includes('microsoft') || 
      t.includes('tech') || t.includes('software') || t.includes('openai') ||
      t.includes('chatgpt') || t.includes('gemini')) return 'Tech';
  
  // Politics
  if (t.includes('election') || t.includes('congress') || t.includes('senate') ||
      t.includes('president') || t.includes('trump') || t.includes('biden') ||
      t.includes('democrat') || t.includes('republican') || t.includes('scotus') ||
      t.includes('supreme court') || t.includes('approval')) return 'Politics';
  
  // Weather
  if (t.includes('weather') || t.includes('temperature') || t.includes('snow') ||
      t.includes('rain') || t.includes('hurricane') || t.includes('storm')) return 'Weather';
  
  // Entertainment
  if (t.includes('oscar') || t.includes('grammy') || t.includes('emmy') ||
      t.includes('movie') || t.includes('box office') || t.includes('netflix') ||
      t.includes('streaming') || t.includes('taylor swift')) return 'Entertainment';
  
  return 'Other';
}

function calculateRiskScore(market, spread, probability) {
  const { volume = 0 } = market;
  
  let risk = 5; // Start at medium risk
  
  // Volume adjustments
  if (volume > 200000) risk -= 2;
  else if (volume > 100000) risk -= 1;
  else if (volume < 20000) risk += 2;
  else if (volume < 50000) risk += 1;
  
  // Spread adjustments (tighter = lower risk)
  if (spread < 0.05) risk -= 1;
  else if (spread < 0.10) risk -= 0.5;
  else if (spread > 0.25) risk += 2;
  else if (spread > 0.15) risk += 1;
  
  // Probability extremes (very confident markets)
  if (probability > 0.85 || probability < 0.15) risk -= 1;
  else if (probability > 0.75 || probability < 0.25) risk -= 0.5;
  else if (probability > 0.45 && probability < 0.55) risk += 1; // Coin flip
  
  return Math.max(1, Math.min(10, Math.round(risk)));
}
