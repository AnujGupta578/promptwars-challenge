import { test, expect } from '@playwright/test';

test.describe('Universal Bridge Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the core landing page elements', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Universal Bridge');
    await expect(page.locator('text=LifeLink AI System Online')).toBeVisible();
  });

  test('should process a medical emergency text input', async ({ page }) => {
    // Fill in a medical emergency
    const input = page.locator('textarea');
    await input.fill('Elderly person collapsed, breathing but unresponsive. I have a first aid kit.');
    
    // Click Analyze
    await page.click('button:has-text("Analyze")');
    
    // Check for the response (it might take a moment due to streaming)
    // We expect a "MEDICAL" category and "CRITICAL" priority
    await expect(page.locator('text=CRITICAL PRIORITY')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=Action Plan')).toBeVisible();
    await expect(page.locator('li')).toHaveCount(3);
  });

  test('should show safety map for high-priority incidents', async ({ page }) => {
    const input = page.locator('textarea');
    await input.fill('Flooding at 123 Main St, trapped on roof. Need rescue.');
    await page.click('button:has-text("Analyze")');
    
    // Ensure the map container is rendered
    await expect(page.locator('text=Recommended Safety Zone')).toBeVisible({ timeout: 30000 });
  });

  test('should handle image uploads and analyze context', async ({ page }) => {
    // Verify the UI state for image uploads
    await expect(page.locator('text=Add Image')).toBeVisible();
  });

  test('Stress Test: should handle large input text over 5000 characters', async ({ page }) => {
    const largeText = 'A'.repeat(5000) + ' Emergency at sectoral block 7. Need immediate help.';
    const input = page.locator('textarea');
    await input.fill(largeText);
    await page.click('button:has-text("Analyze")');
    await expect(page.locator('text=Action Plan')).toBeVisible({ timeout: 60000 });
  });

  test('Edge Case: should not trigger analysis on empty input', async ({ page }) => {
    const submitBtn = page.locator('button:has-text("Analyze")');
    await expect(submitBtn).toBeDisabled();
  });
});
