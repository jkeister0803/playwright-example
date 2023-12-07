import { test, expect } from '@playwright/test';

test('can create a new todo list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Tests')).toBeVisible();
});

test('can access todos list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Tests')).toBeVisible();
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    await expect(page).toHaveURL('https://eviltester.github.io/simpletodolist/todo.html#/&Tests');
    await expect(page.getByRole('heading', { name: 'TODOs : Tests'})).toBeVisible();
});

// can add todos to list
// can complete todo on list
// can view completed todos
// can view open todos
// can delete todos from list
// can clear completed todos
// can delete open todos
// can delete todo list