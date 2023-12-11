import { test } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ListPage } from '../pages/list-page';

const testData = JSON.parse(JSON.stringify(require('../testData.json')));
let homePage: HomePage;
let listPage: ListPage;

test.beforeEach(async ({ page }) => {
    await page.goto(testData.URL);
    homePage = new HomePage(page);
    listPage = new ListPage(page);
});

// Tests
test.describe('Todo List Website', () => {
    test('can create a todo list', async () => {
        await homePage.createNewList(testData.listTitle);
        await homePage.assertNewListTitle(testData.listTitle);
    });
    
    test('can access todo list', async () => {
        await homePage.createNewList(testData.listTitle);
        await homePage.openTodoList(testData.listDescription);
        await listPage.assertUrl(testData.listTitle);
        await listPage.assertIsVisible(listPage.pageHeading(testData.listHeading), true);
    });
    
    test('can add tasks to list', async () => {
        let tasks: string[] = [testData.firstTask, testData.secondTask, testData.thirdTask];
        await homePage.createNewList(testData.listTitle);
        await homePage.openTodoList(testData.listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.assertIsVisible(listPage.taskDescription(testData.firstTask), true);
        await listPage.assertIsVisible(listPage.taskDescription(testData.secondTask), true);
        await listPage.assertIsVisible(listPage.taskDescription(testData.thirdTask), true);
    });
    
    test('can complete tasks on list', async () => {
        let tasks : string[] = [testData.firstTask, testData.secondTask, testData.thirdTask];
        await homePage.createNewList(testData.listTitle);
        await homePage.openTodoList(testData.listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(testData.firstTask, true);
        await listPage.toggleTaskCompletion(testData.thirdTask, true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.firstTask), true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.secondTask), false);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.thirdTask), true);
    });
    
    test('can uncheck completed task on list', async () => {
        let tasks : string[] = [testData.firstTask, testData.secondTask, testData.thirdTask];
        await homePage.createNewList(testData.listTitle);
        await homePage.openTodoList(testData.listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(testData.firstTask, true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.firstTask), true);
        await listPage.toggleTaskCompletion(testData.firstTask, false);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.firstTask), false);
    });
    
    test('can filter tasks on list', async () => {
        let tasks : string[] = [testData.firstTask, testData.secondTask, testData.thirdTask];
        await homePage.createNewList(testData.listTitle);
        await homePage.openTodoList(testData.listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(testData.firstTask, true);
        await listPage.toggleTaskCompletion(testData.thirdTask, true);
        await listPage.filterTasksOnList(testData.taskStatuses[1]);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.secondTask), false);
        await listPage.assertIsVisible(listPage.taskDescription(testData.secondTask), true);
        await listPage.filterTasksOnList(testData.taskStatuses[2]);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.firstTask), true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.thirdTask), true);
        await listPage.filterTasksOnList(testData.taskStatuses[0]);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.firstTask), true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.secondTask), false);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(testData.thirdTask), true);
    });
    
    test('can delete tasks from list', async () => {
        let tasks : string[] = [testData.firstTask, testData.secondTask, testData.thirdTask];
        await homePage.createNewList(testData.listTitle);
        await homePage.openTodoList(testData.listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.deleteTask(testData.thirdTask);
        await listPage.deleteTask(testData.secondTask);
        await listPage.deleteTask(testData.firstTask);
        await listPage.assertIsVisible(listPage.taskDescription(testData.thirdTask), false);
        await listPage.assertIsVisible(listPage.taskDescription(testData.secondTask), false);
        await listPage.assertIsVisible(listPage.taskDescription(testData.firstTask), false);
    });
    
    test('can clear completed tasks from list', async () => {
        let tasks : string[] = [testData.firstTask, testData.secondTask, testData.thirdTask];
        await homePage.createNewList(testData.listTitle);
        await homePage.openTodoList(testData.listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(testData.firstTask, true);
        await listPage.toggleTaskCompletion(testData.thirdTask, true);
        await listPage.clearCompletedTasks();
        await listPage.assertIsVisible(listPage.taskDescription(testData.firstTask), false);
        await listPage.assertIsVisible(listPage.taskDescription(testData.secondTask), true);
        await listPage.assertIsVisible(listPage.taskDescription(testData.thirdTask), false);
    });
    
    test('can delete todo list', async () => {
        let tasks : string[] = [testData.firstTask, testData.secondTask, testData.thirdTask];
        await homePage.createNewList(testData.listTitle);
        await homePage.openTodoList(testData.listDescription);
        await listPage.addTasksToList(tasks);
        await homePage.goToPage('lists');
        await homePage.assertIsVisible(homePage.newListTitle(testData.listDescription), true);
        await homePage.confirmListDeletion(testData.listTitle); // Waits for and confirms dialog triggered by following step
        await homePage.listDeleteButton(testData.listDescription).click();
        await homePage.assertIsVisible(homePage.newListTitle(testData.listDescription), false);
    });
});