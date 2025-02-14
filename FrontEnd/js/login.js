document.getElementById('formulaire').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const mdp = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                email : email,
                 password : mdp
             }),
        });

        if (!response.ok) {
            throw new Error('Erreur de connexion : identifiants incorrects.');
        }

        const data = await response.json();
        console.log('Données reçues du serveur :', data);

        const token = data.token;
        if (token) {
            console.log('Token stocké avec succès :', token);
            sessionStorage.setItem('authToken', token);
            document.location= "index.html"
        } else {
            console.error('Le token est introuvable.');
            document.getElementById('message').innerText = 'Connexion réussie, mais aucun token reçu.';
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error.message);
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.innerText = error.message;
        }
    }
});




//*********************** TOKEN  **************************//


async function sendWork(workData) {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(workData),
        });

        if (!response.ok) {
            throw new Error('Erreur');
        }

        const result = await response.json();
        console.log('Travail envoyé:', result);
    } catch (error) {
        console.error('Erreur :', error.message);
    }
}

async function deleteWork(workId) {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du travail.');
        }

        console.log('Travail supprimé avec succès.');
    } catch (error) {
        console.error('Erreur :', error.message);
    }
}
