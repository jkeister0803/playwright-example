import { test, expect, type Page } from '@playwright/test';

const URL = 'https://eviltester.github.io/simpletodolist/todolists.html';
const firstTask = 'can log in';
const secondTask = 'can create list';
const thirdTask = 'can add tasks to list';

test.beforeEach(async ({ page }) => {
    await page.goto(URL);
});

// --------------------------------------------------------------------------------
// Helper Functions
// --------------------------------------------------------------------------------

async function createNewList(page:Page) {
    await page.getByPlaceholder('Enter new todo list name here').fill('Tests');
    await page.keyboard.press('Enter');
}

async function openTodoList(page:Page) {
    await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link').click();
}

async function createNewTask(page:Page, taskName:string) {
    await page.getByPlaceholder('Enter new todo text here').fill(taskName);
    await page.keyboard.press('Enter');
}

async function addTasksToList(page:Page, tasks:string[]) {
    let num = 0;
    let max = tasks.length;
    for (num; num < max; num++) {
        await createNewTask(page, tasks[num]);
    }
}

async function toggleTaskCompletion(page:Page, taskName:string, complete:boolean) {
    if (complete) {
        await page.locator('div').filter({ hasText: taskName }).getByRole('checkbox').check();
    } else {
        await page.locator('div').filter({ hasText: taskName }).getByRole('checkbox').uncheck();
    }
}

async function filterTasksOnList(page:Page, filterOption:string) {
    await page.getByRole('link', { name: filterOption }).click();
}

async function deleteTask(page:Page, taskName:string) {
    await page.locator('div').filter({ hasText: taskName }).getByRole('button').click();
}

async function clearCompletedTasks(page:Page) {
    await page.getByRole('button', { name: 'Clear completed' }).click();
}

async function goToPage(page:Page, pageName:string) {
    await page.getByRole('link', { name: pageName }).click();
}

async function confirmListDeletion(page:Page, listTitle:string) {
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toEqual('Are you sure you want to delete ' + listTitle + '?')
        await dialog.accept()
    })
}

// --------------------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------------------

test.describe('Todo List Website', () => {
    test('can create a todo list', async ({ page }) => {
        await createNewList(page);
        // ASSERTION(S):
        await expect(page.getByText('Tests')).toBeVisible();
    });
    
    test('can access todo list', async ({ page }) => {
        await createNewList(page);
        await openTodoList(page);
        // ASSERTION(S):
        await expect(page).toHaveURL('https://eviltester.github.io/simpletodolist/todo.html#/&Tests');
        await expect(page.getByRole('heading', { name: 'TODOs : Tests'})).toBeVisible();
    });
    
    test('can add tasks to list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await createNewList(page);
        await openTodoList(page);
        await addTasksToList(page, tasks);
        // ASSERTION(S):
        await expect(page.getByText(firstTask)).toBeVisible();
        await expect(page.getByText(secondTask)).toBeVisible();
        await expect(page.getByText(thirdTask)).toBeVisible();
    });
    
    test('can complete tasks on list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await createNewList(page);
        await openTodoList(page);
        await addTasksToList(page, tasks);
        await toggleTaskCompletion(page, firstTask, true);
        await toggleTaskCompletion(page, thirdTask, true);
        // ASSERTION(S):
        await expect(page.locator('div').filter({ hasText: firstTask }).getByRole('checkbox')).toBeChecked();
        await expect(page.locator('div').filter({ hasText: secondTask }).getByRole('checkbox')).toBeChecked( {checked: false} );
        await expect(page.locator('div').filter({ hasText: thirdTask }).getByRole('checkbox')).toBeChecked();
    });
    
    test('can uncheck completed task on list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await createNewList(page);
        await openTodoList(page);
        await addTasksToList(page, tasks);
        await toggleTaskCompletion(page, firstTask, true);
        await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
        await toggleTaskCompletion(page, firstTask, false);
        await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked( {checked: false} );
    });
    
    test('can filter tasks on list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await createNewList(page);
        await openTodoList(page);
        await addTasksToList(page, tasks);
        await toggleTaskCompletion(page, firstTask, true);
        await toggleTaskCompletion(page, thirdTask, true);

        await filterTasksOnList(page, 'Active');
        await expect(page.locator('div').getByRole('checkbox')).toBeChecked( {checked: false} );
        await expect(page.getByText('can create list')).toBeVisible();

        await filterTasksOnList(page, 'Completed');
        await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
        await expect(page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox')).toBeChecked();

        await filterTasksOnList(page, 'All');
        await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
        await expect(page.locator('div').filter({ hasText: 'can create list' }).getByRole('checkbox')).toBeChecked( {checked: false} );
        await expect(page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox')).toBeChecked();
    });
    
    test('can delete tasks from list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await createNewList(page);
        await openTodoList(page);
        await addTasksToList(page, tasks);

        await deleteTask(page, thirdTask);
        await deleteTask(page, secondTask);
        await deleteTask(page, firstTask);
        await expect(page.getByText(thirdTask)).toBeVisible( {visible: false} );
        await expect(page.getByText(secondTask)).toBeVisible( {visible: false} );
        await expect(page.getByText(firstTask)).toBeVisible( {visible: false} );
    });
    
    test('can clear completed tasks from list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await createNewList(page);
        await openTodoList(page);
        await addTasksToList(page, tasks);
        await toggleTaskCompletion(page, firstTask, true);
        await toggleTaskCompletion(page, thirdTask, true);

        await clearCompletedTasks(page);
        await expect(page.getByText('can log in')).toBeVisible( {visible: false} );
        await expect(page.getByText('can create list')).toBeVisible();
        await expect(page.getByText('can add tasks to list')).toBeVisible( {visible: false} );
    });
    
    test('can delete todo list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await createNewList(page);
        await openTodoList(page);
        await addTasksToList(page, tasks);

        await goToPage(page, 'lists');
        await expect(page.getByText('[use] Tests')).toBeVisible();
        await confirmListDeletion(page, 'Tests');
        await page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('button').click();
        await expect(page.getByText('[use] Tests')).toBeVisible( {visible: false} );
    });
});
