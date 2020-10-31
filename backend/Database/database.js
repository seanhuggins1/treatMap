class Databse {
    constructor(url) {
        this.MongoClient = require('mongodb').MongoClient;
        this.url = url;
    }

    addTreat(Candy) {
        // add the treat to the database
        this.MongoClient.connect(url, function(err, db) { // --> returns error object
            if(err != null) {
                console.log("error");
                return null;
            }
            var dbo = client.db("Project0");
            var result = await dbo.collection("Candies").insertOne(Candy);

            if(!result.acknowledged) return null;
            return result.insertedId;
        });
    }

    fetchAllTreats() {
        // fetch all the treats from the database
        this.MongoClient.connect(url, function(err, db) { // --> returns the collection of candies
            if(err != null) return {};

            var dbo = client.db("Project0");
            var allCandies = dbo.collection("Candies").find({}).toArray();

            return allCandies;
        });
    }

    fetchByLocation(location) {
        // fetch treats by location
        this.MongoClient.connect(url, function(err, db) { // --> returns the collection of candies
            if(err != null) return {};

            var dbo = client.db("Project0");
            var candiesByLoc = dbo.collection("Candies").find({"city": location}).toArray();

            return candiesByLoc;
        });
    }
}