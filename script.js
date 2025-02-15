const apiUrl = "https://animelistminimalapi-bph8a8fqcwc6dmhk.westeurope-01.azurewebsites.net/animes";

// 🔹 Hämta alla anime
async function fetchAnime() { // Ändrat från fetchAnimes() till fetchAnime()
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch anime");
        const data = await response.json();
        
        const list = document.getElementById('animeList');
        list.innerHTML = '';

        data.forEach(anime => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `${anime.name} - ${anime.genre} (${anime.ReleaseYear}) - Betyg: ${anime.Rating}`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
}

// 🔹 Lägg till en ny anime
document.getElementById("animeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const genre = document.getElementById("genre").value;
    const releaseYear = parseInt(document.getElementById("ReleaseYear").value); // 🔹 parseInt
    const rating = parseFloat(document.getElementById("Rating").value); // 🔹 parseFloat

    const newAnime = { name, genre, releaseYear, rating }; // 🔹 Fixade egenskaper

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAnime)
        });

        if (response.ok) {
            alert("Anime added successfully!");
            fetchAnime(); // 🔹 Uppdatera listan
            document.getElementById("animeForm").reset(); // 🔹 Rensa formuläret
        } else {
            const errorText = await response.text();
            alert("Failed to add anime: " + errorText);
        }
    } catch (error) {
        console.error("Error adding anime:", error);
    }
});

// 🔹 Hämta anime via ID
async function fetchAnimeById() {
    const id = document.getElementById("animeId").value;
    if (!id) return alert("Please enter an anime ID!");

    try {
        const response = await fetch(`${apiUrl}/${id}`);
        
        if (!response.ok) {
            document.getElementById("animeDetails").innerText = "Anime not found.";
            return;
        }

        const anime = await response.json();
        document.getElementById("animeDetails").innerText = `Found: ${anime.name} - ${anime.genre} (${anime.ReleaseYear})`;
    } catch (error) {
        console.error("Error fetching anime by ID:", error);
        document.getElementById("animeDetails").innerText = "Error fetching data.";
    }
}


