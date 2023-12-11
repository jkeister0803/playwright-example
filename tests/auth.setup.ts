import { test as setup, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';

const URL = 'https://eviltester.github.io/simpletodolist/todolists.html';
const authFile = 'playwright/.auth/user.json';
let homePage: HomePage;
let loginPage: LoginPage;

setup('authenticate', async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await page.goto(URL);
    await homePage.goToLoginPage();
    await loginPage.login();
    await page.waitForURL('https://eviltester.github.io/simpletodolist/adminview.html');
    await page.context().storageState({ path: authFile });
});