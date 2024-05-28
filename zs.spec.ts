
import { test, expect } from "@playwright/test";
import { ai } from '@zerostep/playwright'

test("auto Playwright example", async ({ page }) => {
  try {
    await page.goto("http://localhost:4200/login");
    const aiArgs = { page, test };
    // await ai('Click on the "Login" button', aiArgs);
    await ai('Fill username as "user"', aiArgs);
    await ai('input password as "password"', aiArgs);
    await ai('Click on "submit" button', aiArgs);
    await expect(page).toHaveURL('http://localhost:4200');
  } catch (error) {
    console.error(error);
  }
});
// test('zerostep example', async ({ page }) => {
//   await page.goto('https://zerostep.com/')

//   // An object with page and test must be passed into every call
//   const aiArgs = { page, test }
//   const headerText = await ai('Get the header text', aiArgs)
//   await page.goto('https://google.com/')
//   await ai(`Type "${headerText}" in the search box`, aiArgs)
//   await ai('Press enter', aiArgs)
// })