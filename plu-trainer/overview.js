// PLU Trainer — overview / browse-all logic

let items = [];

const gridEl = document.getElementById('grid');
const searchEl = document.getElementById('search');

function render(list) {
  gridEl.innerHTML = list.map((item) => `
    <div class="item-tile">
      <img src="images/${item.image}" alt="${item.name}">
      <div class="meta">
        <div class="code">${item.code}</div>
        <div class="name">${item.name}</div>
      </div>
    </div>
  `).join('');
}

searchEl.addEventListener('input', () => {
  const q = searchEl.value.trim().toLowerCase();
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(q) || item.code.includes(q)
  );
  render(filtered);
});

fetch('data/plu.json')
  .then((r) => r.json())
  .then((data) => {
    items = data;
    render(items);
  })
  .catch((err) => {
    gridEl.textContent = 'Could not load data/plu.json — check the file exists and is valid JSON.';
    console.error(err);
  });
