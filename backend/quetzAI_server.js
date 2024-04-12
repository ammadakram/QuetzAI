const storage = require('./firebase-config').storage;  // Assuming firebase-config is a local file
const ref = require('firebase/storage').ref
const getDownloadURL = require('firebase/storage').getDownloadURL
const express = require('express');
const spawn = require('child_process').spawn;
const cors = require('cors');
const axios = require('axios')
const fs = require('fs');
const pathModule = require('path');
app = express()
port = 8000

app.use(cors({
    origin: "*",
    methods: ["GET"]
})) // Allow only GET requests from any URL.

// Returns a Promise for the generation.
const runGenerationScript = async (path, query) => {
    const py = spawn("python3", ['generation.py', path, query])
    const result = await new Promise((resolve, reject) => {
        let output = "";
        
        py.stdout.on('data', (data) => {
            output += data.toString();
            console.log("Received output from script which is: ", output)
        })
            
        py.on("exit", (code) => {
            if (parseInt(code) !== 0){
                reject("Some error occurred during generation");
            }
            else {
                resolve(output)
            }
            })
        })
        return result;
}

// Returns a Promise for downloading files locally from the Firebase Storage
const downloadRelevantFile = async (path) => {
    const result = await new Promise(async (resolve, reject) => {
        if (fs.existsSync(path)){
            resolve("File already downloaded...")
            return;
        }
        let dirPath = pathModule.dirname(path)
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath, { recursive: true });
            console.log("Directory created: ", dirPath);
        }
        pathReference = ref(storage, path)
        try {
            const downloadURL = await getDownloadURL(pathReference);
            const response = await axios({
                url: downloadURL,
                method: 'GET',
                responseType: 'stream'
            });
            const localPath = path;
            const writer = fs.createWriteStream(localPath);
    
            response.data.pipe(writer);
    
            writer.on('finish', () => {
                resolve("Successfully downloaded file locally.")
            });
    
            writer.on('error', (error) => {
                reject('Error writing file:', error);
            });
    
        } catch (error) {
            reject(error);
        }
    })
    return result
}

app.get('/download', async (req, res) => {
        console.log("Downloading user file(s).")
        let path = req.query.path
        console.log("Path: ", path)
        try {
            let success = await downloadRelevantFile(path)
            
            res.json({result: success, error: ""})
        } catch (e) {
            res.json({result: "", error: e})
        }
})

app.get('/generate', async (req, res) => {
    console.log("Attempting to generate output.");
    let path = req.query.path
    let query = req.query.query
    console.log("Path: ", path)
    console.log("Query: ", query)
    try {
        result = await runGenerationScript(path, query)
        console.log("Result: ", result)
        res.json({result: result, error: ""})
    } catch (error) {
        res.status(500).json({result: "", error: error})
    }
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
});