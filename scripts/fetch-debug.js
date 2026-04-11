const fs = require('fs');
fetch('http://localhost:3000/api/seed')
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
    console.log('Saved to output.json');
  })
  .catch(console.error);
