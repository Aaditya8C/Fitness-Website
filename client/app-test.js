const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function runTests() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000");
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Welcome to Fittrack')]")
      ),
      10000
    );
    console.log("Authentication page loaded successfully.");
    await driver.sleep(1000);

    const emailInput = await driver.findElement(
      By.xpath("//input[@placeholder='Enter your email address']")
    );
    await emailInput.clear();
    await emailInput.sendKeys("aadi@gmail.com");
    await driver.sleep(1000);

    const passwordInput = await driver.findElement(
      By.xpath("//input[@placeholder='Enter your password']")
    );
    await passwordInput.clear();
    await passwordInput.sendKeys("123456");
    await driver.sleep(1000);

    const signInButton = await driver.findElement(
      By.xpath("//*[contains(text(),'SignIn')]")
    );
    await signInButton.click();
    await driver.sleep(1000);

    try {
      let alertDialog = await driver.switchTo().alert();
      console.log("Alert text:", await alertDialog.getText());
      await alertDialog.accept();
    } catch (alertErr) {
      console.log("No alert was present.");
    }

    await driver.wait(
      until.elementLocated(By.className("dashboard-title")),
      10000
    );
    await driver.sleep(1000);

    const dashboardTitle = await driver
      .findElement(By.className("dashboard-title"))
      .getText();
    assert.strictEqual(
      dashboardTitle,
      "Dashboard",
      'Dashboard title should be "Dashboard"'
    );
    console.log("Dashboard page loaded successfully.");
    await driver.sleep(3000);

    const workoutInput = await driver.findElement(By.css("textarea"));
    await workoutInput.clear();
    await workoutInput.sendKeys(
      "#Cardio\n-Running\n-3 setsX10 reps\n-0kg\n-30min"
    );
    await driver.sleep(1000);

    const addWorkoutButton = await driver.findElement(
      By.xpath("//*[contains(text(),'Add Workout')]")
    );
    await addWorkoutButton.click();
    await driver.sleep(1000);

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Running')]")),
      5000
    );
    const newWorkout = await driver
      .findElement(By.xpath("//*[contains(text(),'Running')]"))
      .getText();
    assert.ok(
      newWorkout.includes("Running"),
      "New workout should be added and visible."
    );
    console.log("Add Workout test passed.");
    await driver.sleep(3000);

    await driver.get("http://localhost:3000/workouts");
    await driver.wait(
      until.elementLocated(By.className("MuiPickersCalendar-root")),
      10000
    );
    console.log("Workouts page loaded successfully.");
    await driver.sleep(1000);

    const dateButton = await driver.findElement(By.xpath("//button[.='15']"));
    await dateButton.click();
    await driver.sleep(1000);

    const workoutCards = await driver.findElements(By.className("WorkoutCard"));
    console.log(
      "Workouts page: found",
      workoutCards.length,
      "workout card(s) for selected date."
    );
    await driver.sleep(3000);
  } catch (error) {
    console.error("Test failed:", error.message);
  } finally {
    await driver.quit();
  }
}

runTests();
