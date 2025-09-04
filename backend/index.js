const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Needed for static file paths

require('dotenv').config();
require('./Models/db');
 
//import routes 

const AuthRouter = require('./Routes/AuthRouter');
const pressReleaseRoutes = require('./Routes/pressReleaseRoutes');
const prCategoryRoutes = require('./Routes/prCategoryRoutes');
const planRoutes = require('./Routes/planRoutes');

const ProductRouter = require('./Routes/ProductRouter');
const walletRoutes = require('./Routes/walletRoutes');
const downloadPR = require("./Routes/Downloadpr")
const adminWallets =  require("./Routes/AdminWallet")



const upload = require('./Middleware/MulterConfig');

// PORT from .env or default to 5002
const PORT = process.env.PORT || 5002;

// Test route
app.get('/yash', (req, res) => {
  res.send('vyas');
});

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routers
app.use('/api/auth', AuthRouter);
app.use('/api/products', ProductRouter);
app.use('/api/press-releases', pressReleaseRoutes);
app.use('/api/pr-category', prCategoryRoutes);
app.use('/api/plan',planRoutes);
app.use('/api/wallet', walletRoutes);

app.use("/api/press-releases/download", downloadPR);
app.use("/api/admin",adminWallets)



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
