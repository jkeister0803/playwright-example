import { test as setup, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';

const URL = 'https://eviltester.github.io/simpletodolist/todolists.html';
const adminURL = 'https://eviltester.github.io/simpletodolist/adminview.html';
const authFile = 'playwright/.auth/user.json';
const loginLinkName = 'Admin Login';
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
let homePage: HomePage;
let loginPage: LoginPage;

setup('authenticate', async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await page.goto(URL);
    await homePage.goToPage(loginLinkName);
    await loginPage.login(username, password);
    await page.waitForURL(adminURL);
    await page.context().storageState({ path: authFile });
});