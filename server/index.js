const express= require("express")
const app=express()
const mongoose =require("mongoose")
const dotenv=require("dotenv").config()
const cors=require("cors")

const authRoutes = require("./routes/auth.js")
const taskRoutes = require('./routes/task.js');
const accRoutes=require('./routes/acc.js');
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.static('public'))

app.use("/auth", authRoutes)
app.use('/api/tasks', taskRoutes);
app.use('/api/users',accRoutes);
const PORT=8001;
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>
    {
        app.listen(PORT,"0.0.0.0",()=>console.log(`Server Port: ${PORT}`));
 })
.catch((err)=>console.log(`${err} did not connect`));

