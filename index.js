const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000; 
const app = express();

app.use(cors());
app.use(express.json()); 

const uri = "mongodb+srv://studymate:xjuoblE80axfB27G@itnabil.agyee9s.mongodb.net/?appName=ItNabil";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const db = client.db("StudyMateDB");
    const partnerCollection = db.collection("partners");
    const connectionCollection = db.collection("connections");

    app.post('/partners', async (req, res) => {
      const profile = req.body;
      const result = await partnerCollection.insertOne(profile);
      res.send(result);
    });

    app.get('/partners', async (req, res) => {
      const { search, sort } = req.query;
      let query = {};
      if (search) {
        query.subject = { $regex: search, $options: 'i' };
      }
      let options = {};
      if (sort === 'Expert') {
        options = { sort: { experienceLevel: -1 } }; 
      } else if (sort === 'Beginner') {
        options = { sort: { experienceLevel: 1 } }; 
      }
      const result = await partnerCollection.find(query, options).toArray();
      res.send(result);
    });

    app.get('/partner/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await partnerCollection.findOne(query);
      res.send(result);
    });

    // app.post('/connections', async (req, res) => {
    //   try {
    //     const { partnerId, ...connectionData } = req.body;
    //     const filter = { _id: new ObjectId(partnerId) };
    //     const updateDoc = { $inc: { partnerCount: 1 } };
    //     await partnerCollection.updateOne(filter, updateDoc);
    //     const doc = { partnerId: new ObjectId(partnerId), ...connectionData, createdAt: new Date() };
    //     const result = await connectionCollection.insertOne(doc);
    //     res.send(result);
    //   } catch (err) {
    //     res.status(500).send({ error: err.message });
    //   }
    // });

    // app.get('/my-connections/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const query = { senderEmail: email };
    //   const result = await connectionCollection.find(query).toArray();
    //   res.send(result);
    // });

    // app.delete('/connection/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await connectionCollection.deleteOne(query);
    //   res.send(result);
    // });

    console.log("Connected to MongoDB!");
  } finally {}
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('StudyMate Server is running...');
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});