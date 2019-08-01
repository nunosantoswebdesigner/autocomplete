const search = document.getElementById('search')
const matchList = document.getElementById('match-list')
const matchCounter = document.getElementById('match-counter-container')
const form = document.getElementById('form')
const iconSearch = document.getElementById('icon-search')
// const autocomplete = document.getElementById('autocomplete');
const container = document.querySelector('#autocomplete-container');
const autocomplete = container.querySelector('#autocomplete');
const mainInput = container.querySelector('#search');




// f() async para procurar produtos no json 
const searchTshirts = async searchText => {
    //Usei fectch API para fazer o request ao json //https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch
    //https://caniuse.com/#feat=fetch
    //.json() para o formato da resposta ref: https://developer.mozilla.org/en-US/docs/Web/API/Body/json
    const res = await fetch('../data/products.json')
    const products = await res.json();
    let tshirts = products.items;

    // para fazer corresponder o valor do input aos items do json
    // Usei o filter method para percorrer o array e devolver novo array com as correspondencias
    let matches = tshirts.filter(tshirt => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return tshirt.title.match(regex);
    })

    // controlo de digitos 
    if (searchText.length === 0) {
        matches = [];
        // forçar o match apartir do 3º caractere
    } else if (searchText.length < 3) {
        matches = [];
    } else {
        setMatchCounter(matches);
    }
    // f () call
    setTitleAutocomplete(tshirts)
    outputHtml(matches);
}

// f() para calcular n de matchs
const setMatchCounter = async matches => {
    console.log(matches.length)
    // teste ternario para controlar plural no texto do resultado
    const html = await `<span class="counter-result">${matches.length  + ' ' + (matches.length == 1 ? 'Resultado' : 'Resultados') }</span>`
    matchCounter.innerHTML = html;
}

// f() para executar o autocomplete
// criar um array vazio para guardar todos os titulos para depois comparar e fazer o auto complete
const setTitleAutocomplete = (tshirts) => {
    let foundTitle = '';
    let titles = [];
    tshirts.forEach(element => {
        titles.push(element.title)
    });

    search.addEventListener('keyup', onKeyUp);

    function onKeyUp(e) {
        if (search.value === '') {
            autocomplete.textContent = '';
            return;
        }

        if (keyChecker(e, 'Enter') || keyChecker(e, 'ArrowRight')) {
            search.value = foundTitle;
            autocomplete.textContent = '';
        }

        for (let word of titles) {
            if (word.indexOf(search.value) === 0) {
                foundTitle = word;
                autocomplete.textContent = word;
                break;
            } else {
                foundTitle = '';
                autocomplete.textContent = '';
            }
        }
    }

    function keyChecker(e, key) {
        const keys = {
            'ArrowRight': 37,
            'Enter': 13,
            'ArrowLeft': 39
        }

        if (e.keyCode === keys[key] || e.which === keys[key] || e.key === key) return true;
        return false;
    }
}

// f para colocar as matches no html
const outputHtml = matches => {
    if (matches.length > 0) {
        const html = matches
            .map(
                // Template String ref:https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/template_strings
                match => `
                    <div class="list-item">
                        <img src="${match.image}" class="list-item-img" alt="${match.title}" />
                        <div>
                            <a class="list-item-title-link" href=""><h3 class="list-item-title">${match.title}</h3></a>
                            <small class="list-item-desc">${match.path}</small>
                        </div>
                    </div>
                `
            )
            .join('') //para converter numa string 
        matchList.innerHTML = html;
    }
}

// listen evento input e função callback
search.addEventListener('focus', () => form.style.boxShadow = '0px 0px 6px 1px rgba(233, 70, 65,0.4)');

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

search.addEventListener('input', () => {
    iconSearch.style.visibility = 'hidden';
    // MAIN FUNCTION =>
    event.shiftKey;
    searchTshirts(search.value)
});