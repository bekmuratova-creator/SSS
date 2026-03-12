const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/taskdb')
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => console.log(' DB Connection Error:', err.message));


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/', (req, res) => {
  res.send('<h1>Сервер запущен и работает!</h1>');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Сервер стартовал на http://localhost:${PORT}`);
});