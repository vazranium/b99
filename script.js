const categorySelect = document.getElementById('categorySelect');
const productGrid = document.getElementById('productGrid');

fetch('data/manifest.json')
  .then(response => response.json())
  .then(fileList => {
    return Promise.all(
      fileList.map(file => fetch(`data/${file}`).then(res => res.json()))
    );
  })
  .then(fileContents => {
    const products = fileContents.flat();

    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });

    function renderProducts(filter = 'all') {
      productGrid.innerHTML = '';
      const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
      filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.image_url}" alt="${product.title}" />
          <div class="product-info">
            <h3>${product.title}</h3>
            <p class="price-tag">₹ ${product.price}</p>
            <a href="${product.product_url}" target="_blank">View Product</a>
          </div>
        `;
        productGrid.appendChild(card);
      });
    }

    categorySelect.addEventListener('change', () => {
      renderProducts(categorySelect.value);
    });

    renderProducts();
  })
  .catch(error => {
    productGrid.innerHTML = '<p>Error loading products.</p>';
    console.error('Failed to load product files:', error);
  });

// Page visit counter using countapi.xyz
const counterEl = document.getElementById('visitCounter');
const namespace = 'buy99'; // You can customize this
const key = 'page-visits';

fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
  .then(res => res.json())
  .then(data => {
    counterEl.textContent = `Visits: ${data.value}`;
  })
  .catch(err => {
    console.error('Visit counter error:', err);
    counterEl.textContent = 'Visits: N/A';
  });
