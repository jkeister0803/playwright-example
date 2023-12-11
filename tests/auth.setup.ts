import { test as setup } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';

const testData = JSON.parse(JSON.stringify(require('../testData.json')));
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
let homePage: HomePage;
let loginPage: LoginPage;

setup('authenticate', async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await page.goto(testData.URL);
    await homePage.goToPage(testData.loginLinkName);
    await loginPage.login(username, password);
    await page.waitForURL(testData.adminURL);
    await page.context().storageState({ path: testData.authFile });
});