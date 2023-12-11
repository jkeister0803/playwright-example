import { type Locator, type Page } from '@playwright/test'

export class ListPage {
    // Variables
    readonly newTaskPlaceholderText = 'Enter new todo text here';
    readonly newTaskInputField = this.page.getByPlaceholder(this.newTaskPlaceholderText);
    readonly taskCheckbox = (taskName: string) => this.page.locator('div').filter({ hasText: taskName }).getByRole('checkbox');
    readonly filterLink = (filterOption: string) => this.page.getByRole('link', { name: filterOption });
    readonly taskDeleteButton = (taskName: string) => this.page.locator('div').filter({ hasText: taskName }).getByRole('button');
    readonly clearCompletedButton = this.page.getByRole('button', { name: 'Clear completed' });

    // Constructor
    constructor (private readonly page: Page) {}

    // Methods
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
}

export default ListPage;