const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cron = require("node-cron");

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

start2();

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
