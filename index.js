const puppeteer = require("puppeteer");

async function start() {
  //launch browser
  const browser = await puppeteer.launch();
  //open new page
  const page = await browser.newPage();
  //navigate to url
  // await page.goto("https://learnwebcode.github.io/practice-requests/");
  await page.goto("https://en.wikipedia.org/wiki/JavaScript");
  // take screenshot
  await page.screenshot({ path: "example2.png", fullPage: true });
  //close browser
  await browser.close();
}

start();
