const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

(async () => {
  const users = [
    { name: 'Alice Nguyen', email: 'alice@example.com', password: 'password123' },
    { name: 'Bob Tran', email: 'bob@example.com', password: 'hunter2' },
    { name: 'Carol Le', email: 'carol@example.com', password: 'qwerty123' },
    { name: 'David Pham', email: 'david@example.com', password: 'letmein' },
    { name: 'Eve Hoang', email: 'eve@example.com', password: 'password' }
  ];

  const lines = ['"name","email","password_hash","created_at"'];
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const created = new Date().toISOString();
    const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
    lines.push([q(u.name), q(u.email), q(hash), q(created)].join(','));
  }

  const outDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'users_sample.csv');
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log('Wrote', outPath);
})();
