import { test, expect, type Page } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ListPage } from '../pages/list-page';

const URL = 'https://eviltester.github.io/simpletodolist/todolists.html';
const firstTask = 'can log in';
const secondTask = 'can create list';
const thirdTask = 'can add tasks to list';
const listTitle = 'Tests';
const listDescription = '[use] Tests';
let homePage: HomePage;
let listPage: ListPage;

test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    homePage = new HomePage(page);
    listPage = new ListPage(page);
});

// --------------------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------------------

test.describe('Todo List Website', () => {
    test('can create a todo list', async () => {
        await homePage.createNewList(listTitle);
        await homePage.assertNewListTitle(listTitle);
    });
    
    test('can access todo list', async ({ page }) => {
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        // ASSERTION(S):
        await expect(page).toHaveURL('https://eviltester.github.io/simpletodolist/todo.html#/&Tests');
        await expect(page.getByRole('heading', { name: 'TODOs : Tests'})).toBeVisible();
    });
    
    test('can add tasks to list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        // ASSERTION(S):
        await expect(page.getByText(firstTask)).toBeVisible();
        await expect(page.getByText(secondTask)).toBeVisible();
        await expect(page.getByText(thirdTask)).toBeVisible();
    });
    
    test('can complete tasks on list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(firstTask, true);
        await listPage.toggleTaskCompletion(thirdTask, true);
        // ASSERTION(S):
        await expect(page.locator('div').filter({ hasText: firstTask }).getByRole('checkbox')).toBeChecked();
        await expect(page.locator('div').filter({ hasText: secondTask }).getByRole('checkbox')).toBeChecked( {checked: false} );
        await expect(page.locator('div').filter({ hasText: thirdTask }).getByRole('checkbox')).toBeChecked();
    });
    
    test('can uncheck completed task on list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(firstTask, true);
        await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
        await listPage.toggleTaskCompletion(firstTask, false);
        await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked( {checked: false} );
    });
    
    test('can filter tasks on list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(firstTask, true);
        await listPage.toggleTaskCompletion(thirdTask, true);

        await listPage.filterTasksOnList('Active');
        await expect(page.locator('div').getByRole('checkbox')).toBeChecked( {checked: false} );
        await expect(page.getByText('can create list')).toBeVisible();

        await listPage.filterTasksOnList('Completed');
        await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
        await expect(page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox')).toBeChecked();

        await listPage.filterTasksOnList('All');
        await expect(page.locator('div').filter({ hasText: 'can log in' }).getByRole('checkbox')).toBeChecked();
        await expect(page.locator('div').filter({ hasText: 'can create list' }).getByRole('checkbox')).toBeChecked( {checked: false} );
        await expect(page.locator('div').filter({ hasText: 'can add tasks to list' }).getByRole('checkbox')).toBeChecked();
    });
    
    test('can delete tasks from list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);

        await listPage.deleteTask(thirdTask);
        await listPage.deleteTask(secondTask);
        await listPage.deleteTask(firstTask);
        await expect(page.getByText(thirdTask)).toBeVisible( {visible: false} );
        await expect(page.getByText(secondTask)).toBeVisible( {visible: false} );
        await expect(page.getByText(firstTask)).toBeVisible( {visible: false} );
    });
    
    test('can clear completed tasks from list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(firstTask, true);
        await listPage.toggleTaskCompletion(thirdTask, true);

        await listPage.clearCompletedTasks();
        await expect(page.getByText('can log in')).toBeVisible( {visible: false} );
        await expect(page.getByText('can create list')).toBeVisible();
        await expect(page.getByText('can add tasks to list')).toBeVisible( {visible: false} );
    });
    
    test('can delete todo list', async ({ page }) => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);

        await homePage.goToPage('lists');
        await expect(page.getByText('[use] Tests')).toBeVisible();
        await homePage.confirmListDeletion('Tests');
        await homePage.listDeleteButton(listDescription).click();
        await expect(page.getByText('[use] Tests')).toBeVisible( {visible: false} );
    });
});
