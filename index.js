const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./Routes/userRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const conversationRoute = require("./Routes/conversation");
const messageRoute = require("./Routes/message");
const path = require('path')



const app = express();
app.use(cors());
dotenv.config();

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8085;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);



app.use("/user", userRoutes);
app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);


if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, "/client/build/")))
  app.get('*', (req, res)=>{
      res.sendFile(path.join(__dirname, "/client/build/index.html"))
  }),
  function (err){
      res.status(500).send(err);
  }
}


connectDatabase().then(()=>{
  app.listen(PORT, () =>{
    console.log("listening for requests");
  })
})




