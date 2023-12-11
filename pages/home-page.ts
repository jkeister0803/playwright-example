import { type Page, expect } from '@playwright/test'
import { BasePage } from './base-page'

export class HomePage extends BasePage {

    readonly newListPlaceholderText = 'Enter new todo list name here';
    readonly navLink = (pageName: string) => this.page.getByRole('link', { name: pageName });
    readonly newListInputField = this.page.getByPlaceholder(this.newListPlaceholderText);
    readonly newListLink = (listDescription: string) => this.page.locator('div').filter({ hasText: listDescription }).getByRole('link');
    readonly newListTitle = (listTitle: string) => this.page.getByText(listTitle);
    readonly listDeleteButton = (listDescription: string) => this.page.locator('div').filter({ hasText: listDescription }).getByRole('button');

    constructor (page: Page) {
        super(page);
    }

    // Action Methods
    async goToPage(pageName:string) {
        await this.navLink(pageName).click();
    }
    
    async createNewList(listTitle: string) {
        await this.newListInputField.fill(listTitle);
        await this.page.keyboard.press('Enter');
    }

    async openTodoList(listDescription: string) {
        await this.newListLink(listDescription).click();
    }

    async confirmListDeletion(listTitle:string) {
        this.page.on('dialog', async (dialog) => {
            expect(dialog.message()).toEqual('Are you sure you want to delete ' + listTitle + '?')
            await dialog.accept()
        })
    }

    // Assertion Methods
    async assertNewListTitle(listTitle: string) {
        await expect(this.newListTitle(listTitle)).toBeVisible();
    }
}

export default HomePage;