const http = require('http');
const express = require("express");
const { opendirSync } = require('fs');
const app = express();

app.use(express.json()); // Gör så att vi kan läsa JSON-body i requests

const cors = require("cors"); // 🔹 Lägg till denna rad!


app.use(cors({
    origin : 'http://127.0.0.1:5500',
    
}));

const DOTNET_API_URL = 'https://animelistminimalapi-bph8a8fqcwc6dmhk.westeurope-01.azurewebsites.net/animes';

// 🔹 GET - Hämta alla anime från .NET API
app.get('/animes', (req, res) => {
    http.get(`${DOTNET_API_URL}/animes`, (response) => {
        let data = '';

        response.on('data', (chunk) => { 
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                res.status(200).json(JSON.parse(data));
            } else {
                res.status(response.statusCode).send("Error fetching anime");
            }
        });

    }).on('error', (err) => {
        console.error('Error connecting to .NET API', err.message);
        res.status(500).send('Error connecting to the .NET API');
    });
});

// 🔹 POST - Lägg till ny anime i .NET API
app.post('/animes', (req, res) => {
    const { name, genre, ReleaseYear, Rating } = req.body;

    if (!name || !genre || !ReleaseYear || !Rating) {
        return res.status(400).send('Missing required fields: name, genre, ReleaseYear, Rating');
    }

    const newAnime = JSON.stringify({ name, genre, ReleaseYear, Rating });

    const options = {
        hostname: 'https://animelistminimalapi-bph8a8fqcwc6dmhk.westeurope-01.azurewebsites.net/animes',
        path: '/animes',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(newAnime, 'utf8') // 🔹 Fixad Content-Length
        }
    };

    const request = http.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 201) {
                res.status(201).send('Anime successfully added to the .NET API!');
            } else {
                res.status(response.statusCode).send(`Failed to add anime: ${data}`);
            }
        });
    });

    request.on('error', (err) => {
        console.error('Error adding anime:', err.message);
        res.status(500).send('Error connecting to the .NET API');
    });

    request.write(newAnime);
    request.end();
});

// 🔹 GET - Hämta anime efter ID från .NET API
app.get('/animes/:id', (req, res) => {
    const animeId = req.params.id;

    http.get(`${DOTNET_API_URL}/anime/${animeId}`, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                res.status(200).json(JSON.parse(data));
            } else if (response.statusCode === 404) {
                res.status(404).send("Anime not found by ID");
            } else {
                res.status(response.statusCode).send("Error fetching anime");
            }
        });

    }).on('error', (err) => {
        console.error('Error fetching anime:', err.message);
        res.status(500).send('Error fetching anime data');
    });
});

// 🔹 Starta servern
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node API running on port ${PORT}`);
});



