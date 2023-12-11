import { type Page } from '@playwright/test'

export class LoginPage {
    
    readonly userNameField = this.page.getByPlaceholder('Enter Username');
    readonly passwordField = this.page.getByPlaceholder('Enter Password');
    readonly loginButton = this.page.getByRole('button', { name: 'Login' });

    constructor (private readonly page: Page) {}

    async login(username: string, password: string) {
        await this.userNameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }
}

export default LoginPage;