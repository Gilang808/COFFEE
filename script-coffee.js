// Data untuk semua produk yang tersedia
const products = {
  coffee: [
    { id: 'luwak', name: 'Kopi Luwak', price: 80000, img: 'image/luwak1.png' },
    { id: 'espresso', name: 'Espresso', price: 50000, img: 'image/espreso.png' },
    { id: 'latte', name: 'Latte', price: 30000, img: 'image/latte.png' },
    { id: 'cappuccino', name: 'Cappuccino', price: 30000, img: 'image/capucino.png' },
    { id: 'americano', name: 'Americano', price: 35000, img: 'image/americano.png' },
    { id: 'mocha', name: 'Mocha', price: 40000, img: 'image/moca2.png' }
  ],
  noncoffee: [
    { id: 'matcha', name: 'Matcha', price: 60000, img: 'image/matcha latte.jpeg' },
    { id: 'chocolate', name: 'Chocolate Drink', price: 35000, img: 'image/cocolate.jpg' },
    { id: 'strawberry', name: 'Strawberry Smoothie', price: 40000, img: 'image/strawberry.webp' },
    { id: 'oreo_shake', name: 'Oreo Shake', price: 35000, img: 'image/oreo.webp' },
    { id: 'milkshake', name: 'Vanilla Milkshake', price: 40000, img: 'image/vanilla.jpeg' }
  ],
  snack: [
    { id: 'donut', name: 'Donat Coklat', price: 25000, img: 'image/donat.jpg' },
    { id: 'croissant', name: 'Croissant', price: 30000, img: 'image/croissant.jpeg' },
    { id: 'brownies', name: 'Brownies', price: 35000, img: 'image/brownies.jpeg' },
    { id: 'cookies', name: 'Cookies', price: 20000, img: 'image/cookies.jpeg' },
    { id: 'muffin', name: 'Muffin Blueberry', price: 40000, img: 'image/muffin.jpeg' }
  ]
};

// Variabel untuk melacak kategori aktif dan keranjang belanja
let activeCategory = 'coffee';
const cart = {};

/**
 * Memuat produk ke dalam grid berdasarkan kategori yang aktif.
 */
function loadProducts() {
  const container = document.getElementById('product-grid');
  container.innerHTML = '';

  products[activeCategory].forEach(product => {
    const qty = cart[product.id] || 0;
    const productItem = document.createElement('div');
    productItem.className = 'product';

    productItem.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="product-image">
      <p class="product-name">${product.name}</p>
      <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
      <div class="counter">
        <button onclick="updateQty('${product.id}', -1)" ${qty === 0 ? 'disabled' : ''}>-</button>
        <input type="text" value="${qty}" readonly>
        <button onclick="updateQty('${product.id}', 1)">+</button>
      </div>
    `;
    container.appendChild(productItem);
  });
}

/**
 * Mengganti kategori produk yang ditampilkan.
 * @param {string} category - Kategori yang akan ditampilkan ('coffee', 'noncoffee', 'snack').
 */
function changeCategory(category) {
  activeCategory = category;
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.tab[onclick="changeCategory('${category}')"]`).classList.add('active');
  loadProducts();
}

/**
 * Memperbarui jumlah item dalam keranjang.
 * @param {string} productId - ID produk yang akan diperbarui.
 * @param {number} change - Perubahan jumlah (+1 atau -1).
 */
function updateQty(productId, change) {
  const currentQty = cart[productId] || 0;
  if (currentQty + change < 0) return;

  cart[productId] = currentQty + change;
  if (cart[productId] === 0) {
    delete cart[productId];
  }
  
  loadProducts();
  updateOrderSummary();
}

/**
 * Memperbarui tampilan ringkasan pesanan dan total harga.
 */
function updateOrderSummary() {
  const orderList = document.getElementById('order-items');
  const totalPriceEl = document.getElementById('total-price');
  orderList.innerHTML = '';

  let total = 0;

  if (Object.keys(cart).length === 0) {
    orderList.innerHTML = '<li>Keranjang Anda kosong.</li>';
  } else {
    Object.entries(cart).forEach(([productId, qty]) => {
      if (qty > 0) {
        const product = Object.values(products).flat().find(p => p.id === productId);
        if (product) {
          const subtotal = product.price * qty;
          total += subtotal;

          const listItem = document.createElement('li');
          listItem.innerHTML = `${product.name} x ${qty} <span>Rp ${subtotal.toLocaleString('id-ID')}</span>`;
          orderList.appendChild(listItem);
        }
      }
    });
  }
  totalPriceEl.textContent = total.toLocaleString('id-ID');
}

/**
 * Memproses pesanan dan menampilkan invoice.
 */
function submitOrder() {
  if (Object.keys(cart).length === 0) {
    alert('Keranjang Anda kosong! Silakan pilih produk terlebih dahulu.');
    return;
  }
  
  const name = document.getElementById('customer-name').value;
  const email = document.getElementById('customer-email').value;
  const paymentMethodEl = document.getElementById('payment-method');
  const paymentMethodValue = paymentMethodEl.value;
  const paymentMethodText = paymentMethodEl.options[paymentMethodEl.selectedIndex].text;
  const totalPrice = document.getElementById('total-price').textContent;

  if (!name || !email || !paymentMethodValue) {
    alert('Harap lengkapi semua data pesanan (Nama, Email, dan Metode Pembayaran)!');
    return;
  }

  // Menyiapkan data untuk invoice
  const invoiceId = `INV-${Date.now()}`;
  const date = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  // Mengisi data ke dalam modal invoice
  document.getElementById('invoice-id').textContent = invoiceId;
  document.getElementById('invoice-date').textContent = date;
  document.getElementById('invoice-customer').textContent = name;
  document.getElementById('invoice-email').textContent = email;
  document.getElementById('invoice-payment').textContent = paymentMethodText;
  document.getElementById('invoice-total').textContent = totalPrice;

  const invoiceItemsContainer = document.getElementById('invoice-items');
  invoiceItemsContainer.innerHTML = '';
  Object.entries(cart).forEach(([productId, qty]) => {
    if (qty > 0) {
      const product = Object.values(products).flat().find(p => p.id === productId);
      if (product) {
          const subtotal = product.price * qty;
          const item = document.createElement('p');
          item.innerHTML = `<strong>${product.name}</strong> x ${qty} = Rp ${subtotal.toLocaleString('id-ID')}`;
          invoiceItemsContainer.appendChild(item);
      }
    }
  });
  
  // Menampilkan modal invoice
  document.getElementById('invoice').classList.remove('hidden');
}

/**
 * Membuka dialog cetak untuk menyimpan invoice sebagai PDF.
 */
function downloadInvoice() {
  const invoiceElement = document.querySelector('.invoice-content').cloneNode(true);
  // Hapus tombol aksi dari konten cetak
  invoiceElement.querySelector('.invoice-actions').remove();

  const printWindow = window.open('', '', 'height=700,width=800');
  printWindow.document.write('<html><head><title>Invoice</title>');
  printWindow.document.write('<link rel="stylesheet" href="style-coffee.css">'); // Menggunakan style yang sama
  printWindow.document.write(`
    <style>
      body { background: #fff; }
      .invoice-content { box-shadow: none; border: 1px solid #ddd; }
    </style>
  `);
  printWindow.document.write('</head><body>');
  printWindow.document.write(invoiceElement.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  
  // Memberi sedikit waktu agar style dimuat sebelum mencetak
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

/**
 * Mereset seluruh pesanan untuk memulai dari awal.
 */
function resetOrder() {
  Object.keys(cart).forEach(key => delete cart[key]);

  document.getElementById('order-form').reset();
  
  document.getElementById('invoice').classList.add('hidden');
  
  updateOrderSummary();
  loadProducts();
}

// Inisialisasi saat halaman dimuat
window.onload = () => {
  changeCategory('coffee');
  updateOrderSummary();
};