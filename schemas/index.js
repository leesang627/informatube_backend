const mongoose = require('mongoose');

module.exports = () => {
  const connect = () => {
    if(process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    mongoose.connect('mongodb://woogler:dltkd627@localhost:27017/admin', {
      dbName: 'informatube',
    }, (error) => {
      if(error) {
        console.log('Informatube DB Connect Error', error);
      } else {
        console.log('Informatube DB Connect Success');
      }
    });
  };

  connect();
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB Connection Error', error);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Connection Failed. Retry to Connect.');
    connect();
  })
  require('./user');
  require('./infostamp');
}