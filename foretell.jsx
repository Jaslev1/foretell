import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, AlertTriangle, Target, Filter, ExternalLink } from 'lucide-react';

// Updated mock data with current opportunities (February 2025) - ALL CATEGORIES
const MOCK_OPPORTUNITIES = [
  {
    id: 'fed-march-2025',
    title: 'Federal Reserve holds rates steady at March 2025 meeting',
    category: 'Economics',
    probability: 0.82,
    payout: 1.22,
    volume: 312000,
    riskScore: 2,
    spread: 0.07,
    expiryDays: 28,
    marketUrl: 'https://kalshi.com/markets/fed'
  },
  {
    id: 'inflation-feb-2025',
    title: 'February 2025 CPI inflation below 2.8%',
    category: 'Economics',
    probability: 0.71,
    payout: 1.41,
    volume: 198000,
    riskScore: 3,
    spread: 0.14,
    expiryDays: 12,
    marketUrl: 'https://kalshi.com/markets/inflation'
  },
  {
    id: 'nba-lakers-win',
    title: 'Lakers win next game vs Nuggets',
    category: 'Sports',
    probability: 0.58,
    payout: 1.72,
    volume: 445000,
    riskScore: 5,
    spread: 0.18,
    expiryDays: 2,
    marketUrl: 'https://kalshi.com/markets/nba'
  },
  {
    id: 'unemployment-feb-2025',
    title: 'February unemployment rate stays below 4.2%',
    category: 'Economics',
    probability: 0.79,
    payout: 1.27,
    volume: 156000,
    riskScore: 2,
    spread: 0.08,
    expiryDays: 8,
    marketUrl: 'https://kalshi.com/markets/unemployment'
  },
  {
    id: 'super-bowl-chiefs',
    title: 'Chiefs win Super Bowl LIX',
    category: 'Sports',
    probability: 0.64,
    payout: 1.56,
    volume: 892000,
    riskScore: 4,
    spread: 0.16,
    expiryDays: 7,
    marketUrl: 'https://kalshi.com/markets/superbowl'
  },
  {
    id: 'btc-110k-feb',
    title: 'Bitcoin exceeds $110,000 by end of February 2025',
    category: 'Crypto',
    probability: 0.58,
    payout: 1.72,
    volume: 428000,
    riskScore: 5,
    spread: 0.18,
    expiryDays: 2,
    marketUrl: 'https://kalshi.com/markets/btc'
  },
  {
    id: 'oscars-oppenheimer',
    title: 'Oppenheimer wins Best Picture at 2025 Oscars',
    category: 'Entertainment',
    probability: 0.73,
    payout: 1.37,
    volume: 234000,
    riskScore: 3,
    spread: 0.13,
    expiryDays: 45,
    marketUrl: 'https://kalshi.com/markets/oscars'
  },
  {
    id: 'nvidia-q4-earnings',
    title: 'NVIDIA Q4 2024 earnings exceed analyst estimates',
    category: 'Stocks',
    probability: 0.69,
    payout: 1.45,
    volume: 389000,
    riskScore: 4,
    spread: 0.15,
    expiryDays: 6,
    marketUrl: 'https://kalshi.com/markets/nvda'
  },
  {
    id: 'nfl-draft-qb',
    title: 'Quarterback selected first in 2025 NFL Draft',
    category: 'Sports',
    probability: 0.81,
    payout: 1.23,
    volume: 567000,
    riskScore: 2,
    spread: 0.07,
    expiryDays: 89,
    marketUrl: 'https://kalshi.com/markets/nfldraft'
  },
  {
    id: 'jobs-report-feb',
    title: 'February 2025 jobs report exceeds 180k new jobs',
    category: 'Economics',
    probability: 0.76,
    payout: 1.32,
    volume: 223000,
    riskScore: 3,
    spread: 0.11,
    expiryDays: 9,
    marketUrl: 'https://kalshi.com/markets/jobs'
  },
  {
    id: 'weather-nyc-snow',
    title: 'NYC receives 6+ inches of snow in February',
    category: 'Weather',
    probability: 0.52,
    payout: 1.92,
    volume: 178000,
    riskScore: 6,
    spread: 0.22,
    expiryDays: 4,
    marketUrl: 'https://kalshi.com/markets/weather'
  },
  {
    id: 'sp500-6000',
    title: 'S&P 500 closes above 6,000 in February 2025',
    category: 'Stocks',
    probability: 0.64,
    payout: 1.56,
    volume: 278000,
    riskScore: 4,
    spread: 0.16,
    expiryDays: 3,
    marketUrl: 'https://kalshi.com/markets/spx'
  },
  {
    id: 'march-madness-acc',
    title: 'ACC team wins NCAA March Madness 2025',
    category: 'Sports',
    probability: 0.42,
    payout: 2.38,
    volume: 423000,
    riskScore: 7,
    spread: 0.28,
    expiryDays: 62,
    marketUrl: 'https://kalshi.com/markets/marchmadness'
  },
  {
    id: 'eth-4000',
    title: 'Ethereum reaches $4,000 by end of February',
    category: 'Crypto',
    probability: 0.52,
    payout: 1.92,
    volume: 294000,
    riskScore: 6,
    spread: 0.22,
    expiryDays: 1,
    marketUrl: 'https://kalshi.com/markets/eth'
  },
  {
    id: 'trump-approval',
    title: 'Trump approval rating above 45% in February',
    category: 'Politics',
    probability: 0.61,
    payout: 1.64,
    volume: 512000,
    riskScore: 5,
    spread: 0.19,
    expiryDays: 15,
    marketUrl: 'https://kalshi.com/markets/approval'
  },
  {
    id: 'tesla-deliveries-q1',
    title: 'Tesla Q1 2025 deliveries exceed 450k vehicles',
    category: 'Stocks',
    probability: 0.61,
    payout: 1.64,
    volume: 267000,
    riskScore: 5,
    spread: 0.19,
    expiryDays: 45,
    marketUrl: 'https://kalshi.com/markets/tsla'
  },
  {
    id: 'grammy-taylor',
    title: 'Taylor Swift wins Album of the Year at Grammys',
    category: 'Entertainment',
    probability: 0.68,
    payout: 1.47,
    volume: 389000,
    riskScore: 4,
    spread: 0.15,
    expiryDays: 3,
    marketUrl: 'https://kalshi.com/markets/grammys'
  },
  {
    id: 'oil-85',
    title: 'WTI crude oil exceeds $85/barrel in March 2025',
    category: 'Other',
    probability: 0.48,
    payout: 2.08,
    volume: 189000,
    riskScore: 6,
    spread: 0.24,
    expiryDays: 32,
    marketUrl: 'https://kalshi.com/markets/oil'
  },
  {
    id: 'nba-all-star-mvp',
    title: 'Western Conference player wins All-Star MVP',
    category: 'Sports',
    probability: 0.55,
    payout: 1.82,
    volume: 334000,
    riskScore: 6,
    spread: 0.20,
    expiryDays: 14,
    marketUrl: 'https://kalshi.com/markets/allstar'
  },
  {
    id: 'housing-feb',
    title: 'February 2025 housing starts exceed 1.5M annually',
    category: 'Economics',
    probability: 0.57,
    payout: 1.75,
    volume: 134000,
    riskScore: 5,
    spread: 0.21,
    expiryDays: 18,
    marketUrl: 'https://kalshi.com/markets/housing'
  },
  {
    id: 'midterm-senate',
    title: 'Democrats gain Senate seats in 2026 midterms',
    category: 'Politics',
    probability: 0.49,
    payout: 2.04,
    volume: 678000,
    riskScore: 6,
    spread: 0.23,
    expiryDays: 280,
    marketUrl: 'https://kalshi.com/markets/midterms'
  },
  {
    id: 'apple-vision-sales',
    title: 'Apple Vision Pro sales exceed 500k units in 2024',
    category: 'Tech',
    probability: 0.43,
    payout: 2.33,
    volume: 203000,
    riskScore: 7,
    spread: 0.27,
    expiryDays: 60,
    marketUrl: 'https://kalshi.com/markets/apple'
  },
  {
    id: 'premier-league-city',
    title: 'Manchester City wins Premier League 2024-25',
    category: 'Sports',
    probability: 0.72,
    payout: 1.39,
    volume: 456000,
    riskScore: 3,
    spread: 0.13,
    expiryDays: 95,
    marketUrl: 'https://kalshi.com/markets/premierleague'
  },
  {
    id: 'meta-q4',
    title: 'Meta Q4 2024 revenue exceeds $40B',
    category: 'Tech',
    probability: 0.73,
    payout: 1.37,
    volume: 256000,
    riskScore: 3,
    spread: 0.13,
    expiryDays: 5,
    marketUrl: 'https://kalshi.com/markets/meta'
  },
  {
    id: 'weather-california-rain',
    title: 'California receives above-average rainfall in February',
    category: 'Weather',
    probability: 0.66,
    payout: 1.52,
    volume: 212000,
    riskScore: 4,
    spread: 0.17,
    expiryDays: 10,
    marketUrl: 'https://kalshi.com/markets/carain'
  },
  {
    id: 'retail-sales-feb',
    title: 'February retail sales growth exceeds 0.8%',
    category: 'Economics',
    probability: 0.66,
    payout: 1.52,
    volume: 176000,
    riskScore: 4,
    spread: 0.17,
    expiryDays: 14,
    marketUrl: 'https://kalshi.com/markets/retail'
  },
  {
    id: 'box-office-dune',
    title: 'Dune Part 3 announcement by end of Q1 2025',
    category: 'Entertainment',
    probability: 0.38,
    payout: 2.63,
    volume: 189000,
    riskScore: 8,
    spread: 0.31,
    expiryDays: 67,
    marketUrl: 'https://kalshi.com/markets/dune'
  },
  {
    id: 'google-gemini',
    title: 'Google Gemini Ultra reaches 50M users by March',
    category: 'Tech',
    probability: 0.54,
    payout: 1.85,
    volume: 198000,
    riskScore: 6,
    spread: 0.20,
    expiryDays: 30,
    marketUrl: 'https://kalshi.com/markets/google'
  },
  {
    id: 'mlb-opening-day',
    title: 'MLB Opening Day 2025 happens before April 1',
    category: 'Sports',
    probability: 0.84,
    payout: 1.19,
    volume: 223000,
    riskScore: 2,
    spread: 0.06,
    expiryDays: 58,
    marketUrl: 'https://kalshi.com/markets/mlb'
  },
  {
    id: 'sol-150',
    title: 'Solana exceeds $150 by end of February 2025',
    category: 'Crypto',
    probability: 0.49,
    payout: 2.04,
    volume: 234000,
    riskScore: 6,
    spread: 0.23,
    expiryDays: 2,
    marketUrl: 'https://kalshi.com/markets/sol'
  },
  {
    id: 'congress-budget',
    title: 'Congress passes budget before March 1st deadline',
    category: 'Politics',
    probability: 0.71,
    payout: 1.41,
    volume: 423000,
    riskScore: 3,
    spread: 0.14,
    expiryDays: 29,
    marketUrl: 'https://kalshi.com/markets/budget'
  },
  {
    id: 'gdp-q1-2025',
    title: 'U.S. Q1 2025 GDP growth exceeds 2.0%',
    category: 'Economics',
    probability: 0.78,
    payout: 1.28,
    volume: 211000,
    riskScore: 2,
    spread: 0.09,
    expiryDays: 55,
    marketUrl: 'https://kalshi.com/markets/gdp'
  },
  {
    id: 'nhl-trade-deadline',
    title: 'Major trade happens before NHL trade deadline',
    category: 'Sports',
    probability: 0.76,
    payout: 1.32,
    volume: 289000,
    riskScore: 3,
    spread: 0.11,
    expiryDays: 35,
    marketUrl: 'https://kalshi.com/markets/nhltrade'
  },
  {
    id: 'amazon-prime-day',
    title: 'Amazon Prime Day 2025 revenue exceeds $14B',
    category: 'Stocks',
    probability: 0.68,
    payout: 1.47,
    volume: 187000,
    riskScore: 4,
    spread: 0.15,
    expiryDays: 120,
    marketUrl: 'https://kalshi.com/markets/amzn'
  },
  {
    id: 'temp-record-florida',
    title: 'Florida sets temperature record in February 2025',
    category: 'Weather',
    probability: 0.44,
    payout: 2.27,
    volume: 156000,
    riskScore: 7,
    spread: 0.27,
    expiryDays: 6,
    marketUrl: 'https://kalshi.com/markets/fltemp'
  },
  {
    id: 'microsoft-openai',
    title: 'Microsoft announces new OpenAI partnership in Q1',
    category: 'Tech',
    probability: 0.62,
    payout: 1.61,
    volume: 245000,
    riskScore: 5,
    spread: 0.18,
    expiryDays: 42,
    marketUrl: 'https://kalshi.com/markets/msft'
  },
  {
    id: 'streaming-netflix',
    title: 'Netflix announces major sports streaming deal',
    category: 'Entertainment',
    probability: 0.47,
    payout: 2.13,
    volume: 267000,
    riskScore: 6,
    spread: 0.25,
    expiryDays: 52,
    marketUrl: 'https://kalshi.com/markets/netflix'
  },
  {
    id: 'champions-league',
    title: 'English team wins Champions League 2024-25',
    category: 'Sports',
    probability: 0.59,
    payout: 1.69,
    volume: 378000,
    riskScore: 5,
    spread: 0.19,
    expiryDays: 108,
    marketUrl: 'https://kalshi.com/markets/ucl'
  },
  {
    id: 'gold-2200',
    title: 'Gold price exceeds $2,200/oz in February 2025',
    category: 'Other',
    probability: 0.71,
    payout: 1.41,
    volume: 167000,
    riskScore: 3,
    spread: 0.14,
    expiryDays: 7,
    marketUrl: 'https://kalshi.com/markets/gold'
  },
  {
    id: 'scotus-ruling',
    title: 'Supreme Court issues major ruling on social media law',
    category: 'Politics',
    probability: 0.53,
    payout: 1.89,
    volume: 345000,
    riskScore: 5,
    spread: 0.21,
    expiryDays: 90,
    marketUrl: 'https://kalshi.com/markets/scotus'
  },
  {
    id: 'pga-masters',
    title: 'American golfer wins 2025 Masters Tournament',
    category: 'Sports',
    probability: 0.65,
    payout: 1.54,
    volume: 234000,
    riskScore: 4,
    spread: 0.16,
    expiryDays: 72,
    marketUrl: 'https://kalshi.com/markets/masters'
  }
];

const CATEGORIES = ['All', 'Economics', 'Stocks', 'Crypto', 'Tech', 'Sports', 'Politics', 'Weather', 'Entertainment', 'Other'];
const EXPIRY_FILTERS = [
  { value: 'all', label: 'All Timeframes' },
  { value: '3', label: '3 days or less' },
  { value: '7', label: '7 days or less' },
  { value: '10', label: '10 days or less' },
  { value: '14', label: '14 days or less' },
  { value: 'more', label: 'More than 14 days' }
];
const SORT_OPTIONS = [
  { value: 'risk', label: 'Risk Score (Low to High)' },
  { value: 'volume', label: 'Volume (High to Low)' },
  { value: 'probability', label: 'Probability (High to Low)' },
  { value: 'payout', label: 'Payout (High to Low)' }
];

const ForetellApp = () => {
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('risk');
  const [isLiveData, setIsLiveData] = useState(false);

  // Fetch live Kalshi data from Vercel serverless function
  const fetchKalshiData = async () => {
    setLoading(true);
    
    try {
      // Call Vercel API endpoint
      const response = await fetch('/api/kalshi-markets');
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.opportunities && data.opportunities.length > 0) {
        setOpportunities(data.opportunities);
        setIsLiveData(true);
        console.log(`Loaded ${data.opportunities.length} live opportunities from Kalshi`);
      } else {
        // Fallback to mock data
        setOpportunities(MOCK_OPPORTUNITIES);
        setIsLiveData(false);
      }
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setOpportunities(MOCK_OPPORTUNITIES);
      setIsLiveData(false);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchKalshiData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchKalshiData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter and sort opportunities
  const filteredOpportunities = opportunities
    .filter(opp => {
      // Category filter
      if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
        return false;
      }
      
      // Expiry filter
      if (expiryFilter !== 'all') {
        if (expiryFilter === '3' && opp.expiryDays > 3) return false;
        if (expiryFilter === '7' && opp.expiryDays > 7) return false;
        if (expiryFilter === '10' && opp.expiryDays > 10) return false;
        if (expiryFilter === '14' && opp.expiryDays > 14) return false;
        if (expiryFilter === 'more' && opp.expiryDays <= 14) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'risk':
          if (a.riskScore !== b.riskScore) return a.riskScore - b.riskScore;
          return b.volume - a.volume;
        case 'volume':
          return b.volume - a.volume;
        case 'probability':
          return b.probability - a.probability;
        case 'payout':
          return b.payout - a.payout;
        default:
          return 0;
      }
    });

  // Calculate stats
  const stats = {
    totalOpportunities: filteredOpportunities.length,
    highConfidence: filteredOpportunities.filter(o => o.volume > 200000 && o.spread < 0.10).length,
    lowRisk: filteredOpportunities.filter(o => o.riskScore <= 3).length
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      fontFamily: "'Poppins', -apple-system, sans-serif",
      color: '#ffffff'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '1.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Target size={32} color="#00ff88" strokeWidth={2.5} />
              <h1 style={{
                margin: 0,
                fontSize: '2rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
                Foretell
              </h1>
            </div>
            
            <button
              onClick={fetchKalshiData}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: loading ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 255, 136, 0.1)',
                border: '1px solid',
                borderColor: loading ? 'rgba(255, 255, 255, 0.1)' : '#00ff88',
                borderRadius: '8px',
                color: loading ? '#666' : '#00ff88',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            >
              <RefreshCw size={16} style={{
                animation: loading ? 'spin 1s linear infinite' : 'none'
              }} />
              Refresh
            </button>
          </div>

          <p style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1rem',
            color: '#999',
            maxWidth: '800px'
          }}>
            Real-time prediction market scanner for high-confidence, low-risk betting opportunities on Kalshi
          </p>

          {/* Live/Demo indicator */}
          {!isLiveData && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 200, 0, 0.1)',
              border: '1px solid rgba(255, 200, 0, 0.3)',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#ffc800'
            }}>
              <AlertTriangle size={16} />
              <span>Demo Mode - Deploy to Vercel to enable live data (see setup instructions)</span>
            </div>
          )}

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'rgba(0, 255, 136, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#00ff88' }}>
                {stats.totalOpportunities}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.25rem' }}>
                Total Opportunities
              </div>
            </div>
            
            <div style={{
              background: 'rgba(0, 204, 255, 0.05)',
              border: '1px solid rgba(0, 204, 255, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#00ccff' }}>
                {stats.highConfidence}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.25rem' }}>
                High Confidence
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 200, 0, 0.05)',
              border: '1px solid rgba(255, 200, 0, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffc800' }}>
                {stats.lowRisk}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.25rem' }}>
                Low Risk
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
            Last updated: {lastUpdate.toLocaleTimeString()} {isLiveData ? '• Live Data' : '• Demo Data'}
          </div>
        </div>
      </header>

      {/* Controls */}
      <div style={{
        maxWidth: '1400px',
        margin: '2rem auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="#999" />
            <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: 500 }}>Category:</span>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1rem',
                  background: selectedCategory === cat ? '#00ff88' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? '#00ff88' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: selectedCategory === cat ? '#000' : '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: 500 }}>Days to Expiry:</span>
              <select
                value={expiryFilter}
                onChange={(e) => setExpiryFilter(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {EXPIRY_FILTERS.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: 500 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredOpportunities.map((opp, idx) => (
            <div
              key={opp.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                transition: 'all 0.3s',
                cursor: 'pointer',
                animation: `fadeIn 0.5s ease ${idx * 0.05}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = '#00ff88';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Category & Risk Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.75rem',
                    background: 'rgba(0, 255, 136, 0.15)',
                    color: '#00ff88',
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    {opp.category}
                  </span>
                  
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.75rem',
                    background: opp.expiryDays <= 3 ? 'rgba(255, 100, 100, 0.15)' : 
                                opp.expiryDays <= 7 ? 'rgba(255, 200, 0, 0.15)' : 'rgba(100, 150, 255, 0.15)',
                    color: opp.expiryDays <= 3 ? '#ff6464' : 
                           opp.expiryDays <= 7 ? '#ffc800' : '#6496ff',
                    borderRadius: '4px'
                  }}>
                    {opp.expiryDays}d
                  </span>
                </div>
                
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.75rem',
                  background: opp.riskScore <= 3 ? 'rgba(0, 255, 136, 0.15)' : 
                              opp.riskScore <= 6 ? 'rgba(255, 200, 0, 0.15)' : 'rgba(255, 100, 100, 0.15)',
                  color: opp.riskScore <= 3 ? '#00ff88' : 
                         opp.riskScore <= 6 ? '#ffc800' : '#ff6464',
                  borderRadius: '4px'
                }}>
                  Risk: {opp.riskScore}/10
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                margin: '0 0 1.25rem 0',
                fontSize: '1.05rem',
                fontWeight: 600,
                lineHeight: 1.4,
                color: '#fff',
                minHeight: '3rem'
              }}>
                {opp.title}
              </h3>

              {/* Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>
                    Probability
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00ccff' }}>
                    {(opp.probability * 100).toFixed(0)}%
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>
                    Payout
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffc800' }}>
                    {opp.payout.toFixed(2)}x
                  </div>
                </div>
              </div>

              {/* Volume */}
              <div style={{
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '6px',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>
                  Trading Volume
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={16} color="#00ff88" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                    ${(opp.volume / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* Trade Button */}
              <a
                href={opp.marketUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.875rem',
                  background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  letterSpacing: '0.02em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 255, 136, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Trade on Kalshi
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default ForetellApp;
