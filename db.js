const mongoose = require('mongoose');

const MONGO_URI =
  "mongodb+srv://admin:admin123@cluster0.ehpxtub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });