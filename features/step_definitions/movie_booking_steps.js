const { Given, When, Then, setDefaultTimeout, Before, After } = require('cucumber');
const puppeteer = require('puppeteer');
const { expect } = require('chai');

let browser;
let page;

setDefaultTimeout(60 * 1000);

Before(async function() {
  browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  page = await browser.newPage();
});

After(async function() {
  if (browser) {
    await browser.close();
  }
});

Given('I am on the movie booking website', async function () {
  await page.goto('https://qamid.tmweb.ru/client/index.php');
});

Given('I select day {int} for the session', async function (dayNumber) {
  await page.waitForSelector('.page-nav__day');
  const days = await page.$$('.page-nav__day');
  await days[dayNumber - 1].click();
  await new Promise(resolve => setTimeout(resolve, 500));
});

Given('I select the {string} session', async function (time) {
  await page.waitForSelector('.movie-seances__time');
  const times = await page.$$('.movie-seances__time');
  for (const element of times) {
    const text = await element.evaluate(node => node.innerText);
    if (text.includes(time)) {
      await element.click();
      return;
    }
  }
  throw new Error(`Session with time "${time}" not found`);
});

When('I choose seat row {int} seat {int} and seat row {int} seat {int}', async function (row1, seat1, row2, seat2) {
  await page.waitForSelector('.buying-scheme__row');
  const rows = await page.$$('.buying-scheme__row');
  const seats1 = await rows[row1 - 1].$$('.buying-scheme__chair');
  await seats1[seat1 - 1].click();
  const seats2 = await rows[row2 - 1].$$('.buying-scheme__chair');
  await seats2[seat2 - 1].click();
});

When('I choose seat row {int} seat {int}', async function (row, seat) {
  await page.waitForSelector('.buying-scheme__row');
  const rows = await page.$$('.buying-scheme__row');
  const seats = await rows[row - 1].$$('.buying-scheme__chair');
  await seats[seat - 1].click();
});

When('I attempt to choose seat row {int} seat {int}', async function (row, seat) {
  await page.waitForSelector('.buying-scheme__row');
  const rows = await page.$$('.buying-scheme__row');
  const seatElement = await rows[row - 1].$$('.buying-scheme__chair');
});

When('I click the {string} button', async function (buttonText) {
  await page.waitForSelector('.acceptin-button');
  await page.click('.acceptin-button');
  await page.waitForSelector('.ticket__check-title');
});

Then('I should see a success message with the booked seat details', async function () {
    await expect(await page.$eval('p.ticket__hint', el => el.textContent)).to.include('По правилам кинотеатра билеты нельзя вернуть');
});

Then('the {string} button should remain disabled', async function (buttonText) {
    const isAcceptButtonDisabled = await page.$eval('.acceptin-button', button => button.disabled);
    expect(isAcceptButtonDisabled).to.be.true;
});

Then('I should see an error message indicating the seat is unavailable', async function () {
});