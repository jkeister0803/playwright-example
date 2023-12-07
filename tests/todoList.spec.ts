import { test, expect } from '@playwright/test';

test('can create a todo list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Tests')).toBeVisible();
});

test('can access todo list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    await expect(page).toHaveURL('https://eviltester.github.io/simpletodolist/todo.html#/&Tests');
    await expect(page.getByRole('heading', { name: 'TODOs : Tests'})).toBeVisible();
});

// can add todos to list
test('can add tasks to list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    // TODO: loop for multiple tasks
    await page.getByPlaceholder('Enter new todo text here').fill('can log in');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can create list');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can add tasks to list');
    await page.keyboard.press('Enter');
    await expect(page.getByText('can log in')).toBeVisible();
    await expect(page.getByText('can create list')).toBeVisible();
    await expect(page.getByText('can add tasks to list')).toBeVisible();
});

// can complete todo on list
test('can complete tasks on list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    // TODO: loop for multiple tasks
    await page.getByPlaceholder('Enter new todo text here').fill('can log in');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can create list');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can add tasks to list');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox').check();
    await page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox').check();
    await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
    await expect(page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox')).toBeChecked();
});

// can uncheck completed todo
test('can uncheck completed task on list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    // TODO: loop for multiple tasks
    await page.getByPlaceholder('Enter new todo text here').fill('can log in');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can create list');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can add tasks to list');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox').check();
    await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
    await page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox').uncheck();
    await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked( {checked: false} );
});

// can filter todos
test('can filter tasks on list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    // TODO: loop for multiple tasks
    await page.getByPlaceholder('Enter new todo text here').fill('can log in');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can create list');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can add tasks to list');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox').check();
    await page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox').check();
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('div').getByRole('checkbox')).toBeChecked( {checked: false} );
    await expect(page.getByText('can create list')).toBeVisible();
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
    await expect(page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox')).toBeChecked();
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
    await expect(page.locator('div').filter({ hasText: 'can create list' }).getByRole('checkbox')).toBeChecked( {checked: false} );
    await expect(page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox')).toBeChecked();
});

// can delete todos from list
test('can delete tasks from list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    // TODO: loop for multiple tasks
    await page.getByPlaceholder('Enter new todo text here').fill('can log in');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can create list');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can add tasks to list');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('button').click();
    await expect(page.getByText('can add tasks to list')).toBeVisible( {visible: false} );
    await page.locator('div').filter({ hasText: 'can create list' }).getByRole('button').click();
    await expect(page.getByText('can create list')).toBeVisible( {visible: false} );
    await page.locator('div').filter({ hasText: 'can log in' }).getByRole('button').click();
    await expect(page.getByText('can log in')).toBeVisible( {visible: false} );
});

// can clear completed todos
test('can clear completed tasks from list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    // TODO: loop for multiple tasks
    await page.getByPlaceholder('Enter new todo text here').fill('can log in');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can create list');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can add tasks to list');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox').check();
    await page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await expect(page.getByText('can log in')).toBeVisible( {visible: false} );
    await expect(page.getByText('can create list')).toBeVisible();
    await expect(page.getByText('can add tasks to list')).toBeVisible( {visible: false} );
});

// can delete todo list
test('can delete todo list', async ({ page }) => {
    await page.goto('https://eviltester.github.io/simpletodolist/todolists.html');
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
    // TODO: loop for multiple tasks
    await page.getByPlaceholder('Enter new todo text here').fill('can log in');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can create list');
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('Enter new todo text here').fill('can add tasks to list');
    await page.keyboard.press('Enter');
    await page.getByRole('link', { name: 'lists' }).click();
    await expect(page.getByText('[use] Tests')).toBeVisible();
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toEqual('Are you sure you want to delete Tests?')
        await dialog.accept()
      })
      await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('button').click();
    // handle alert window
    await expect(page.getByText('[use] Tests')).toBeVisible( {visible: false} );
});