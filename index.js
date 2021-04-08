const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


const ObjectID = require('mongodb').ObjectID

const port = 4000


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ivvdq.mongodb.net/freshvalley1?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("freshvalley1").collection("products");
  const orderInfoCollection = client.db("freshvalley1").collection("orderinfo");
  // perform actions on the collection object

  app.get('/products', (req, res) => {
    productCollection.find()
      .toArray((err, products) => {
        res.send(products)
        //console.log(products)
      })
  })

  app.get('/buyProduct/:id', (req, res) => {
    console.log(req.params.id)
    productCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])

      })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('add new event', newProduct)
    productCollection.insertOne(newProduct)
      .then(result => {
       // console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)

      })

  })
  app.post('/orderInfo', (req, res) => {
    const newOrder = req.body;
    //console.log('add new event', newOrder)
    orderInfoCollection.insertOne(newOrder)
      .then(result => {
       // console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)

      })

    
    })
    app.delete('/Delete/:id', (req,res) => {
      productCollection.deleteOne({_id: ObjectID(req.params.id) })
      .then( result => {
        console.log(result)
      res.send(result.deletedCount>0)
      }) 
  })
  app.get('/Order', (req, res) => {
    console.log(req.query.email)
    orderInfoCollection.find({email: req.query.email})
      .toArray((err, products) => {
        res.send(products)
         
      })
  })

  console.log('database connection success')
  const uri = "mongodb+srv://freshvalley123:4r5bY9QpG7i6ZJYv@cluster0.ivvdq.mongodb.net/freshvalley1?retryWrites=true&w=majority";
});






app.listen(process.env.PORT||port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})