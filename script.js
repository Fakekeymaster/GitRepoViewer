
// paginatedFetch function
function paginatedFetch(url, page = 1, previousResponse = []) {
    return fetch(`${url}?page=${page}&per_page=10`) // URL to include per_page parameter
        .then(response => response.json())
        .then(newResponse => {
            const response = [...previousResponse, ...newResponse];

            if (newResponse.length !== 0) {
                page++;
                return paginatedFetch(url, page, response);
            }

            return response;
        });
}

// getRepositories function
function getRepositories() {
    const username = document.getElementById('username').value;
    const searchQuery = document.getElementById('search').value;
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    const repositoriesContainer = document.getElementById('repositories');
    const loader = document.getElementById('loader');
    const userProfileContainer = document.getElementById('user-profile');
    const paginationContainer = document.getElementById('pagination');

    repositoriesContainer.innerHTML = '';
    userProfileContainer.innerHTML = '';
    loader.style.display = 'block';
    paginationContainer.innerHTML = '';

    paginatedFetch(apiUrl)
        .then(repositories => {
            loader.style.display = 'none';

            const repositoriesWrapper = document.createElement('div');
            repositoriesWrapper.classList.add('repositories-wrapper');

            repositories.forEach(repo => {
                const repoElement = document.createElement('div');
                repoElement.classList.add('repository');

                const repoLink = document.createElement('a');
                repoLink.href = repo.html_url;
                repoLink.target = '_blank';
                repoLink.textContent = repo.name;
                repoElement.appendChild(repoLink);

                if (repo.description) {
                    const repoDescription = document.createElement('p');
                    repoDescription.textContent = repo.description;
                    repoElement.appendChild(repoDescription);
                }

                if (repo.language) {
                    const repoLanguages = repo.language.split(',');
                    const languageContainer = document.createElement('div');
                    languageContainer.classList.add('language-container');

                    repoLanguages.forEach(language => {
                        const repoLanguage = document.createElement('span');
                        repoLanguage.classList.add('language-tag');
                        repoLanguage.textContent = language.trim();
                        languageContainer.appendChild(repoLanguage);
                    });

                    repoElement.appendChild(languageContainer);
                }

                repositoriesWrapper.appendChild(repoElement);
            });

            repositoriesContainer.appendChild(repositoriesWrapper);

            // Display pagination
            displayPagination(repositories.length);
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error fetching data:', error);
            repositoriesContainer.innerHTML = 'Error fetching data. Please check the username and try again.';
        });
}

// Your displayPagination function
function displayPagination(totalRepositories) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(totalRepositories / 10); // Assuming 10 repositories per page

    if (totalPages > 1) {
        const pageNumbersContainer = document.createElement('div');
        pageNumbersContainer.classList.add('page-numbers');

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('div');
            pageNumber.classList.add('page-number');
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => changePage(i));
            pageNumbersContainer.appendChild(pageNumber);
        }

        paginationContainer.appendChild(pageNumbersContainer);
    }
}

// Function to change the current page and fetch repositories
function changePage(newPage) {
    const username = document.getElementById('username').value;
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    const repositoriesContainer = document.getElementById('repositories');
    const loader = document.getElementById('loader');
    const paginationContainer = document.getElementById('pagination');

    repositoriesContainer.innerHTML = '';
    loader.style.display = 'block';
    paginationContainer.innerHTML = '';

    paginatedFetch(apiUrl, newPage)
        .then(repositories => {
            loader.style.display = 'none';

            const repositoriesWrapper = document.createElement('div');
            repositoriesWrapper.classList.add('repositories-wrapper');

            const startIndex = (newPage - 1) * 10;
            const endIndex = startIndex + 10;

            repositories.slice(startIndex, endIndex).forEach(repo => {
                const repoElement = document.createElement('div');
                repoElement.classList.add('repository');

                const repoLink = document.createElement('a');
                repoLink.href = repo.html_url;
                repoLink.target = '_blank';
                repoLink.textContent = repo.name;
                repoElement.appendChild(repoLink);

                if (repo.description) {
                    const repoDescription = document.createElement('p');
                    repoDescription.textContent = repo.description;
                    repoElement.appendChild(repoDescription);
                }

                if (repo.language) {
                    const repoLanguages = repo.language.split(',');
                    const languageContainer = document.createElement('div');
                    languageContainer.classList.add('language-container');

                    repoLanguages.forEach(language => {
                        const repoLanguage = document.createElement('span');
                        repoLanguage.classList.add('language-tag');
                        repoLanguage.textContent = language.trim();
                        languageContainer.appendChild(repoLanguage);
                    });

                    repoElement.appendChild(languageContainer);
                }

                repositoriesWrapper.appendChild(repoElement);
            });

            repositoriesContainer.appendChild(repositoriesWrapper);

            // Display pagination
            displayPagination(repositories.length);
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error fetching data:', error);
            repositoriesContainer.innerHTML = 'Error fetching data. Please check the username and try again.';
        });
}
