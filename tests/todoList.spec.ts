import { test, expect } from '@playwright/test';

test('can create a new todo list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Tests')).toBeVisible();
});