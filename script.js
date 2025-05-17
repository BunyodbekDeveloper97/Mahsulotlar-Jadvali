document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("productForm");
    const tableBody = document.querySelector("#productsTable tbody");
    const totalPurchaseEl = document.getElementById("totalPurchase");
    const totalSoldEl = document.getElementById("totalSold");
    const totalProfitEl = document.getElementById("totalProfit");
  
    let products = [];
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const name = document.getElementById("productName").value.trim();
      const count = parseInt(document.getElementById("productCount").value);
      const purchasePrice = parseFloat(document.getElementById("purchasePrice").value);
      const soldPrice = parseFloat(document.getElementById("soldPrice").value);
      const profit = (soldPrice - purchasePrice) * count;
      const date = new Date().toLocaleDateString("uz-UZ");
  
      products.push({ name, count, purchasePrice, soldPrice, profit, date });
      updateTable();
  
      form.reset();
    });
  
    function updateTable() {
      tableBody.innerHTML = "";
      let totalPurchase = 0, totalSold = 0, totalProfit = 0;
  
      products.forEach((product, index) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${product.name}</td>
          <td>${product.count}</td>
          <td>UZS ${product.purchasePrice.toFixed(2)}</td>
          <td>UZS ${product.soldPrice.toFixed(2)}</td>
          <td>UZS ${product.profit.toFixed(2)}</td>
          <td>${product.date}</td>
          <td><button class="deleteBtn" data-index="${index}">❌</button></td>
        `;
  
        tableBody.appendChild(row);
  
        totalPurchase += product.purchasePrice * product.count;
        totalSold += product.soldPrice * product.count;
        totalProfit += product.profit;
      });
  
      totalPurchaseEl.textContent = `UZS ${totalPurchase.toFixed(2)}`;
      totalSoldEl.textContent = `UZS ${totalSold.toFixed(2)}`;
      totalProfitEl.textContent = `UZS ${totalProfit.toFixed(2)}`;
    }
  
    tableBody.addEventListener("click", function (e) {
      if (e.target.classList.contains("deleteBtn")) {
        const index = +e.target.getAttribute("data-index");
        products.splice(index, 1);
        updateTable();
      }
    });
  
    // Word yuklab olish uchun
    document.getElementById("downloadDoc").addEventListener("click", function () {
      if (products.length === 0) {
        alert("Iltimos, avval ma'lumot qo'shing!");
        return;
      }
  
      const { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType } = window.docx;
  
      const rows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("No")], width: { size: 5, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph("Maxsulot nomi")] }),
            new TableCell({ children: [new Paragraph("Soni")] }),
            new TableCell({ children: [new Paragraph("Tan Narxi")] }),
            new TableCell({ children: [new Paragraph("Sotilgan Narxi")] }),
            new TableCell({ children: [new Paragraph("Foyda")] }),
            new TableCell({ children: [new Paragraph("Sana")] }),
          ],
          tableHeader: true,
        }),
      ];
  
      products.forEach((p, i) => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph((i + 1).toString())] }),
              new TableCell({ children: [new Paragraph(p.name)] }),
              new TableCell({ children: [new Paragraph(p.count.toString())] }),
              new TableCell({ children: [new Paragraph(`UZS ${p.purchasePrice.toFixed(2)}`)] }),
              new TableCell({ children: [new Paragraph(`UZS ${p.soldPrice.toFixed(2)}`)] }),
              new TableCell({ children: [new Paragraph(`UZS ${p.profit.toFixed(2)}`)] }),
              new TableCell({ children: [new Paragraph(p.date)] }),
            ],
          })
        );
      });
  
      // Yakuniy umumiy qator
      rows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Umumiy")], columnSpan: 3 }),
            new TableCell({
              children: [new Paragraph(products.reduce((sum, p) => sum + p.purchasePrice * p.count, 0).toFixed(2))],
            }),
            new TableCell({
              children: [new Paragraph(products.reduce((sum, p) => sum + p.soldPrice * p.count, 0).toFixed(2))],
            }),
            new TableCell({
              children: [new Paragraph(products.reduce((sum, p) => sum + p.profit, 0).toFixed(2))],
            }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        })
      );
  
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "Mahsulotlar jadvali",
                heading: window.docx.HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Table({
                rows,
                width: { size: 100, type: WidthType.PERCENTAGE },
              }),
            ],
          },
        ],
      });
  
      Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Mahsulotlar.docx";
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  
    // PDF yuklab olish uchun
    document.getElementById("downloadPDF").addEventListener("click", function () {
      if (products.length === 0) {
        alert("Iltimos, avval ma'lumot qo'shing!");
        return;
      }
  
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
  
      // Jadval ustunlari
      const columns = [
        "No",
        "Maxsulot nomi",
        "Soni",
        "Tan Narxi",
        "Sotilgan Narxi",
        "Foyda",
        "Sana",
      ];
  
      // Jadval qatorlari
      const rows = products.map((p, i) => [
        i + 1,
        p.name,
        p.count,
        `UZS ${p.purchasePrice.toFixed(2)}`,
        `UZS ${p.soldPrice.toFixed(2)}`,
        `UZS ${p.profit.toFixed(2)}`,
        p.date,
      ]);
  
      // Yakuniy umumiy qator
      rows.push([
        "Umumiy",
        "",
        "",
        `UZS ${products.reduce((sum, p) => sum + p.purchasePrice * p.count, 0).toFixed(2)}`,
        `UZS ${products.reduce((sum, p) => sum + p.soldPrice * p.count, 0).toFixed(2)}`,
        `UZS ${products.reduce((sum, p) => sum + p.profit, 0).toFixed(2)}`,
        "",
      ]);
  
      doc.text("Mahsulotlar jadvali", 105, 10, null, null, "center");
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 15,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }, // ko'k rang
        footStyles: { fillColor: [236, 240, 241] }, // kulrang footer uchun
      });
  
      doc.save("Mahsulotlar.pdf");
    });
  });
  