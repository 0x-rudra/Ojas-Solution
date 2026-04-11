const fs = require('fs');
fetch('http://localhost:3000/api/test')
  .then(r => r.json())
  .then(d => fs.writeFileSync('test_output.json', JSON.stringify(d, null, 2)))
  .catch(console.error);
