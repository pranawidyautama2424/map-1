const fs = require('fs');
const code = fs.readFileSync('js/data.js', 'utf8');
eval(code.replace('const TOURISM_DESTINATIONS', 'global.TOURISM_DESTINATIONS'));

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'` + String(str).replace(/'/g, `''`) + `'`;
}

let sql = `-- ========================================================\n`;
sql += `-- SUPABASE DATABASE SCHEMA & SEED DATA\n`;
sql += `-- Proyek: JelajahNusantara (Peta Wisata NTT)\n`;
sql += `-- ========================================================\n\n`;

sql += `-- 1. Buat Tabel Destinasi Wisata\n`;
sql += `CREATE TABLE IF NOT EXISTS destinations (\n`;
sql += `    id TEXT PRIMARY KEY,\n`;
sql += `    name TEXT NOT NULL,\n`;
sql += `    region TEXT NOT NULL,\n`;
sql += `    region_label TEXT,\n`;
sql += `    category TEXT NOT NULL,\n`;
sql += `    category_color TEXT DEFAULT 'emerald',\n`;
sql += `    rating NUMERIC DEFAULT 4.5,\n`;
sql += `    reviews_count TEXT DEFAULT '1',\n`;
sql += `    ticket_price TEXT,\n`;
sql += `    opening_hours TEXT,\n`;
sql += `    location TEXT NOT NULL,\n`;
sql += `    lat DOUBLE PRECISION NOT NULL,\n`;
sql += `    lng DOUBLE PRECISION NOT NULL,\n`;
sql += `    image TEXT,\n`;
sql += `    description TEXT,\n`;
sql += `    tags JSONB DEFAULT '[]'::jsonb,\n`;
sql += `    weather JSONB DEFAULT '{}'::jsonb,\n`;
sql += `    road_condition JSONB DEFAULT '{}'::jsonb,\n`;
sql += `    traffic JSONB DEFAULT '{}'::jsonb,\n`;
sql += `    is_custom BOOLEAN DEFAULT false,\n`;
sql += `    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL\n`;
sql += `);\n\n`;

sql += `-- 2. Aktifkan Row Level Security (RLS) untuk Keamanan Publik\n`;
sql += `ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;\n\n`;

sql += `-- 3. Kebijakan Keamanan (RLS Policies)\n`;
sql += `-- Publik (pengunjung umum) HANYA BISA MEMBACA data (SELECT)\n`;
sql += `DROP POLICY IF EXISTS "Public can view destinations" ON destinations;\n`;
sql += `CREATE POLICY "Public can view destinations"\n`;
sql += `    ON destinations FOR SELECT\n`;
sql += `    TO public\n`;
sql += `    USING (true);\n\n`;

sql += `-- Hanya Admin yang login (authenticated) yang bisa menambah destinasi baru\n`;
sql += `DROP POLICY IF EXISTS "Admin can insert destinations" ON destinations;\n`;
sql += `CREATE POLICY "Admin can insert destinations"\n`;
sql += `    ON destinations FOR INSERT\n`;
sql += `    TO authenticated\n`;
sql += `    WITH CHECK (true);\n\n`;

sql += `-- Hanya Admin yang login (authenticated) yang bisa mengubah destinasi\n`;
sql += `DROP POLICY IF EXISTS "Admin can update destinations" ON destinations;\n`;
sql += `CREATE POLICY "Admin can update destinations"\n`;
sql += `    ON destinations FOR UPDATE\n`;
sql += `    TO authenticated\n`;
sql += `    USING (true);\n\n`;

sql += `-- Hanya Admin yang login (authenticated) yang bisa menghapus destinasi\n`;
sql += `DROP POLICY IF EXISTS "Admin can delete destinations" ON destinations;\n`;
sql += `CREATE POLICY "Admin can delete destinations"\n`;
sql += `    ON destinations FOR DELETE\n`;
sql += `    TO authenticated\n`;
sql += `    USING (true);\n\n`;

sql += `-- 4. Seed Data Awal (10 Destinasi Unggulan NTT)\n`;
sql += `INSERT INTO destinations (\n`;
sql += `    id, name, region, region_label, category, category_color, rating, reviews_count,\n`;
sql += `    ticket_price, opening_hours, location, lat, lng, image, description,\n`;
sql += `    tags, weather, road_condition, traffic, is_custom\n`;
sql += `) VALUES\n`;

const values = global.TOURISM_DESTINATIONS.map((d) => {
  return `(\n` +
    `    ${escapeSql(d.id)},\n` +
    `    ${escapeSql(d.name)},\n` +
    `    ${escapeSql(d.region)},\n` +
    `    ${escapeSql(d.regionLabel)},\n` +
    `    ${escapeSql(d.category)},\n` +
    `    ${escapeSql(d.categoryColor)},\n` +
    `    ${d.rating},\n` +
    `    ${escapeSql(d.reviewsCount)},\n` +
    `    ${escapeSql(d.ticketPrice)},\n` +
    `    ${escapeSql(d.openingHours)},\n` +
    `    ${escapeSql(d.location)},\n` +
    `    ${d.lat},\n` +
    `    ${d.lng},\n` +
    `    ${escapeSql(d.image)},\n` +
    `    ${escapeSql(d.description)},\n` +
    `    '${JSON.stringify(d.tags).replace(/'/g, `''`)}'::jsonb,\n` +
    `    '${JSON.stringify(d.weather).replace(/'/g, `''`)}'::jsonb,\n` +
    `    '${JSON.stringify(d.roadCondition).replace(/'/g, `''`)}'::jsonb,\n` +
    `    '${JSON.stringify(d.traffic).replace(/'/g, `''`)}'::jsonb,\n` +
    `    false\n` +
    `)`;
}).join(',\n');

sql += values + `\nON CONFLICT (id) DO UPDATE SET\n`;
sql += `    name = EXCLUDED.name,\n`;
sql += `    description = EXCLUDED.description,\n`;
sql += `    weather = EXCLUDED.weather,\n`;
sql += `    road_condition = EXCLUDED.road_condition,\n`;
sql += `    traffic = EXCLUDED.traffic;\n`;

fs.writeFileSync('supabase_schema.sql', sql, 'utf8');
console.log('supabase_schema.sql successfully created! Size:', fs.statSync('supabase_schema.sql').size);

