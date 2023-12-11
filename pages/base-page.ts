import { type Page, expect } from '@playwright/test'

export class BasePage {
    // Constructor
    constructor (protected readonly page: Page) {}

    // Methods
    async assertIsVisible(locator, isVisible: boolean) {
        if (isVisible) {
            await expect(locator).toBeVisible();
        } else {
            await expect(locator).toBeVisible( {visible: false} );
        }
    }
}

export default BasePage;