const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10;
let offset = 0;

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" data-name="${pokemon.name}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
        `).join('')
        pokemonList.innerHTML += newHtml

        // Adicionar evento de clique nos itens
        document.querySelectorAll('.pokemon').forEach((item) => {
            item.addEventListener('click', () => {
                const pokemonName = item.getAttribute('data-name');
                showPokemonDetails(pokemonName);
            })
        })
    })
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordWithNextPage = offset + limit

    if (qtdRecordWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
        return
    } else {
        loadPokemonItens(offset, limit);
    }

    
})


/*MODEL DAS CARACTERÍSTICAS GERAIS DO POKÉMON*/
function showPokemonDetails(name) {
    console.log("Pokemon Name:", name); // Verifica o valor do nome
    if (name && typeof name === 'string') {
        const normalizedName = name.toLowerCase(); // Normaliza o nome para minúsculas
        pokeApi.getPokemonDetailByName(normalizedName)
            .then((pokemon) => {
                if (pokemon && pokemon.number && pokemon.name) {
                    const abilities = pokemon.abilities?.join(', ') || 'Not available';
                    const types = pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('');


                    const modalContent = `
                        <div class="infoPokeList">
                            <div class="pokeInfo">
                                <li class="pokeInfo ${pokemon.type}" data-name="${pokemon.name}">
                                <span class="number">#${pokemon.number}</span>
                                <span class="name">${pokemon.name}</span>
                                <ol class="types">
                                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                                </ol>
                                <img src="${pokemon.photo}" alt="${pokemon.name}">
                    
                                <div class="infos">
                                    <span class="titleInfo">General</span>
                                    <ol class="infoList">
                                        <li class="height">Height: ${pokemon.height || 'Not available'}m</li>
                                        <li class="weight">Weight: ${pokemon.weight || 'Not available'}kg</li>
                                        <li class="abilities">Abilities: ${abilities}</li>
                                    </ol>
                                    <span class="titleInfo">Breeding</span>
                                    <ol class="infoList">
                                        <li class="baseExperience">Base Experience: ${pokemon.base_experience || 'Not available'}</li>
                                    </ol>
                                </div>
                            </div>
                        </div>`;

                    document.getElementById('pokemonModalContent').innerHTML = modalContent;
                    document.getElementById('modal').style.display = 'flex';
                } else {
                    console.error("Incomplete Pokémon data:", pokemon);
                }
            })
            .catch((error) => {
                console.error("Error showing Pokémon details:", error);
            });
    } else {
        console.error("Pokemon name is missing!");
    }
}

// Fechar modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});