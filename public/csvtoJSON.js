const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('public/data.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    fs.writeFileSync('public/players.json', JSON.stringify(results, null, 2));
    console.log('CSV data converted to JSON!');
  });