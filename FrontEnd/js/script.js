import { getCategories, getWorks } from './api.js';

//catgeory-management
let SELECTED_CATEGORY = ""
const allCategories = document.getElementById('all-categories')

//display-management
async function displayData() {

    const categories = await getCategories();
    console.log('Catégories récupérées :', categories);

    const categoryList = document.getElementById('category-list');
    if (categoryList) {
        categoryList.innerHTML = '';
        const li = document.createElement('li');
        li.textContent = "Tous";
        li.title="Tous"
        categoryList.appendChild(li)
        li.addEventListener('click', async () => {
            SELECTED_CATEGORY = ""
            await displayData()
        })
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category.name;
            li.title=category.name
            categoryList.appendChild(li)
            li.addEventListener('click', async () => {
                SELECTED_CATEGORY = category.name
                await displayData()
            })
        });
    }

    const works = await getWorks();
    console.log('Travaux récupérés :', works);

    //const workGallery = document.getElementById('work-gallery');


    displayWorks(works);
}

function displayWorks(works) {
    const workList = document.getElementById('work-gallery')
    workList.textContent = ""
  works.forEach((work) => {
      //console.log(work.category)
      //console.log(work.category.name)
      //console.log(SELECTED_CATEGORY)
    if (work.category.name.includes(SELECTED_CATEGORY)) {
        const figure = document.createElement('figure');
        figure.classList.add('figure');

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        figure.appendChild(img)

        const figcaption = document.createElement('figcaption');
        figcaption.classList.add('figcaption');
        figcaption.textContent = work.title;
        figure.appendChild(figcaption)
        workList.appendChild(figure)
    }
  });

}
document.addEventListener('DOMContentLoaded', () => {
    displayData();
});








