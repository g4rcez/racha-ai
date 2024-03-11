import { test, expect } from "@playwright/test";

test("Should test the creation of cart", async ({ page }) => {
  async function fillInput(
    query: string,
    value: string | number,
    expected = value,
  ) {
    await page.locator(query).fill(`${value}`);
    const v = await page.locator(query).inputValue();
    expect(v).toBe(`${expected}`);
  }

  async function addFriend(name: string) {
    await page.locator("input[name=user]").fill(name);
    const v = await page.locator("input[name=user]").inputValue();
    expect(v).toBe(name);
    await page.locator("button[data-id='add-friend']").click();
  }

  async function addProduct(
    name: string,
    price: string,
    quantity: number,
    perConsumer: number | string,
  ) {
    await page
      .locator('button[data-name="new-product"]')
      .scrollIntoViewIfNeeded();
    await page.locator('button[data-name="new-product"]').click();
    await fillInput("input[name=name]", name);
    await fillInput("input[name=monetary]", price);
    await fillInput("input[name=quantity]", quantity);
    const ul = await page.locator('ul[data-name="consumers"]');
    for (const row of await ul.all()) {
      const count = await row.locator("input[data-id]").count();
      for (let i = 0; i < count; i += 1) {
        const input = await row.locator("input[data-id]").nth(i);
        await input.scrollIntoViewIfNeeded();
        const value = await input.inputValue();
        expect(`${value}`).toBe(`${perConsumer}`);
      }
    }
    const save = await page.locator('button[data-name="save-product"]');
    await save.scrollIntoViewIfNeeded();
    await save.click();
  }

  await page.goto("https://localhost:1337/app");
  await page.locator("input[name=name]").fill("Racha aí");
  const v = await page.locator("input[name=name]").inputValue();
  expect(v).toBe("Racha aí");
  await page.locator("button[type=submit]").click();
  await page.locator("a[href='/app/friends']").click();

  await addFriend("Fulano");
  await addFriend("Ciclano");
  await addFriend("Beltrano");
  await addFriend("Zeltrano");
  await page.locator("a[href='/app/cart']").click();
  await page.locator("input[name=title]").fill("Racha aí - Restaurant");
  await page.locator("button[data-name=share-friends]").click();
  const ul = await page.locator("ul[data-name=friends]");
  for (const row of await ul.all()) {
    const count = await row.locator("input[type=checkbox]").count();
    for (let i = 0; i < count; i += 1) {
      await row.locator("input[type=checkbox]").nth(i).check();
    }
  }
  await page.locator("button[data-name=save]").click();
  await addProduct("Heineken", "R$ 15,00", 5, 1);
  await addProduct("Batata", "R$ 40,00", 1, "1/5");
});
