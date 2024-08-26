const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectToDB = require("./configs/db");
const eventRouter = require("./Routes/eventRoutes");
const auth = require("./middlewares/auth");
const userRouter = require("./Routes/userRoutes");
const cors = require("cors");
const { swaggerUi, swaggerDocs } = require("./configs/jsdoc");
const logger = require("./logs/logs");
require("dotenv").config();
const socketIo = require('socket.io');
const http = require('http');

const Port = process.env.PORT;
const DB = process.env.MONGODB_URL;
const app = express();

const server = http.createServer(app);

const io = socketIo(server);

let pollData = {
  question: "what is your favorite programming language?",
  options: {JavaScript: 0, Python: 0, Ruby:0},
}

let questions = [];
let feedbackList = [];

io.on('connection', (socket)=>{
  console.log("A user connnected:", socket.id);

  socket.emit('pollData', pollData);

  socket.on('vote', (vote)=>{
    pollData.options[vote.option]++;
    io.emit('pollData', pollData);
  })

})


//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// app.use(express.static( "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes

// app.use("/", (req, res)=>{
//     res.send('This is a Application')
// })

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );
// app.use(morgan("combined", { stream: accessLogStream }));

app.use("/api", auth, eventRouter);
app.use("/users", userRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

io.on('connection', (socket)=>{
  console.log('A user is connected');
})

// console.log(Port)
app.listen(Port, async () => {
  try {
    await connectToDB(DB);
    console.log("Successfully connected with database");
    console.log(`Server is running on http://localhost:${Port}`);
  } catch (err) {
    logger.log('error', err.message)
    console.log(err);
  }
});
