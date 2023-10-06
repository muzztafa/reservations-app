const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');

const admin = require('firebase-admin');

const serviceAccount = require('./reservations-7857e-firebase-adminsdk-6374g-7e12d36e00.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://your-project-id.firebaseio.com',
});
const db = admin.firestore();
module.exports = db;