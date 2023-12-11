import { test } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ListPage } from '../pages/list-page';

const URL: string = 'https://eviltester.github.io/simpletodolist/todolists.html';
const firstTask: string = 'can log in';
const secondTask: string = 'can create list';
const thirdTask: string = 'can add tasks to list';
const listHeading: string = 'TODOs : Tests';
const listTitle: string = 'Tests';
const listDescription: string = '[use] Tests';
const taskStatuses: string[] = ['All', 'Active', 'Completed'];
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
    
    test('can access todo list', async () => {
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        // ASSERTION(S):
        await listPage.assertUrl(listTitle);
        await listPage.assertIsVisible(listPage.pageHeading(listHeading), true);
    });
    
    test('can add tasks to list', async () => {
        let tasks: string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        // ASSERTION(S):
        await listPage.assertIsVisible(listPage.taskDescription(firstTask), true);
        await listPage.assertIsVisible(listPage.taskDescription(secondTask), true);
        await listPage.assertIsVisible(listPage.taskDescription(thirdTask), true);
    });
    
    test('can complete tasks on list', async () => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(firstTask, true);
        await listPage.toggleTaskCompletion(thirdTask, true);
        // ASSERTION(S):
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(firstTask), true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(secondTask), false);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(thirdTask), true);
    });
    
    test('can uncheck completed task on list', async () => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(firstTask, true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(firstTask), true);
        await listPage.toggleTaskCompletion(firstTask, false);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(firstTask), false);
    });
    
    test('can filter tasks on list', async () => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(firstTask, true);
        await listPage.toggleTaskCompletion(thirdTask, true);

        await listPage.filterTasksOnList(taskStatuses[1]);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(secondTask), false);
        await listPage.assertIsVisible(listPage.taskDescription(secondTask), true);

        await listPage.filterTasksOnList(taskStatuses[2]);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(firstTask), true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(thirdTask), true);

        await listPage.filterTasksOnList(taskStatuses[0]);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(firstTask), true);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(secondTask), false);
        await listPage.assertTaskIsComplete(listPage.taskCheckbox(thirdTask), true);
    });
    
    test('can delete tasks from list', async () => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);

        await listPage.deleteTask(thirdTask);
        await listPage.deleteTask(secondTask);
        await listPage.deleteTask(firstTask);
        await listPage.assertIsVisible(listPage.taskDescription(thirdTask), false);
        await listPage.assertIsVisible(listPage.taskDescription(secondTask), false);
        await listPage.assertIsVisible(listPage.taskDescription(firstTask), false);
    });
    
    test('can clear completed tasks from list', async () => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);
        await listPage.toggleTaskCompletion(firstTask, true);
        await listPage.toggleTaskCompletion(thirdTask, true);

        await listPage.clearCompletedTasks();
        await listPage.assertIsVisible(listPage.taskDescription(firstTask), false);
        await listPage.assertIsVisible(listPage.taskDescription(secondTask), true);
        await listPage.assertIsVisible(listPage.taskDescription(thirdTask), false);
    });
    
    test('can delete todo list', async () => {
        let tasks : string[] = [firstTask, secondTask, thirdTask];
        await homePage.createNewList(listTitle);
        await homePage.openTodoList(listDescription);
        await listPage.addTasksToList(tasks);

        await homePage.goToPage('lists');
        await homePage.assertIsVisible(homePage.newListTitle(listDescription), true);
        await homePage.confirmListDeletion(listTitle); // Waits for and confirms dialog triggered by following step
        await homePage.listDeleteButton(listDescription).click();
        await homePage.assertIsVisible(homePage.newListTitle(listDescription), false);
    });
});
