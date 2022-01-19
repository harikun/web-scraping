const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const useragent = require("useragent");
const cron = require("node-cron");

// crawling Tokopedia
async function start3() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.tokopedia.com/ekoshopedia");
  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a .css-12fc2syy")).map(
      (item) => item.textContent
    );
  });
  await fs.writeFile("products.txt", data.join("\r\n"));
  console.log(data);
  await browser.close();
}
start3();

// crawling yellowpages

async function crawlingYellowPages() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://www.yellowpages.com.au/find/lawyers-solicitors/gold-coast-qld"
  );
  await sleep(10000);
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  const names = await page.evaluate(() => {
    const title = document.querySelectorAll("a > h3");
    return Array.from(title).map((item) => item.textContent);
  });
  await fs.writeFile("names.txt", names.join("\r\n"));
  await browser.close();
}

//crawling kompas
async function start2() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://tekno.kompas.com/", {
    waitUntil: "load",
    timeout: 0,
  });
  const titles = await page.evaluate((_) => {
    return Array.from(document.querySelectorAll(".article__link")).map(
      (item) => item.textContent
    );
  });
  await fs.writeFile("products.txt", titles.join("\r\n"));
  await browser.close();
}

async function start() {
  //launch browser
  const browser = await puppeteer.launch();
  //open new page
  const page = await browser.newPage();
  //navigate to url
  await page.goto("https://learnwebcode.github.io/practice-requests/");

  const names = await page.evaluate(() => {
    // this run in browser not node
    return Array.from(document.querySelectorAll(".info strong")).map(
      (item) => item.textContent
    );
  });
  await fs.writeFile("names.txt", names.join("\r\n"));

  await page.click("#clickme");
  const clickedData = await page.$eval("#data", (el) => el.textContent);
  console.log(clickedData);

  const photos = await page.$$eval("img", (imgs) => {
    return imgs.map((img) => img.src);
  });

  //submit form
  await page.type("#ourfield", "blue");
  await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);
  const info = await page.$eval("#message", (el) => el.textContent);

  console.log(info);

  for (const photo of photos) {
    const image = await page.goto(photo);
    await fs.writeFile(photo.split("/").pop(), await image.buffer());
  }

  //close browser
  await browser.close();
}

// schedule task to run every 5 minutes
// cron.schedule("*/5 * * * * *", start);
