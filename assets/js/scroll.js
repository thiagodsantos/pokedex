
/* código de infinite scroll + filtro de pesquisa no input,
   ainda falta corrigir alguns bugs para ficar 100% funcional.
*/

const pokemonsList = document.querySelector('#pokemonsList');
const loaderContainer = document.querySelector('.loader');
const searchBarInput = document.querySelector('#searchBar');

let id = 0;

const getPokemons = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?_limit=20${id}`)
    return response.json()
}

const generatePokemonsTemplate = pokemons => pokemons.map(({
    id,
    name
}) => `
    <li class="card">
        <h2 class="number">${id}</h2>
        <h2 class="card-title">${name}</h2>
    </li>
`).join('')

const addPokemonsIntoDOM = async () => {
    const pokemons = await getPokemons()
    const pokemonsTemplate = generatePokemonsTemplate(pokemons)

    pokemonsList.innerHTML += pokemonsTemplate
}

const getNextPokemons = () => {
    setTimeout(() => {
        id++
        addPokemonsIntoDOM()
    }, 300)
}

const removeLoader = () => {
    setTimeout(() => {
        loaderContainer.classList.remove('show');
        getNextPokemons()
    }, 1000)
}

const showLoader = () => {
    loaderContainer.classList.add('show');
    removeLoader()
}

const handleScrollToPageBottom = () => {
    const {
        clientHeight,
        scrollHeight,
        scrollTop
    } = document.documentElement
    const isPageBottomAlmostReached = scrollTop + clientHeight >= scrollHeight - 10

    if (isPageBottomAlmostReached) {
        showLoader()
    }
}

const showPokemonIfMatchInputValue = inputValue => card => {
    const pokemonNumber = card.querySelector('.number').textContent.toLowerCase()
    const pokemonName = card.querySelector('.title-card').textContent.toLowerCase()
    const pokemonContainsInputValue = pokemonNumber.includes(inputValue) || pokemonName.includes(inputValue)

    if (pokemonContainsInputValue) {
        card.style.display = 'flex'
        return
    }

    card.style.display = 'none'
}

const handleInputValue = event => {
    const inputValue = event.target.value.toLowerCase();
    const pokemons = document.querySelector('.card');

    pokemons.forEach(showPokemonIfMatchInputValue(inputValue))
}

addPokemonsIntoDOM()

window.addEventListener('scroll', handleScrollToPageBottom)
searchBarInput.addEventListener('input', handleInputValue)