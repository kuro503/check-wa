const wa = require("@open-wa/wa-automate");
const fs = require("fs");
const XLSX = require("xlsx");

async function start(client) {
  console.log("⏳ Menunggu WA siap...");
  await new Promise(resolve => setTimeout(resolve, 5000));

  const numbers = JSON.parse(fs.readFileSync("numbers.json", "utf-8"));
  const results = [];
  const outputLog = [];

  for (const num of numbers) {
    try {
      const response = await client.checkNumberStatus(num);
      const status = response.status === 200 ? "Terdaftar Wa" : "Tidak Terdaftar Wa";
      results.push({ number: num, status });
      outputLog.push(`${num} ${status}`);
      console.log(`${num}: ${status}`);
    } catch (err) {
      results.push({ number: num, status: "Error" });
      outputLog.push(`${num} Error`);
      console.error(`❌ Error cek ${num}:`, err.message);
    }
  }

  fs.writeFileSync("hasil.json", JSON.stringify(results, null, 2));
  fs.writeFileSync("hasil.txt", outputLog.join("\n"));

  const worksheet = XLSX.utils.json_to_sheet(results);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil");
  XLSX.writeFile(workbook, "hasil.xlsx");

  console.log("✔️ Semua hasil disimpan di hasil.json, hasil.txt, hasil.xlsx");
}

wa.create({
  sessionId: "ulang-qr",
  headless: false,
  useChrome: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  killProcessOnBrowserClose: true,
  deleteSessionDataOnLogout: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}).then(client => start(client));
