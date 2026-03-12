const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


mongoose.connect('mongodb+srv://Aman_iuca:Amaniuca12345@cluster0.zvzydkx.mongodb.net/?appName=Cluster0')
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


app.post('/tasks', async (req, res) => {
  try {

    const newTask = new Task({
      title: req.body.title,
      description: req.body.description
    });
    

    const savedTask = await newTask.save();
  
    res.status(201).json(savedTask);
  } catch (error) {

    res.status(400).json({ message: 'Ошибка при создании задачи', error: error.message });
  }
});


app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});


app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); 
    
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при поиске задачи', error: error.message });
  }
});


app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    
    res.status(200).json({ message: 'Задача успешно удалена', task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении', error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Сервер стартовал на http://localhost:${PORT}`);
});