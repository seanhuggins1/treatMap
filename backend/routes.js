module.exports = function(app, db) {
    var headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    
    // simple get request to verify that it's working
    app.get('/', (req, res) => {
        res.status(200).send("It's working!");
    });

    app.post('/Candy', (req, res) => {
        candy = req.body;
        var id = db.addTreat(candy);
        res.set(headers);
        if (id == null) {
            res.json(400).json({"Message ": "There was an error!"});
        }
        res.status(201).json({"ID: ${id}": "Added to DB", "Candy": Candy});
    });

    // add the candy to the DB
    // return some kind of ID to the client
    app.get('/Candies', (req, res) => {
        var treats = db.fetchAllTreats();
        res.set(headers);

        if (treats == null) {
            res.json(500).json({"Message ": "There was an error!"});
        }
        res.status(200).json({"Treats " : treats});
    });

    app.get('/Candies/:Location', (req, res) => {
        var Location = req.param('Location');
        var treats = db.fetchByLocation(Location);
        res.set(headers);

        if (treats == null) {
            res.json(400).json({"Message ": "There was an error!"});
        }
        res.status(200).json({"Treats " : treats});
    });
}


/* required: nosql db connection, make db object public
   endpoints:  
   - addTreat, make call to db object
   - return all entries from DB
*/