// Sélection des éléments DOM
const fontSelect = document.getElementById('fontSelect');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const playButton = document.getElementById('playButton');
const body = document.body;


// Fonction pour rechercher un mot dans l'API et le sauvegarder
async function searchWord(word) {
    try {
        // Appel de l'API dictionary
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Mot non trouvé');
        }
        // Sauvegarde de la recherche
        await fetch('save_search.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `word=${encodeURIComponent(word)}`
        });


        const data = await response.json();
        updateUI(data[0]); // Met à jour l'interface utilisateur avec les données reçues
    } catch (error) {
        alert('Désolé, nous n\'avons pas pu traiter votre demande. ' + error.message);
    }
}

// Fonction pour mettre à jour l'interface utilisateur
function updateUI(wordData) {
    // Mise à jour du mot et de la phonétique
    document.querySelector('h1').textContent = wordData.word;
    const phonetic = wordData.phonetic || (wordData.phonetics[0] ? wordData.phonetics[0].text : '');
    document.querySelector('.phonetic').textContent = phonetic;

    // Mise à jour des définitions
    const definitionsList = document.querySelector('.definitions');
    definitionsList.innerHTML = '';
    
    if (wordData.meanings && wordData.meanings.length > 0) {
        document.querySelector('.type').textContent = wordData.meanings[0].partOfSpeech;
        
        wordData.meanings[0].definitions.forEach(def => {
            const li = document.createElement('li');
            li.textContent = def.definition;
            definitionsList.appendChild(li);
        });
    }

    // Gestion de l'audio
    const audioUrl = wordData.phonetics.find(p => p.audio)?.audio;
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        playButton.onclick = () => audio.play();
    }

    // Mise à jour des synonymes
    const synonymsContainer = document.querySelector('.synonyms');
    synonymsContainer.innerHTML = '<span>Synonymes</span>';
    
    if (wordData.meanings[0].synonyms && wordData.meanings[0].synonyms.length > 0) {
        wordData.meanings[0].synonyms.forEach(synonym => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'synonym-link';
            link.textContent = synonym;
            link.onclick = (e) => {
                e.preventDefault();
                searchWord(synonym);
            };
            synonymsContainer.appendChild(link);
        });
    }
}

// Changement de police
fontSelect.addEventListener('change', (e) => {
    document.body.style.fontFamily = e.target.value;
});

// Basculement du thème (clair/sombre)
let isDarkMode = false;
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    body.classList.toggle('dark-theme');
    themeToggle.querySelector('.toggle-switch').style.transform = 
        isDarkMode ? 'translateX(20px)' : 'translateX(0)';
});

// Recherche avec l'API
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const word = searchInput.value.trim();
        if (word) {
            searchWord(word);
        }
    }
});

// Animation simple pour les liens de synonymes
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('synonym-link')) {
        e.preventDefault();
        searchWord(e.target.textContent);
    }
});

// Charger un mot par défaut au démarrage
searchWord('keyboard');