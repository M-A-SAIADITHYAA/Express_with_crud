import express from 'express'
import 'dotenv/config'
import logger from "./logger.js";
import morgan from "morgan";
const app = express()

const morganFormat = ":method :url :status :response-time ms";




const port = process.env.PORT || 3000

app.use(express.json())
app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );


let tea = []

let nextId = 1

app.post('/teas',(req,res)=>{
    logger.warn("a new tea is added")
    
    const {name,price} = req.body
    const newTea = {id : nextId++,name,price}
    tea.push(newTea)
    res.status(200).send(newTea)



})

app.get('/teas',(req,res)=>{
    res.status(200).send(tea)
    
})

app.get('/teas/:id',(req,res)  =>{
    
    const td = tea.find(t=>t.id===parseInt(req.params.id))
    if(!td){
        return res.status(404).send("not found")
    }
    return res.status(200).send(td)

})

//update the tea

app.put('/teas/:id',(req,res)=>{
    const teaId = req.params.id
    const td = tea.find(t=>t.id===parseInt(req.params.id))
    if(!td){
        return res.status(404).send("NOT found")
    }
    const {name,price} = req.body
    td.name = name
    td.price  = price
    return res.status(200).send(td)

})

//delete
app.delete('/teas/:id',(req,res)=>{
   const index =  tea.findIndex(t =>t.id ===parseInt(req.params.id))
   if(index===-1){
    return res.status(404).send('tea not found')
   }
   tea.splice(index,1)
   return res.status(200).send("SUCCESSFUL")
})
app.listen(port,()=>{
    console.log(`server is listening at ${port}`)
})