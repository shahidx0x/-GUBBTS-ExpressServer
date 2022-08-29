const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 4000;
const app = express();
require("dotenv").config();

//MIDDLEWARE SETUP

app.use(cors());
app.use(express.json());

// SERVER STATUS

app.get("/", (req, res) => {
  res.status(200).send("Server Running [OK]");
});
app.listen(port, () => {
  console.log("[*] Listening to port ", port);
});

//MONGODB CONNECTION AND CONFIGUREING API

const uri = `mongodb+srv://practice:ISlz3WEfWEIrIGjT@cluster0.wzlrk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


client.connect(err => {
    async function run() {
        try {
            await client.connect();
            const database = client.db("project-101-doctor");
            const busLocation = database.collection("busone");
            const users = database.collection("users");

            //Get busone

            app.get("/busone", async (req, res) => {
                res.send(await busLocation.find({}).toArray());
            });

            //Admin checking

            app.get("/users/:email", async (req, res) => {
                const usr = await users.fineOne({ email: req.params.email });
                let isAdmin = false;
                usr?.role === "admin" ? isAdmin = true : isAdmin;
                res.json({ admin: isAdmin });
            })

            //PUT Bus Location

            app.put("/busone/:busName/:long/:lat", async (req, res) => {
                res.json(await busLocation.updateOne(
                    { busName: req.params.busName },
                    { long: req.params.long, lat: req.params.lat },
                    {upsert:true}
                ));
            });
        } finally {
        }
    }
    run().catch(console.dir);
});
