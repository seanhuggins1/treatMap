class Database {
    constructor(url) {
        this.url = url;
        this.Client = new require('mongodb').MongoClient;
    }

    async addTreat(Candy) {
        // add the treat to the database
        var client = this.Client;
        var url = this.url;

        return new Promise(function(resolve, reject) {
            client.connect(url, function(err, db) { // --> returns the collection of candies
                if(err != null) {
                    console.log("Error occured while connecting to client");
                    reject(err);
                };

                var dbo = db.db("Candies");
                dbo.collection("Candies").insertOne(Candy, function(err2, res) {
                    if (err2) reject(err2);
                    //console.log(res);
                    resolve(res.insertedId);
                });
            });
        });
    }

    async fetchAllTreats() {
        // fetch all the treats from the database
        var client = this.Client;
        var url = this.url;

        return new Promise(function(resolve, reject) {
            client.connect(url, function(err, db) { // --> returns the collection of candies
                if(err != null) {
                    console.log("Error occured while connecting to client");
                    reject(err);
                };
    
                var dbo = db.db("Candies");
                dbo.collection("Candies").find({}, function(err, res){
                    if(err != null) reject(err);
                    resolve(res.toArray());
                });
            });
        });
    }

    async fetchByLocation(location) {
        var client = this.Client;
        var url = this.url;

        return new Promise(function(resolve, reject) {
            client.connect(url, function(err, db) { // --> returns the collection of candies
                if(err != null) {
                    console.log("Error occured while connecting to client");
                    reject(err);
                };

                var dbo = db.db("Candies");
                dbo.collection("Candies").find({"city": location}, function(err, res){
                    if(err != null) reject(err);
                    resolve(res.toArray());
                });
            });
        });
    }
}

module.exports = Database;