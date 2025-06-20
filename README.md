# Whisky Gaming API - All Endpoints (cURL Commands)

Base URL: `http://localhost:3000`

## 🔐 Security - Internal Access Only

This API is secured for internal use only. All endpoints require a valid API key to be included in the request headers.

### Authentication
Include your API key in one of these ways:
- **Header**: `X-API-Key: your-api-key-here`
- **Authorization**: `Authorization: Bearer your-api-key-here`

### Environment Variables
Add the following to your `.env` file:
```bash
API_KEY=your-secure-api-key-here
HELIUS_API_KEY=your-helius-api-key
SOLANA_RPC_ENDPOINT=your-solana-rpc-endpoint
PORT=3000
```

### Example Usage with API Key
```bash
# All requests must include the API key
curl -H "X-API-Key: your-api-key-here" http://localhost:3000/status

# Or using Authorization header
curl -H "Authorization: Bearer your-api-key-here" http://localhost:3000/status
```

---

## 🔄 Sync Endpoints

### Manual Sync
```bash
# Trigger manual sync to fetch latest blockchain data
curl -H "X-API-Key: your-api-key-here" -X POST http://localhost:3000/sync
```

### Sync Status
```bash
# Check sync status and database statistics
curl -H "X-API-Key: your-api-key-here" http://localhost:3000/sync/status
```

## 📊 Analytics & Statistics

### Platform Stats
```bash
# Get comprehensive platform statistics
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/stats"

# Get stats for specific creator
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/stats?creator=CREATOR_ADDRESS"

# Get stats from specific start time
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/stats?startTime=1704067200000"
```

### Individual Player Stats
```bash
# Get detailed player statistics (user is required)
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/player?user=PLAYER_WALLET_ADDRESS"

# Get player stats for specific creator
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/player?user=PLAYER_WALLET_ADDRESS&creator=CREATOR_ADDRESS"

# Get player stats for specific token
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/player?user=PLAYER_WALLET_ADDRESS&token=TOKEN_MINT_ADDRESS"
```

### Top Players Leaderboard
```bash
# Get top players by USD profit (default)
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players"

# Get top players by USD volume
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players?sortBy=usd_volume"

# Get top players by USD profit with limit
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players?sortBy=usd_profit&limit=10"

# Get top players for specific creator
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players?creator=CREATOR_ADDRESS&limit=20"

# Get top players for specific token
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players?token=TOKEN_MINT_ADDRESS&sortBy=token_profit"

# Get top players for specific pool
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players?pool=POOL_ADDRESS&sortBy=token_volume"

# Get top players with pagination
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players?limit=10&offset=20"

# Get top players from specific time
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players?startTime=1704067200000&limit=50"
```

## 🎮 Game Events & History

### Settled Games
```bash
# Get recent settled games (default: 10 games, ordered by time DESC)
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames"

# Get settled games with pagination
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?page=0&itemsPerPage=20"

# Get only jackpot wins
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?onlyJackpots=true"

# Get games for specific creator
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?creator=CREATOR_ADDRESS"

# Get games for specific pool
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?pool=POOL_ADDRESS"

# Get games for specific token
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?token=TOKEN_MINT_ADDRESS"

# Get games for specific player
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?user=PLAYER_WALLET_ADDRESS"

# Get games ordered by multiplier
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?orderBy=multiplier&sorting=DESC"

# Get games ordered by USD profit
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?orderBy=usd_profit&sorting=ASC"

# Get games with custom page size
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?itemsPerPage=50"
```

### Pool Changes
```bash
# Get recent pool liquidity changes
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/poolChanges?pool=POOL_ADDRESS"
```

## 🏢 Platform & Creator Data

### Top Platforms
```bash
# Get top platforms by volume (default: 10 platforms, 7 days)
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/platforms"

# Get top platforms with custom limit
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/platforms?limit=20"

# Get top platforms for specific time period
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/platforms?days=30"

# Get top platforms sorted by revenue
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/platforms?sortBy=usd_revenue"
```

### Platforms by Pool
```bash
# Get platforms sorted by volume for specific pool
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/platforms-by-pool?pool=POOL_ADDRESS"
```

## 💰 Token & Pool Data

### Top Tokens
```bash
# Get top tokens used by platforms
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/tokens"

# Get top tokens for specific creator
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/tokens?creator=CREATOR_ADDRESS"
```

### Pool Analytics
```bash
# Get hourly LP token price changes for pool
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/ratio?pool=POOL_ADDRESS"

# Get total volume for specific pool
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/total?pool=POOL_ADDRESS"

# Get daily volume for specific pool
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/daily?pool=POOL_ADDRESS"
```

## 📈 Chart & Time Series Data

### Daily Plays Chart
```bash
# Get daily play count chart data (last 300 days)
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/chart/plays"
```

### Daily USD Volume Chart
```bash
# Get daily USD volume chart (last 6 days)
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/chart/daily-usd"

# Get daily USD volume for specific creator
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/chart/daily-usd?creator=CREATOR_ADDRESS"
```

### DAO Fee Collection Chart
```bash
# Get daily Whisky fee collection chart (last 6 months)
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/chart/dao-usd"

# Get daily Whisky fees for specific creator
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/chart/dao-usd?creator=CREATOR_ADDRESS"
```

## ⚙️ System Status

### API Status
```bash
# Check if API is syncing blockchain data
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/status"
```

## 🔧 Example Usage with Real Data

### Quick Health Check
```bash
# Check if API is running and synced
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/status"
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/sync/status"
```

### Get Recent Activity
```bash
# Get latest games
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?itemsPerPage=5"

# Get top players
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/players?limit=5"

# Get platform stats
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/stats"
```

### Monitor Specific Pool
```bash
# Get pool volume
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/total?pool=YOUR_POOL_ADDRESS"

# Get pool daily activity
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/daily?pool=YOUR_POOL_ADDRESS"

# Get pool ratio changes
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/ratio?pool=YOUR_POOL_ADDRESS"
```

### Track Specific Player
```bash
# Get player stats
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/player?user=PLAYER_WALLET_ADDRESS"

# Get player's recent games
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?user=PLAYER_WALLET_ADDRESS&itemsPerPage=10"
```

## 📝 Response Examples

### Sync Status Response
```json
{
  "success": true,
  "data": {
    "totalSignatures": 1250,
    "totalGames": 1200,
    "totalPoolChanges": 50,
    "latestUpdate": {
      "signature": "abc123...",
      "blockTime": 1705312200,
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    "lastSync": "2024-01-15T10:35:00.000Z"
  }
}
```

### Stats Response
```json
{
  "players": 150,
  "usd_volume": 50000.50,
  "plays": 1200,
  "creators": 5,
  "revenue_usd": 2500.25,
  "player_net_profit_usd": -1500.75,
  "active_players": 25,
  "first_bet_time": 1704067200000
}
```

### Settled Games Response
```json
{
  "results": [
    {
      "signature": "abc123...",
      "wager": "1000000000",
      "payout": "1500000000",
      "usd_wager": 1.0,
      "usd_profit": 0.5,
      "profit": "500000000",
      "user": "PLAYER_ADDRESS",
      "creator": "CREATOR_ADDRESS",
      "token": "TOKEN_ADDRESS",
      "jackpot": "0",
      "multiplier": 1.5,
      "time": 1705312200000
    }
  ],
  "total": 1200
}
```

## 🚀 Quick Start Commands

```bash
# 1. Start the API
pnpm dev

# 2. Check sync status
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/sync/status"

# 3. Trigger manual sync
curl -H "X-API-Key: your-api-key-here" -X POST "http://localhost:3000/sync"

# 4. Get platform stats
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/stats"

# 5. Get recent games
curl -H "X-API-Key: your-api-key-here" "http://localhost:3000/events/settledGames?itemsPerPage=5"
```