import { type Locator, type Page } from '@playwright/test'

export class LoginPage {
    // Variables
    readonly userNameField = this.page.getByPlaceholder('Enter Username');
    readonly passwordField = this.page.getByPlaceholder('Enter Password');
    readonly loginButton = this.page.getByRole('button', { name: 'Login' });

    // Constructor
    constructor (private readonly page: Page) {}

    // Methods
    async login(username: string, password: string) {
        await this.userNameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }
}

export default LoginPage;