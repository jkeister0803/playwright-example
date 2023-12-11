import { type Locator, type Page } from '@playwright/test'

export class LoginPage {
    // Variables
    readonly page: Page;
    readonly userNameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;

    // Constructor
    constructor (page: Page) {
        this.page = page;
        this.userNameField = page.getByPlaceholder('Enter Username');
        this.passwordField = page.getByPlaceholder('Enter Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    // Methods
    async login() {
        await this.userNameField.fill('Admin');
        await this.passwordField.fill('AdminPass');
        await this.loginButton.click();
    }
}

export default LoginPage;