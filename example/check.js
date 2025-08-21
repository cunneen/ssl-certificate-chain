  const https = require('https')
  const options = {
    hostname: 'mt.com',
    port: 443,
    path: '/',
    method: 'GET',
    timeout: 5000,
    // Necessary self-signed certificate.
    //ca: [ fs.readFileSync('/usr/local/share/ca-certificates/SSL_CA.crt') ]
  }

    https.get(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
  }).on('error', (e) => {
    console.error(e);
  });
