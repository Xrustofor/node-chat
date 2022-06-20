require('dotenv').config()

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const UserController = require('./controllers/user-controler')


const sequelize = require('./utils/database');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const router = require('./route/index.js')
const errorMidleware = require('./middlewares/error-middleware');

const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();


app.use(cors());



app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);
app.use(errorMidleware);

app.use(express.static('public', {
  extensions: ['htm', 'html'],
  index: false,
}));

app.use( async (req, res, next) => {
  await res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const Chat = require('./socket/index.js');
const chat = new Chat();


io.on('connection', async socket => {
  
  console.log(`user ${socket.id} is connected.`);

  socket.on('infoUser', data => {
    data.socket_id = socket.id;
    chat.addUser(data);
    socket.emit('users', chat.getUsers());
    socket.broadcast.emit('users', chat.getUsers());
    socket.broadcast.emit('enter', {
      id: data.id,
      socket_id: socket.id,
      login: data.login,
      text: `підєднався до чату`
    });
  })

  socket.on('message', data => {
    socket.broadcast.emit('message', data);
  });

  socket.on('privateMessage', data => {
    socket.to(data.respondent.socket_id).emit("privateMessage", data);
  });

  socket.on('disconnect', () => {
    chat.deleteUser(socket.id);
    console.log(`user ${socket.id} left.`);

    socket.emit('users', chat.getUsers());
    socket.broadcast.emit('users', chat.getUsers());
  })
})


const start = async () => {
    try {
      await sequelize.sync();

      server.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`)
      })
    } catch (e) {
      console.log(e)
    }
  }

start();
