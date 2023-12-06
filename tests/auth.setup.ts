import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByRole('link', { name: 'Admin Login' }).click();
    await page.getByPlaceholder('Enter Username').fill('Admin');
    await page.getByPlaceholder('Enter Password').fill('AdminPass');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('https://eviltester.github.io/simpletodolist/adminview.html');
    await page.context().storageState({ path: authFile });
});