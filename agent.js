import { config } from 'dotenv';
import fs from 'fs';
import { OpenAI } from 'openai';
import { chromium } from 'playwright';
import readlineSync from 'readline-sync';

// Load environment variables
config();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to process user input using OpenAI
async function processUserInput(userInput) {
  const prompt = `
    You are an intelligent assistant. Classify the following command into one of the following categories:
    The following words are synonyms for the respective actions:
    - "upload", "archive" -> upload_file
    - "delete", "remove" -> delete_file
    - "download", "get" -> download_file

    Command: "${userInput}"

    Classification:
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: "user", content: prompt }],
    max_tokens: 10,
    temperature: 0,
  });

  const action = response?.choices[0]?.message?.content;
  return action;
}

async function uploadFile(filePath = false) {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/client/login.html'); // Replace with your actual website
    // Ask the user for input
    const username = readlineSync.question('Please enter username: ');
    await page.fill('input[name="username"]', username);
    const pwd = await readlineSync.question('Please enter password: ', { hideEchoBack: true });
    await page.fill('input[name="password"]', pwd);

    console.log('\n\nTrying to login');
    await delay(2000);
    await page.getByRole('button', { name: "Login" }).click();

    if (await page.title() === 'Web Agent') {
      console.log('\n\nLogin successfull');

      await delay(1000);
      console.log('\n\nGoing to upload page');
      await page.click('#upload-button');
      // Submit the form if necessary
      await delay(2000);
      console.log('\n\nGoing to click upload button');
      await page.click('#submit_btn'); // Adjust the selector
      await delay(5000);
      console.log('\n\n\nFile uploaded successfully!');
      await browser.close();
    } else {
      console.log('Invalid username or password');
      await browser.close();
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// Main function to handle user input and trigger actions
async function main() {
  const userInput = readlineSync.question('Enter your request: ');
  const action = await processUserInput(userInput);

  if (action === 'upload_file') {
    await uploadFile();
  } else if (action === 'delete_file') {
    console.log("Delete file functionality is not implemented yet.");
  } else {
    console.log("Sorry, I didn't understand that command.");
  }
}

main().catch(console.error);
