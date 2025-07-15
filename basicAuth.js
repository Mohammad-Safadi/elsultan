// basicAuth.js

/**
 * Express middleware for HTTP Basic Authentication.
 * Usage:
 *   const basicAuth = require('./basicAuth');
 *   app.use(basicAuth);
 */
function basicAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const expectedUser = 'admin';
  const expectedPass = 'secret123';

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');

  if (username === expectedUser && password === expectedPass) {
    return next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.status(401).send('Authentication failed');
  }
}

module.exports = basicAuth; 