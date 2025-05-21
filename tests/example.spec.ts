import { test, expect } from '@playwright/test';

test('Robot picks up and delivers parcels', async ({ page }) => {
  // Navigate to the HTML page
  await page.goto('http://localhost:8080'); // Update with your server URL

  // Verify that the start button is visible
  const startButton = page.locator('#startButton');
  await expect(startButton).toBeVisible();

  // Click the start button to begin the delivery process
  await startButton.click();

  // Wait for the first parcel to be picked up
  await page.waitForSelector('#parcel-0', { state: 'hidden' });

  // Verify that the first parcel is removed from the map
  const firstParcel = page.locator('#parcel-0');
  await expect(firstParcel).not.toBeVisible();

  // Wait for the first parcel to be delivered
  await page.waitForSelector('.parcel', { state: 'visible' });

  // Verify that the first parcel is delivered to the correct location
  let deliveredParcel = page.locator('.parcel');
  let deliveredParcelCount = await deliveredParcel.count();
  await expect(deliveredParcelCount).toBe(1);

  // Wait for the second parcel to be picked up
  await page.waitForSelector('#parcel-1', { state: 'hidden' });

  // Verify that the second parcel is removed from the map
  const secondParcel = page.locator('#parcel-1');
  await expect(secondParcel).not.toBeVisible();

  // Wait for the second parcel to be delivered
  await page.waitForTimeout(3000); // Adjust the timeout as needed

  // Verify that the second parcel is delivered to the correct location
  deliveredParcel = page.locator('.parcel');
  deliveredParcelCount = await deliveredParcel.count();
  await expect(deliveredParcelCount).toBe(2);

  // Log completion
  console.log('All parcels processed!');
});
