const express = require('express');
const spawn = require('child_process').spawn;
app = express()
port = 8000

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
});

// Returns a Promise for the generation.
const runGenerationScript = async (path, query) => {
    const py = spawn("python3", ['generation.py', path, query])
    const result = await new Promise((resolve, reject) => {
        let output = "";

        py.stdout.on('data', (data) => {
            output += data.toString();
            console.log("Received output from script which is: ", output)
        })

        // py.stderr.on('data', (error) => {
        //     console.error(`Error occurred during generation. ${error}`);
        //     reject(`Error occurred. ${error}`)
        // })

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

app.get('/generate', async (req, res) => {
    console.log("Attempting to generate output.");
    path = req.query.path
    query = req.query.query
    console.log("Path: ", path)
    console.log("Query: ", query)
    try {
        result = await runGenerationScript(path, query)
        console.log("Result: ", result)
        res.json({result: result})
    } catch (error) {
        res.status(500).json({error: error})
    }
})