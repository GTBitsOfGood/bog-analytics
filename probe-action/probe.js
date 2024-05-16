import { Browser, Builder, By, Key, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';

// Define the URL of the webpage you want to visit
const url = 'https://bog-analytics.streamlit.app/';

// Define the text of the button you want to click
const buttonText = 'app back up';

async function main() {
    // Create Chrome options with headless mode
    let chromeOptions = new Options();
    chromeOptions.addArguments('--headless', '--disable-gpu', '--no-sandbox');
        
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(chromeOptions).build();
    
    try {
        await driver.get(url);
        await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), '${buttonText}')]`)), 10000);
        let button = await driver.findElement(By.xpath(`//button[contains(text(), '${buttonText}')]`));
        await button.click();
        console.log('Button clicked successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Close the WebDriver instance
        await driver.quit();
    }
}

// Call the main function to run the script
main();
