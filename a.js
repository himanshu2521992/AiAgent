
import { test, expect } from "@playwright/test";
import { auto } from "auto-playwright";
import { chromium } from "playwright";
import { config } from 'dotenv';

config();
const options = {
  model: "gpt-4-1106-preview",
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const ai = { page };
  try {
    await page.goto("http://localhost:4200/cart");
    await auto("Click on Login link", ai, options);
    await auto("Fill username as 'user'", ai, options);
    await auto("input password as 'password'", ai, options);
    
    await auto('click submit button', ai);
    await expect(page).toHaveURL('http://localhost:4200');
  } catch (error) {
    console.error(error);
  } finally{
    browser.close();
  }
})();