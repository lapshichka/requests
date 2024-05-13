const searchInput = document.querySelector('.search-line');
const menuList = document.querySelector('.menu__list');
const cardContainer = document.querySelector('.cards__list');

const debounce = (cb, ms) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => cb.apply(this, args), ms);
  };
};

function createCard(name, owner, stars) {
  const card = document.createElement('div');
  card.setAttribute('class', 'card');

  const text = document.createElement('div');
  text.setAttribute('class', 'block-text');
  text.innerHTML = `<b>Name:</b> ${name} <br> <b>Owner:</b> ${owner} <br> <b>Stars:</b> ${stars}`;

  const icon = document.createElement('div');
  icon.setAttribute('class', 'close__icon');

  card.append(text);
  card.append(icon);
  cardContainer.append(card);

  icon.addEventListener('click', () => {
    card.remove();
  });
}

async function getRepositories(params) {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${params}`
  );
  return response.json();
}

async function autocomplete(e) {
  const { value } = e.target;

  let { items } = await getRepositories(value);

  let counter = 0;

  for (const { name, owner: { login }, stargazers_count } of items) {
    const menuItem = document.createElement('li');
    menuItem.setAttribute('class', 'menu__item');
    menuItem.textContent = name;
    menuList.append(menuItem);

    searchInput.addEventListener('input', (e) => {
      menuItem.remove();
    });

    menuItem.addEventListener('click', () =>
      createCard(name, login, stargazers_count)
    );

    counter++;
    if (counter === 5) break;
  }
}

const debouncedFn = debounce(autocomplete, 1000);
searchInput.addEventListener('input', debouncedFn);
