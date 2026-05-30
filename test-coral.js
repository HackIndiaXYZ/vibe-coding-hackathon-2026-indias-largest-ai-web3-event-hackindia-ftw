const { execFile } = require('child_process');

execFile(
  'D:\\coral.exe',
  ['sql', '--format', 'json', "SELECT number, title FROM github.pulls WHERE owner = 'expressjs' AND repo = 'express' AND state = 'closed' LIMIT 3"],
  { 
    timeout: 30000,
    shell: false,
    env: process.env
  },
  (error, stdout, stderr) => {
    console.log('error:', error?.message);
    console.log('stdout:', stdout?.slice(0, 300));
    console.log('stderr:', stderr?.slice(0, 300));
  }
);

console.log('Process started...');