module.exports = function(app, db, wss, combinedData) {

    var headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }

    app.post('/Candy', async(req, res) => {
        try{
            candy = req.body;
            
            var id = await db.addTreat(candy);   
            //console.log(id);
            if (id == null) {
                res.status(500).json({"Message ": "There was an error!"});
                return;
            }
            res.status(201).json({"ID": id, "Candy": candy});


            //let the websocket clients know about the new treat
            wss.broadcast(JSON.stringify({"ID": id, "Candy": candy}, null, 2));
        }
        catch(error) {
            res.status(500).json({"error": error});
        }
    });

    app.get('/Candies', async(req, res) => {
        try{
            var treats = await db.fetchAllTreats();
            res.set(headers);

            if (treats == null) {
                res.status(500).json({"Message ": "There was an error!"});
                return;
            }
            res.status(200).json({"Treats " : treats});
        }
        catch(error) {
            res.status(500).json({"error": error});
        }
    });

    app.get('/Candies/:Location', async(req, res) => {
        try{
            var Location = req.params.Location;
            //console.log(`Location: ${Location}`);
            var treats = await db.fetchByLocation(Location);
            res.set(headers);

            if (treats == null) {
                res.status(500).json({"Message ": "There was an error!"});
                return;
            }
            res.status(200).json({"Treats " : treats});
        }
        catch(error) {
            res.status(500).json({"error": error});
        }
    });

    app.delete('/Candies', async(req, res) => {
        try{
            var deletedCount = await db.deleteAllTreats();
            res.set(headers);

            if (deletedCount == null) {
                res.status(500).json({"Message ": "There was an error!"});
                return;
            }
            res.status(200).json({"message": `Deleted ${deletedCount} documents`});
        }
        catch(error) {
            res.status(500).json({"error": error});
        }
    });

    app.delete('/Candy/:Id', async(req, res) => {
        try{
            var Id = req.params.Id;
            var deletedCount = await db.deleteTreatById(Id);
            res.set(headers);

            res.status(200).json({"message": `Deleted ${deletedCount} documents`});
        }
        catch(error) {
            res.status(500).json({"error": error});
        }
    });

    app.get('/Safety/:Country/:State/:County', (req, res) => {
        var Country = req.params.Country;
        var State = req.params.State;
        var County = req.params.County;

        if(County in combinedData) {
            res.status(200).json({"safety": combinedData[County]});
            return;
        }

        if(State in combinedData) {
            res.status(200).json({"safety": combinedData[State]});
            return;
        }
        
        res.status(200).json({"safety": combinedData[Country]});
    });
}