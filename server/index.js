const fs = require("fs");
const PORT= 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");

const ChartData = require("./model/data_model");
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



mongoose
  .connect('mongodb+srv://krishikesh369:D38bMRB06VUSIR2e@cluster0.b8h7cmi.mongodb.net/?retryWrites=true&w=majority', {
    
  })
  .then(async () => {
    console.log("App connected to database");

    const jsonData = JSON.parse(fs.readFileSync("jsondata.json", "utf8"));

    const existingData = await ChartData.find({});

    if (existingData.length === 0) {
      await ChartData.insertMany(jsonData);
      console.log("Data inserted into the database");
    } else {
      console.log("Data already exists in the database");
    }
  })
  .catch((error) => {
    console.log(error);
  });


app.get("/", async (req, res) => {
 try {
     const {
      endYear,
      topics,
      sector,
      region,
      pest,
      source,
      country,
      limit,
    } = req.query;


    let query = ChartData.find({});

    if (endYear) {
      query = query.where("end_year").equals(parseInt(endYear));
    }

    if (topics) {
      const topicsArray = topics.split(",");
      query = query.where("topic").in(topicsArray);
    }

    if (sector) {
      query = query.where("sector").equals(sector);
    }


    if (region) {
      query = query.where("region").equals(region);
    }

    if (pest) {
      query = query.where("pestle").equals(pest);
    }

    if (source) {
      query = query.where("source").equals(source);
    }

    if (country) {
      query = query.where("country").equals(country);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const result = await query.exec();
 
    res.status(200).json(result);
     } catch (error) {
    res.status(500).json({ error: "Error retrieving data" });
  }
   
 
});

app.listen(PORT, () => {
  console.log(`App is listening to port: http://localhost:${PORT}`);
});
