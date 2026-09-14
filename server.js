const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Root test route
app.get('/', (req, res) => {
    res.send('Rofiqul Mart Backend is Running Successfully!');
});

// MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://saygenrt_db_user:0Leyr7AqYa4M30CF@cluster0.k2eu3gh.mongodb.net/rofiqul_mart?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('Database connection error:', err));

const productSchema = new mongoose.Schema({
    name: String, category: String, price: Number, oldPrice: Number,
    rating: { type: Number, default: 5.0 }, reviews: { type: Number, default: 1 },
    image: String, desc: String, createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    customerName: String, phone: String, address: String,
    items: [{ productId: String, name: String, price: Number, qty: Number }],
    subtotal: Number, deliveryCharge: Number, grandTotal: Number,
    status: { type: String, default: 'Pending' }, createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// API Routes
app.get('/api/products', async (req, res) => {
    try { 
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products); 
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, orderId: newOrder._id });
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
});

app.get('/api/orders', async (req, res) => {
    try { 
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders); 
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
