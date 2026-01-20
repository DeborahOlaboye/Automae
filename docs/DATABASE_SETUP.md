# PostgreSQL Database Setup for Automae

This guide will help you set up PostgreSQL for Automae.

---

## Quick Setup (5 minutes)

### Option 1: Install PostgreSQL (Recommended)

#### macOS
```bash
# Install via Homebrew
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Create database
createdb automae_dev
```

#### Ubuntu/Debian
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user and database
sudo -u postgres createuser -s $USER
createdb automae_dev
```

#### Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run installer (use default port 5432)
3. Remember the password you set for 'postgres' user
4. Open pgAdmin or command line
5. Create database: `CREATE DATABASE automae_dev;`

### Option 2: Use Postgres.app (macOS - Easiest)

1. Download from https://postgresapp.com/
2. Install and run the app
3. Click "Initialize" to start PostgreSQL
4. Open terminal and run:
   ```bash
   createdb automae_dev
   ```

### Option 3: Docker (All Platforms)

```bash
# Run PostgreSQL in Docker
docker run -d \
  --name automae-postgres \
  -e POSTGRES_DB=automae_dev \
  -e POSTGRES_USER=automae \
  -e POSTGRES_PASSWORD=automae_pass \
  -p 5432:5432 \
  postgres:14

# Test connection
docker exec -it automae-postgres psql -U automae -d automae_dev
```

---

## Configure Backend

### Update backend/.env

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=automae_dev
DB_USER=postgres          # or your username
DB_PASSWORD=              # set if needed

# For Docker setup, use:
# DB_USER=automae
# DB_PASSWORD=automae_pass
```

---

## Verify Setup

### Test Database Connection

```bash
# Test via psql
psql -h localhost -U postgres -d automae_dev -c "SELECT version();"

# Or for Docker
docker exec -it automae-postgres psql -U automae -d automae_dev -c "SELECT version();"
```

Expected output:
```
PostgreSQL 14.x on ...
```

### Test with Backend

```bash
cd backend
npm run dev
```

Expected log output:
```
[info]: Initializing database connection...
[info]: Database connection established successfully
[info]: Database models synchronized
[info]: Automae Backend Server running on port 3001
```

---

## Database Schema

Automae will auto-create these tables on first run:

### Tables Created:
- `users` - User accounts
- `assets` - Asset records (mirrors on-chain data)
- `agents` - Agent deployment records
- `transactions` - Transaction cache
- `events` - Blockchain event logs
- `agent_executions` - Agent run history

### Auto-Sync:
- Development: Tables auto-update with model changes
- Production: Use migrations (coming later)

---

## Common Issues

### Issue: "database does not exist"
```bash
# Create the database
createdb automae_dev

# Or via SQL
psql -U postgres -c "CREATE DATABASE automae_dev;"
```

### Issue: "role does not exist"
```bash
# Create your user
sudo -u postgres createuser -s $USER

# Or create specific user
sudo -u postgres createuser -s automae
```

### Issue: "password authentication failed"
```bash
# Update backend/.env with correct password
DB_PASSWORD=your_actual_password

# Or reset postgres password
sudo -u postgres psql
postgres=# ALTER USER postgres PASSWORD 'newpassword';
```

### Issue: "could not connect to server"
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
# macOS (Homebrew):
brew services start postgresql@14

# Linux:
sudo systemctl start postgresql

# Windows: Start PostgreSQL service in Services
```

### Issue: Port 5432 already in use
```bash
# Find what's using the port
lsof -i :5432

# Stop the process or use different port in .env
DB_PORT=5433
```

---

## Optional: Database Management Tools

### pgAdmin (GUI)
- Download: https://www.pgadmin.org/
- Connect to localhost:5432
- Visual database management

### DBeaver (GUI, Cross-platform)
- Download: https://dbeaver.io/
- Free, open source
- Supports many databases

### psql (CLI)
```bash
# Connect to database
psql -d automae_dev

# List tables
\dt

# Describe table
\d assets

# Run queries
SELECT * FROM assets;

# Exit
\q
```

---

## Development Workflow

### View Database State
```bash
# Connect
psql -d automae_dev

# Check tables
\dt

# View assets
SELECT id, name, asset_type, state FROM assets;

# View agents
SELECT * FROM agent_deployments;

# Exit
\q
```

### Reset Database (if needed)
```bash
# Drop and recreate
dropdb automae_dev
createdb automae_dev

# Backend will auto-sync tables on next start
```

### Backup Database
```bash
# Backup
pg_dump automae_dev > backup.sql

# Restore
psql automae_dev < backup.sql
```

---

## Production Considerations (Post-Hackathon)

### For Production Deployment:

1. **Use Connection Pooling**
   - Already configured in `backend/src/db/index.ts`
   - Max 10 connections

2. **Enable SSL**
   ```typescript
   dialectOptions: {
     ssl: {
       require: true,
       rejectUnauthorized: false
     }
   }
   ```

3. **Use Migrations**
   ```bash
   # Install CLI
   npm install -g sequelize-cli

   # Create migration
   sequelize migration:create --name add-field

   # Run migrations
   sequelize db:migrate
   ```

4. **Use Environment-Specific Databases**
   - Development: `automae_dev`
   - Testing: `automae_test`
   - Production: `automae_prod`

---

## Quick Reference

### PostgreSQL Commands
```bash
# Create database
createdb automae_dev

# Drop database
dropdb automae_dev

# Connect
psql automae_dev

# List databases
psql -l

# Check if running
pg_isready

# Start service (Linux)
sudo systemctl start postgresql

# Start service (macOS)
brew services start postgresql@14
```

### Backend Commands
```bash
# Start backend (auto-syncs DB)
npm run dev

# Build backend
npm run build

# Run tests
npm test
```

---

## Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `automae_dev` created
- [ ] `backend/.env` configured with DB credentials
- [ ] Backend starts without database errors
- [ ] Tables auto-created on first run
- [ ] Can query database with psql

---

## Need Help?

### Quick Diagnostic
```bash
# 1. Check PostgreSQL is running
pg_isready

# 2. Check database exists
psql -l | grep automae

# 3. Test connection
psql -d automae_dev -c "SELECT 1;"

# 4. Check backend .env
cat backend/.env | grep DB_
```

If all pass, you're good to go! 🚀

---

**Next Steps:**
- [QUICKSTART.md](../QUICKSTART.md) - Start building
- [GETTING_STARTED.md](GETTING_STARTED.md) - Full setup guide
- [DATABASE_OPTIONS.md](DATABASE_OPTIONS.md) - Alternative options
