const {MongoClient, ServerApiVersion} = require("mongodb");
let db;

async function setupDB() {
    const URI = process.env.ATLAS_URI || "";
    const client = new MongoClient(URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: false,
            deprecationErrors: true,
        },
        monitorCommands: true
    });

    client.on("commandStarted", (event) => {
        console.debug(`DB: ${JSON.stringify(event, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, 2)}`);
    });

    try {
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error(err);
    }

    db = client.db("employees");
    // const collection = await db.collection("records");
    // const searchIndex = {
    //     name: "default",
    //     definition: {
    //         "mappings": {
    //             "dynamic": true
    //         }
    //     }
    // }
    // try {
    //     await collection.dropSearchIndex(searchIndex.name);
    //     const result = await collection.createSearchIndex(searchIndex);
    //     console.log(result);
    // } catch (err) {
    //     console.error(err);
    // }
}

async function getDB() {
    if (!db) {
        await setupDB();
    }
    return db;
}

module.exports = {
    getDB,
    setupDB
}
