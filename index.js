const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function start() {
  //launch browser
  const browser = await puppeteer.launch();
  //open new page
  const page = await browser.newPage();
  //navigate to url
  await page.goto("https://learnwebcode.github.io/practice-requests/");

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".info strong")).map(
      (item) => item.textContent
    );
  });
  await fs.writeFile("names.txt", names.join("\r\n"));

  //close browser
  await browser.close();
}

start();
