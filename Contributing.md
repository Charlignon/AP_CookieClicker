## Generate APworld
### With script
Run the [build.sh](./build.sh) file. Require zip to be installed.
### Manually
Compress the whole `cookieclicker` folder into a zip, and replace `.zip` by `.apworld`. Be careful, the folder itself should be at the root of the archive, not the files themselves. You can ommit the `__pycache__` subfolder.
```
cookieclicker.apworld
    └─ cookieclicker/
       └─ *.py
```

## Run tests

In order to prevent regression and other bugs due to inattention, a suite of integration tests is available for the project.
Every PR will have to pass these checks in order to be validated and merged.

### Install and run
[The test script](./tests/APModCookieClickerTests.user.js) can be installed the same way as the client script, by opening the [raw file](https://raw.githubusercontent.com/Charlignon/AP_CookieClicker/refs/heads/main/tests/APModCookieClickerTests.user.js) in your browser. It will run automatically upon connecting to a game.
1. Install or update the test script from source
2. Create and host an Archipelago game with a CC slot. The parameters don't matter
3. Open the [CC website](https://orteil.dashnet.org/cookieclicker/) and connect to a game
    - The test suite will erase everything and probably send checks ! Don't use it on a public save*
4. Confirm that you want to wipe your save
5. Open the console to see the test result
   - For better readability, filter out debug level logs

### How to debug
All failed tests will be displayed in the error console. You can use these objects in your console to debug them. Below is an example of what your would type in your console :
```javascript
$ temp0 // the var is stored in console context
$ temp0.run() // Run the test again
$ temp0.result // Print the error in console
$ temp0.run() // Run again, this time with a debugger breakpoint
```
### How to add tests

Reach all the way down in [the test script](./tests/APModCookieClickerTests.user.js) : this is where tests are added. Create a `TestSuite` to group your tests, then use the utility methods in the `APCC` object to write your tests. Here is an example:

```javascript
const myTestSuite = new TestSuite("RELEVANT_NAME", 
  new Test("test1ShouldBeValid", () => {
    APCC.receiveItems("Kitten specialists");
    
    assert("Some effect should be observed", Game.something > 0);
  }),
  ...
);
```
Some  infos, recommendations and guidelines for test writing: 
- ~~The first rule of testing is to have fun and be yourself~~
- The game/AP context is cleared automatically before each test
- Try to have very explicit names for your tests and assertions. You can use the format `[condition]Should[effect]`
- Avoid making tests on graphical elements, are those are prone to change and very dependent on settings configuration 
- If possible, avoid computing data directly in your text body, make a Utils function for that