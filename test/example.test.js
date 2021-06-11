'use strict';

const { Builder, Capabilities, By} = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome')
const { Eyes, Target, BatchInfo} = require('@applitools/eyes-selenium');

describe('DemoApp', function () {
    let eyes, driver;

    before(async () => {

        const options = new Options();
        if (process.env.CI === 'true') options.headless();
        // Use Chrome browser
        driver = await new Builder()
            .withCapabilities(Capabilities.chrome())
            .setChromeOptions(options)
            .build();

        // Initialize the eyes SDK
        eyes = new Eyes();

        // set new batch
        eyes.setBatch(new BatchInfo('Demo batch'))

    });

    it('Smoke Test', async () => {
        // Set AUT's name, test name and viewport size (width X height)
        // We have set it to 800 x 600 to accommodate various screens. Feel free to
        // change it.
        await eyes.open(driver, 'Demo App - Selenium JavaScript 3', 'Smoke Test', { width: 800, height: 600});

        // Navigate the browser to the "ACME" demo app.
        await driver.get("https://demo.applitools.com");

        // To see visual bugs after the first run, use the commented line below instead.
        // await driver.get("https://demo.applitools.com/index_v2.html");

        // Visual checkpoint #1 - Check the login page. using the fluent API
        // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html?Highlight=fluent%20api
        await eyes.check("Login Window", Target.window().fully());

        // This will create a test with two test steps.
        await driver.findElement(By.id("log-in")).click();

        // Visual checkpoint #2 - Check the app page.
        await eyes.check("App Window", Target.window().fully());

        // End the test.
        const results = await eyes.close();
        console.log(results);
    });

    after(async () => {
        // Close the browser.
        await driver.quit();

        // If the test was aborted before eyes.close was called, ends the test as aborted.
        await eyes.abort();
    });
});