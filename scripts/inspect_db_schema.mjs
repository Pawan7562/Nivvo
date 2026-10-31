import { pool } from '../server/db.js';

async function main() {
  try {
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
    console.log('--- TABLES IN NEON POSTGRESQL ---');
    for (const t of tables.rows) {
      const cols = await pool.query(
        "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name=$1 ORDER BY ordinal_position",
        [t.table_name]
      );
      const countRes = await pool.query(`SELECT COUNT(*) FROM "${t.table_name}"`);
      console.log(`\nTable: ${t.table_name} (rows: ${countRes.rows[0].count})`);
      console.log('  Columns: ' + cols.rows.map(c => `${c.column_name}:${c.data_type}`).join(', '));
    }
  } catch (err) {
    console.error('Error inspecting schema:', err);
  } finally {
    await pool.end();
  }
}

main();

