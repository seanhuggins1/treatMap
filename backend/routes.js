module.exports = function(app, db) {
    var headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }
    
    app.get('/', (req, res) => {
        res.status(200).send("It's working!");
    });

    app.post('/Candy', async(req, res) => {
        candy = req.body;
        
        var id = await db.addTreat(candy);   
        console.log(id);
        if (id == null) {
            res.status(400).json({"Message ": "There was an error!"});
            return;
        }
        res.status(201).json({"ID": id, "Candy": candy});
    });

    app.get('/Candies', async(req, res) => {
        var treats = await db.fetchAllTreats();
        res.set(headers);

        if (treats == null) {
            res.status(500).json({"Message ": "There was an error!"});
            return;
        }
        res.status(200).json({"Treats " : treats});
    });

    app.get('/Candies/:Location', async(req, res) => {
        var Location = req.params.Location;
        //console.log(`Location: ${Location}`);
        var treats = await db.fetchByLocation(Location);
        res.set(headers);

        if (treats == null) {
            res.status(500).json({"Message ": "There was an error!"});
            return;
        }
        res.status(200).json({"Treats " : treats});
    });
}


/* required: nosql db connection, make db object public
   endpoints:  
   - addTreat, make call to db object
   - return all entries from DB
*/