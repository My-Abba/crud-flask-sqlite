document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    let editingId = null;

    // Cargar productos al iniciar
    loadProducts();

    // Enviar formulario (Crear/Editar)
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('name').value,
            price: parseFloat(document.getElementById('price').value),
            description: document.getElementById('description').value
        };

        if (editingId) {
            await updateProduct(editingId, productData);
        } else {
            await createProduct(productData);
        }

        productForm.reset();
        editingId = null;
        loadProducts();
    });

    // Cargar todos los productos
    async function loadProducts() {
        const response = await fetch('/api/products');
        const products = await response.json();
        renderProducts(products);
    }

    // Crear producto
    async function createProduct(product) {
        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    }

    // Actualizar producto
    async function updateProduct(id, product) {
        await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    }

    // Eliminar producto
    async function deleteProduct(id) {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        loadProducts();
    }

    // Renderizar productos en HTML
    function renderProducts(products) {
        productList.innerHTML = products.map(product => `
            <div class="product">
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
                <p>${product.description}</p>
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        `).join('');
    }

    // Editar producto (expuesta globalmente)
    window.editProduct = async (id) => {
        const response = await fetch(`/api/products/${id}`);
        const product = await response.json();
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('description').value = product.description;
        editingId = id;
    };

    // Eliminar producto (expuesta globalmente)
    window.deleteProduct = (id) => {
        if (confirm('¿Eliminar este producto?')) {
            deleteProduct(id);
        }
    };
});