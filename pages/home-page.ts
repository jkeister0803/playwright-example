import { type Locator, type Page, expect } from '@playwright/test'

export class HomePage {
    // Variables
    readonly page:Page;
    readonly listsLink: Locator;
    readonly adminLoginLink: Locator;
    readonly logoutLink: Locator;
    readonly newListInputField: Locator;
    readonly newListLink: Locator;
    readonly newListTitle: Locator;
    readonly listDeleteButton: Locator;

    // Constructor
    constructor (page: Page) {
        this.page = page;
        this.listsLink = page.getByRole('link', { name: 'lists' });
        this.adminLoginLink = page.getByRole('link', { name: 'Admin Login' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.newListInputField = page.getByPlaceholder('Enter new todo list name here');
        this.newListLink = page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('link'); // refactor for dynamic list name
        this.newListTitle = page.getByText('Tests');
        this.listDeleteButton = page.locator('div').filter({ hasText: '[use] Tests' }).getByRole('button'); // refactor for dynamic list name
    }

    // Action Methods
    async goToLoginPage() {
        await this.adminLoginLink.click();
    }
    
    async createNewList() {
        await this.newListInputField.fill('Tests');
        await this.page.keyboard.press('Enter');
    }

    async openTodoList() {
        await this.newListLink.click();
    }

    async confirmListDeletion(listTitle:string) {
        this.page.on('dialog', async (dialog) => {
            expect(dialog.message()).toEqual('Are you sure you want to delete ' + listTitle + '?')
            await dialog.accept()
        })
    }

    // Assertion Methods
    async assertNewListTitle() {
        await expect(this.newListTitle).toBeVisible();
    }
}

export default HomePage;