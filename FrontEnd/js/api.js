// api.js
const API_URL = 'http://localhost:5678/api/';

export async function getCategories() {
    try {
        const response = await fetch(`${API_URL}categories`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        return [];
    }
}

export async function getWorks() {
    try {
        const response = await fetch(`${API_URL}works`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux :', error);
        return [];
    }
}




const API_URL2 = 'http://localhost:5678/api/';

export async function getUsers() {
    try {
        const response = await fetch(`${API_URL2}users`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        return [];
    }
}
