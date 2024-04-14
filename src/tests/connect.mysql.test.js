const mysql = require("mysql2");

// create a connection to pool server
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "michael",
  port: "8811",
  database: "shopDEV",
});

const batchSize = 100000;
const totalSize = 1_000_000;

let currentId = 1;

console.time("----------insertBatch--------");
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = Math.floor(Math.random() * 100);
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd("----------insertBatch--------");
    pool.end((err) => {
      if (err) throw err;
      console.log("Pool has been closed successfully!");
    });
    return;
  }

  const sql = "INSERT INTO users (id, name, age, address) VALUES ?";
  pool.query(sql, [values], async (err, results) => {
    if (err) throw err;
    console.log(`Inserted: ${results.affectedRows} rows`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);
