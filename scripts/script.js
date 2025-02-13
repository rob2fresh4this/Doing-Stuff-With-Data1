//

const sort_by = document.getElementById('sort-by');// select element contents: id, first name, last name, height, age
const results_per_page = document.getElementById('results-per-page');// select element contents: 10, 20 ,30, 40, 50
const data_table = document.getElementById('data-table');// table element holds all the data when loaded
const pagination = document.getElementById('pagination');

let amountOfResultsPerPage = 10;

async function getData() {
    const response = await fetch('../data/data.json');
    const data = await response.json();
    console.log(data);
    return data.People;
}

function displayData(data) {
    data_table.innerHTML = '';
    data.forEach(person => {
        data_table.innerHTML += `
            <tr>
                <td>${person.Id}</td>
                <td>${person.FirstName}</td>
                <td>${person.LastName}</td>
                <td>${person.Height}</td>
                <td>${person.Age}</td>
            </tr>
        `;
    });
}

function displayPagination(data) {
    pagination.innerHTML = '';
    const pages = Math.ceil(data.length / results_per_page.value);// ceil rounds up to the nearest whole number
    for (let i = 1; i <= pages; i++) {
        pagination.innerHTML += `
            <li class="page-item"><a class="page-link" href="#">${i}</a></li>
        `;
    }
}

getData().then(people => {
    if (people) {
        displayData(people);
        displayPagination(people);
    } else {
        console.error('People data is undefined');
    }
});

function sortData(data, sort_by) {
    switch (sort_by) {
        case 'id':
            data.sort((a, b) => a.Id - b.Id);
            break;
        case 'firstName':
            data.sort((a, b) => a.FirstName.localeCompare(b.FirstName));
            break;
        case 'lastName':
            data.sort((a, b) => a.LastName.localeCompare(b.LastName));
            break;
        case 'height':
            data.sort((a, b) => a.Height.localeCompare(b.Height));
            break;
        case 'age':
            data.sort((a, b) => a.Age - b.Age);
            break;
        default:
            console.error('Invalid sort by value');
    }
}

function PerPage(data, results_per_page) {
    const start = 0;
    const end = results_per_page;
    return data.slice(start, end);
}

async function resultsPerPagedefaltAmount(){
    console.log('page loaded, results per page default amount is 10');
    const people = await getData();
    displayData(PerPage(people, 10));
    displayPagination(people);
}


sort_by.addEventListener('change', async () => {
    console.log(sort_by.value);
    const people = await getData();
    sortData(people, sort_by.value);
    displayData(PerPage(people, amountOfResultsPerPage)); 
    displayPagination(people);
});

results_per_page.addEventListener('change', async () => {
    console.log(results_per_page.value);
    amountOfResultsPerPage = parseInt(results_per_page.value, 10); // Ensure the pagination uses the updated value
    const people = await getData();
    sortData(people, sort_by.value); 
    displayData(PerPage(people, amountOfResultsPerPage)); 
    displayPagination(people);
});

pagination.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A') return;// to block blank spaces from being clicked
    console.log(e.target.textContent);
    const page = e.target.textContent;
    const start = (page - 1) * amountOfResultsPerPage;
    const end = page * amountOfResultsPerPage;
    getData().then(people => {
        sortData(people, sort_by.value);
        displayData(people.slice(start, end));
    });
});


resultsPerPagedefaltAmount();