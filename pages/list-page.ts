import { type Page, expect } from '@playwright/test'
import { BasePage } from './base-page'

export class ListPage extends BasePage {
    // Variables
    readonly baseUrl = 'https://eviltester.github.io/simpletodolist/todo.html#/&';
    readonly newTaskPlaceholderText = 'Enter new todo text here';
    readonly pageHeading = (listHeading: string) => this.page.getByRole('heading', { name: listHeading });
    readonly newTaskInputField = this.page.getByPlaceholder(this.newTaskPlaceholderText);
    readonly taskDescription = (taskName: string) => this.page.getByText(taskName);
    readonly taskCheckbox = (taskName: string) => this.page.locator('div').filter({ hasText: taskName }).getByRole('checkbox');
    readonly filterLink = (filterOption: string) => this.page.getByRole('link', { name: filterOption });
    readonly taskDeleteButton = (taskName: string) => this.page.locator('div').filter({ hasText: taskName }).getByRole('button');
    readonly clearCompletedButton = this.page.getByRole('button', { name: 'Clear completed' });

    // Constructor
    constructor (page: Page) {
        super(page);
    }

    // Action Methods
    async createNewTask(taskName:string) {
        await this.newTaskInputField.fill(taskName);
        await this.page.keyboard.press('Enter');
    }

    async addTasksToList(tasks:string[]) {
        let num = 0;
        let max = tasks.length;
        for (num; num < max; num++) {
            await this.createNewTask(tasks[num]);
        }
    }

    async toggleTaskCompletion(taskName:string, complete:boolean) {
        if (complete) {
            await this.taskCheckbox(taskName).check();
        } else {
            await this.taskCheckbox(taskName).uncheck();
        }
    }

    async filterTasksOnList(filterOption:string) {
        await this.filterLink(filterOption).click();
    }

    async deleteTask(taskName:string) {
        await this.taskDeleteButton(taskName).click();
    }

    async clearCompletedTasks() {
        await this.clearCompletedButton.click();
    }

    // Assertion Methods
    async assertUrl(listTitle: string) {
        await expect(this.page).toHaveURL(this.baseUrl + listTitle);
    }

    async assertTaskIsComplete(locator, complete: boolean) {
        if (complete) {
            await expect(locator).toBeChecked();
        } else {
            await expect(locator).toBeChecked( {checked: false} );
        }
    }
}

export default ListPage;