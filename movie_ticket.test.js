const puppeteer = require('puppeteer');

describe('Movie Booking Tests', () => {
  let browser;
  let page;

  async function selectDay(dayNumber) {
    await page.waitForSelector('.page-nav__day');
    const days = await page.$$('.page-nav__day');
    await days[dayNumber - 1].click();
    await page.waitForTimeout(500); 
  }

  async function selectSession(time) {
    await page.waitForSelector('.movie-seances__time');
    const times = await page.$$('.movie-seances__time');
    for (const element of times) {
      const text = await element.evaluate(node => node.innerText);
      if (text.includes(time)) {
        await element.click();
        return;
      }
    }
    throw new Error(`Сеанс со временем "${time}" не найден`);
  }

  async function selectSeats(row, seat) {
    await page.waitForSelector('.buying-scheme__row');
    const rows = await page.$$('.buying-scheme__row');
    const seats = await rows[row - 1].$$('.buying-scheme__chair'); 
    await seats[seat - 1].click();
  }

  async function confirmBooking() {
    await page.waitForSelector('.acceptin-button');
    await page.click('.acceptin-button');
    await page.waitForSelector('.ticket__check-title');
  }

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('https://qamid.tmweb.ru/client/index.php');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('Should book two seats successfully', async () => {
    const dayToSelect = 1;
    const sessionTime = "10:00";
    const row1 = 5;
    const seat1 = 5;
    const row2 = 5;
    const seat2 = 6;

    await selectDay(dayToSelect);
    await selectSession(sessionTime);
    await selectSeats(row1, seat1);
    await selectSeats(row2, seat2);
    await confirmBooking();

    await expect(page).toMatchElement('p.ticket__hint', { text: 'По правилам кинотеатра билеты нельзя вернуть' });
  });

  it('Should book one seat successfully', async () => {
    const dayToSelect = 2;
    const sessionTime = "12:00";
    const row = 3;
    const seat = 4;

    await selectDay(dayToSelect);
    await selectSession(sessionTime);
    await selectSeats(row, seat);
    await confirmBooking();

    await expect(page).toMatchElement('p.ticket__hint', { text: 'По правилам кинотеатра билеты нельзя вернуть' });
  });

  it('Should not allow booking an already booked seat', async () => {
    const dayToSelect = 3;
    const sessionTime = "14:00";
    const row = 1;
    const seat = 1;

    await selectDay(dayToSelect);
    await selectSession(sessionTime);
    await selectSeats(row, seat);

    const isAcceptButtonDisabled = await page.$eval('.acceptin-button', button => button.disabled);
    expect(isAcceptButtonDisabled).toBe(true);
  });
});