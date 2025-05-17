const form = document.getElementById('product-form');
const tableBody = document.querySelector('#product-table tbody');
const totalProfitEl = document.getElementById('total-profit');
const downloadPdfBtn = document.getElementById('download-pdf');

let products = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('product-name').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
  const soldPrice = parseFloat(document.getElementById('sold-price').value);
  const profit = (soldPrice - purchasePrice) * quantity;
  const date = new Date().toLocaleDateString();

  const product = { name, quantity, purchasePrice, soldPrice, profit, date };
  products.push(product);
  renderTable();
  form.reset();
});

function renderTable() {
  tableBody.innerHTML = '';
  let totalProfit = 0;

  products.forEach((product, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${product.purchasePrice}</td>
      <td>${product.soldPrice}</td>
      <td>${product.profit}</td>
      <td>${product.date}</td>
      <td><button class="delete" onclick="deleteRow(${index})">O‘chirish</button></td>
    `;

    totalProfit += product.profit;
    tableBody.appendChild(row);
  });

  totalProfitEl.textContent = totalProfit;
}

function deleteRow(index) {
  products.splice(index, 1);
  renderTable();
}

// PDF export
downloadPdfBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Mahsulotlar Ro'yxati", 14, 16);

  const tableData = products.map(p => [
    p.name, p.quantity, p.purchasePrice, p.soldPrice, p.profit, p.date
  ]);

  doc.autoTable({
    head: [['Nomi', 'Soni', 'Olish narxi', 'Sotish narxi', 'Foyda', 'Sana']],
    body: tableData,
    startY: 20,
  });

  doc.save('mahsulotlar.pdf');
});
