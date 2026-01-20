# Database Options for Automae

## Question: Do I need a database?

**Short Answer:** Not PostgreSQL specifically. You have better options for a hackathon MVP.

---

## Option 1: SQLite (RECOMMENDED for Hackathon) ⭐

### Why SQLite is Perfect Here:

✅ **Zero Setup** - No server to install or configure
✅ **Single File** - Database is just a file (easy backup/deploy)
✅ **Portable** - Works everywhere Node.js works
✅ **Fast Enough** - More than sufficient for hackathon scale
✅ **Same API** - Sequelize works with SQLite (minimal code changes)

### Implementation

**1. Add SQLite to package.json:**
```bash
cd backend
npm install sqlite3
```

**2. Update backend/src/db/index.ts:**
```typescript
import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';
import path from 'path';

// Use SQLite for development/demo
const dbPath = path.join(__dirname, '../../data/automae.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: (msg) => logger.debug(msg),
});

export async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established (SQLite)');

    // Auto-sync models
    await sequelize.sync({ alter: true });
    logger.info('Database models synchronized');
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
}
```

**3. Create data directory:**
```bash
mkdir backend/data
```

**4. Update .gitignore:**
```
backend/data/*.sqlite
backend/data/*.sqlite-journal
```

### Pros:
- ✅ No PostgreSQL installation needed
- ✅ Perfect for demo/hackathon
- ✅ Easy to backup (just copy the file)
- ✅ Works on any machine
- ✅ Can upgrade to PostgreSQL later

### Cons:
- ⚠️ Not for high-concurrency production
- ⚠️ Single-writer limitation
- ⚠️ Less powerful than PostgreSQL

---

## Option 2: JSON File Storage (Minimal DB)

### For Absolute Minimum Setup:

Store agent state and cache in JSON files. Blockchain is source of truth.

```typescript
// backend/src/db/filestore.ts
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');

export class FileStore {
  async save(key: string, data: any): Promise<void> {
    const filePath = path.join(DATA_DIR, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async load(key: string): Promise<any> {
    try {
      const filePath = path.join(DATA_DIR, `${key}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
}
```

### What to Store:
- Agent last execution times
- Cached blockchain events
- User preferences (if any)

### Pros:
- ✅ Zero dependencies
- ✅ Human-readable
- ✅ Simple to implement

### Cons:
- ❌ No transactions
- ❌ No complex queries
- ❌ Manual concurrency handling
- ❌ Not scalable

---

## Option 3: No Database (Blockchain Only)

### Store Everything On-Chain + In-Memory

**On-Chain (Smart Contracts):**
- Asset registry
- Transactions
- Dividends
- Ownership

**In-Memory (Node.js):**
- Agent state (lost on restart)
- Cache (rebuilt from blockchain)

### Implementation:
```typescript
// backend/src/cache/memory.ts
class MemoryCache {
  private agents = new Map();

  setAgentState(agentId: string, state: any) {
    this.agents.set(agentId, state);
  }

  getAgentState(agentId: string) {
    return this.agents.get(agentId);
  }
}
```

### Pros:
- ✅ Simplest setup
- ✅ No database to maintain

### Cons:
- ❌ Data lost on restart
- ❌ Slow (must query blockchain)
- ❌ Expensive (RPC calls cost gas/rate limits)
- ❌ No offline capability

---

## Recommendation for Automae Hackathon

### Use SQLite! Here's Why:

1. **Demo-Friendly**
   - No setup required from judges
   - "Just run npm install && npm start"
   - Database travels with the code

2. **Development Speed**
   - Same code as PostgreSQL (Sequelize)
   - Easy to test
   - Can upgrade later

3. **Sufficient for Hackathon Scale**
   - Handles 1000s of records easily
   - Fast enough for demo
   - Reliable

4. **Professional Enough**
   - Still using proper ORM
   - Still have migrations
   - Shows good architecture

---

## Implementation Guide: Switch to SQLite

### Step 1: Install SQLite
```bash
cd backend
npm install sqlite3
```

### Step 2: Update db/index.ts
```typescript
import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const usePostgres = process.env.USE_POSTGRES === 'true';

// Use PostgreSQL in production (if specified), SQLite otherwise
export const sequelize = usePostgres ?
  new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'automae_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
  }) :
  new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../data/automae.sqlite'),
    logging: (msg) => logger.debug(msg),
  });

export async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info(`Database connected: ${usePostgres ? 'PostgreSQL' : 'SQLite'}`);

    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized');
    }
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}
```

### Step 3: Update .env
```bash
# Use SQLite by default (no DB setup needed!)
USE_POSTGRES=false

# Optional: PostgreSQL (if you want it later)
# USE_POSTGRES=true
# DB_HOST=localhost
# DB_NAME=automae_dev
# DB_USER=postgres
# DB_PASSWORD=your_password
```

### Step 4: Create data directory
```bash
mkdir -p backend/data
echo "*.sqlite" >> backend/data/.gitignore
echo "*.sqlite-journal" >> backend/data/.gitignore
```

### Step 5: Test it
```bash
cd backend
npm run dev
# ✅ Database connected: SQLite
# ✅ Database models synchronized
```

---

## What Data Actually Needs Persistence?

### Critical (Need Database):
- ✅ **Agent execution history** - When agents last ran
- ✅ **Agent state** - Current status, next run time
- ✅ **Event cache** - Cached blockchain events for performance
- ✅ **API cache** - Reduce RPC calls

### Optional (Nice to Have):
- ⚠️ User accounts - Only if you add authentication
- ⚠️ Notifications - Could just send immediately
- ⚠️ Analytics - Can calculate on-demand

### Doesn't Need DB (On-Chain):
- ❌ Assets - Stored in AssetRegistry contract
- ❌ Transactions - Stored in AssetTreasury contract
- ❌ Dividends - Stored in DividendDistribution contract
- ❌ Ownership - ERC20 token balances

---

## Final Recommendation

### For Hackathon MVP:

**Use SQLite** with this simple setup:

```bash
# Install SQLite
npm install sqlite3

# Update one file (db/index.ts)
# Set USE_POSTGRES=false in .env
# Done! No PostgreSQL needed.
```

### Benefits:
- ✅ Agent state persists across restarts
- ✅ Fast performance (local file)
- ✅ Zero configuration for demo
- ✅ Professional architecture maintained
- ✅ Can upgrade to PostgreSQL in 5 minutes if needed

### After Hackathon:
If you win and want to scale:
- Change `USE_POSTGRES=true`
- Install PostgreSQL
- Same code works!

---

## Conclusion

**Answer: No, you don't need PostgreSQL.**

**Better Answer: Use SQLite instead - same benefits, zero setup.**

Would you like me to implement the SQLite version for you?
