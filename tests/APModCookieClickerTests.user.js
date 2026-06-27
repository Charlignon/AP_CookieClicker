// ==UserScript==
// @name         AP_CookieClicker_Tests
// @version      2026-06-27
// @description  Archipelago client for Cookie Clicker
// @author       Charlignon
// @homepageURL  https://github.com/Charlignon/AP_CookieClicker
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @top-level-await
// ==/UserScript==

window.APCC_TESTING_FLAG = true;
console.log("AP Cookie Clicker test suite loaded")

/**************************************
 *          HELPER METHODS            *
 **************************************/

/**
 * @param {string} description
 * @param {boolean} condition
 */
function assert(description, condition) {
  if (!condition) {
    throw new Error(`Check "${description}" did not validate`)
  }
}

function doXTimes(times, callback) {
  for (let i = 0; i < times; i++) {
    callback(times);
  }
}

class Building {
  name;
  id;

  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
}

const BUILDINGS = {
  CURSOR: new Building("Cursor", 0),
  GRANDMA: new Building("Grandma", 1),
  FARM: new Building("Farm", 2),
  MINE: new Building("Mine", 3),
  FACTORY: new Building("Factory", 4),
  BANK: new Building("Bank", 5),
  TEMPLE: new Building("Temple", 6),
  WIZARD_TOWER: new Building("Wizard Tower", 7),
  SHIPMENT: new Building("Shipment", 8),
  ALCHEMY_LAB: new Building("Alchemy Lab", 9),
  PORTAL: new Building("Portal", 10),
  TIME_MACHINE: new Building("Time Machine", 11),
  ANTIMATTER_CONDENSER: new Building("Antimatter Condenser", 12),
  PRISM: new Building("Prism", 13),
  CHANCEMAKER: new Building("Chancemaker", 14),
  FRACTAL_ENGINE: new Building("Fractal Engine", 15),
  JAVASCRIPT_CONSOLE: new Building("Javascript Console", 16),
  IDLEVERSE: new Building("Idleverse", 17),
  CORTEX_BAKER: new Building("Cortex Baker", 18),
  YOU: new Building("You", 19),
};

class Utils {
  #gameName = "Cookie Clicker"

  constructor(client) {
    this.client = client;
    this.package = client.package.findPackage(this.#gameName);

    // Prevent server to receive checks while testing
    this.client.check = () => {
    };
  }

  get upgradesOwned() {
    return Object.values(Game.Upgrades).filter(u => u.unlocked).length;
  }

  clearContext() {
    /**
     * FIXME The APReset is not a proper reset, some values are left dirty.
     * Examples : buildings stays visible, AP buffs are not reapplied
     */
    Game.APReset();

    // ugly fix
    document.getElementById("product0").dataset["aphide"] = "1";
    // document.getElementById("product1").dataset["aphide"] = "1"; Grandmas are enabled from start
    document.getElementById("product2").dataset["aphide"] = "1";
    document.getElementById("product3").dataset["aphide"] = "1";
    document.getElementById("product4").dataset["aphide"] = "1";
    document.getElementById("product5").dataset["aphide"] = "1";
    document.getElementById("product6").dataset["aphide"] = "1";
    document.getElementById("product7").dataset["aphide"] = "1";
    document.getElementById("product8").dataset["aphide"] = "1";
    document.getElementById("product9").dataset["aphide"] = "1";
    document.getElementById("product10").dataset["aphide"] = "1";
    document.getElementById("product11").dataset["aphide"] = "1";
    document.getElementById("product12").dataset["aphide"] = "1";
    document.getElementById("product13").dataset["aphide"] = "1";
    document.getElementById("product14").dataset["aphide"] = "1";
    document.getElementById("product15").dataset["aphide"] = "1";
    document.getElementById("product16").dataset["aphide"] = "1";
    document.getElementById("product17").dataset["aphide"] = "1";
    document.getElementById("product18").dataset["aphide"] = "1";
    document.getElementById("product19").dataset["aphide"] = "1";

  }

  checkNominalContext() {
    assert("Game starts with 0 upgrades", this.upgradesOwned === 0);
    assert("Game starts with 0 building owned", Game.BuildingsOwned === 0);
    assert("Game starts with no cookies", Game.cookies === 0)
    assert("Game starts with no cps", Game.cookiesPs === 0)
    assert("Game starts with only Grandmas unlocked", this.checkBuildingsUnlocked(BUILDINGS.GRANDMA))
  }

  /**
   * Check if given buildings are visible, and all others stay hidden
   * @param {Building} buildings Any number of buildings. Usually should include Grandmas !
   */
  checkBuildingsUnlocked(...buildings) {
    Object.values(BUILDINGS).forEach(building => {
      if (buildings.includes(building)) {
        assert(`Building ${building.name} is visible`, !document.getElementById(`product${building.id}`).dataset["aphide"]);
      } else {
        assert(`Building ${building.name} is hidden`, document.getElementById(`product${building.id}`).dataset["aphide"] === "1");
      }
    })
    return true;
  }

  /**
   * Private to avoid direct calls
   * If you want to send an event, please implement a util method
   *
   * @param eventName Check the docs @ https://archipelago.js.org/stable/classes/index.SocketManager.html#on
   * @param eventData Check the docs @ https://archipelago.js.org/stable/types/index.SocketEvents.html
   */
  #fakeSocketEvent(eventName, eventData) {
    this.client.socket.emit(eventName, eventData);
  }

  #receiveItems(...apIds) {
    this.#fakeSocketEvent("receivedItems", [{
      items: apIds.map(apId => ({item: apId})),
    }]);
  }

  receiveItems(...itemNames) {
    this.#receiveItems(itemNames.map(i => this.package.itemTable[i]));
  }

  buildingsNoGrandma = Object.values(BUILDINGS).filter(b => b !== BUILDINGS.GRANDMA);
}
let APCC; // init global var so we can use it before it's init :3


/**************************************
 *              OBJECTS               *
 **************************************/


class Test {
  name = "TestDefaultName";
  callback;
  result = null;
  parent = null;

  /**
   *
   * @param name
   * @param callback Should return nothing, an object or true is test is fine, or else throw an error
   */
  constructor(name, callback) {
    this.name = name;
    this.callback = callback;
  }

  get fullName() {
    const prefix = this.parent.name;
    return !!prefix ? `${prefix}_${this.name}` : this.name;
  }

  run() {
    APCC.clearContext();
    try {
      APCC.checkNominalContext();
      this.result = this.callback() || true;
      return `-- PASS: ${this.fullName}`;
    } catch (e) {
      this.result = e;
      return `-- FAIL: ${this.fullName}`;
    }
  }

  pass() {
    return !!this.result && !Error.isError(this.result);
  }
}

class TestSuite {
  #tests = [];
  name = "TestSuiteDefaultName";
  report = "";

  /**
   * @param {string} name
   * @param {Test} tests Any number of Test objects
   */
  constructor(name, ...tests) {
    this.name = name;
    this.#tests = tests;
    this.#tests.forEach(test => test.parent = this);
  }

  run() {
    console.testLog(`=== RUNNING ${this.#tests.length} TESTS IN SUITE ${this.name} ===`);
    this.report = this.#tests.map(test => test.run()).join("\n");
  }

  printReport() {
    let failingTests = this.failingTests;
    if (failingTests.length > 0) console.error(`${this.name}: ${failingTests.length}/${this.#tests.length} tests have failed.\n`, failingTests);
    else console.testLog(`${this.name}: All ${this.#tests.length} tests passed successfully !\n`, this.report)
  }

  get failingTests() {
    return this.#tests.filter(test => !test.pass());
  }

  /**
   * Get a single test from its name (the one printed in console)
   *
   * @param name
   * @returns A test object or undefined
   */
  getSingularTest(name) {
    return this.#tests.find(test => test.fullName === name);
  }
}

/**************************************
 *            TEST IMPLEM             *
 **************************************/

/**
 * Let there be Tests
 *
 * Feel free to add more tests in this. Try to keep things organized in categories. You can make utils methods too.
 * Please test the logic in priority, and not graphical stuff (e.g. notification toasts)
 *
 * Naming convention :
 * - TestSuite: `[WHAT]` (the feature being tested, in caps, spaces as underscores)
 * - Individual tests: `[condition]Should[result]` "triggerShouldProduceExpectedResult"
 *
 * After results, you can use the "Store as global variable" feature to run a single test.
 */
window.APCC_runTests = () => setTimeout(() => {
  if (!confirm("WARNING: you are running the game in TESTING mode. This will wipe your local data ! Proceed anyway ? \n(Disable your testing userscript to skip this message)")) {
    return;
  }

  APCC = new Utils(window.client);

  // Force all logs to be debug level to clean things up
  console.testLog = console.log;
  console.log = console.debug;

  /*** TESTS ***/

  console.testLog("===== BUILDING RELATED TESTS =====")
  let tests_notProgressive = new TestSuite("NOT_PROGRESSIVE", ...APCC.buildingsNoGrandma.map(building => {
    let trimmedNamed = building.name.replace(/ /g, '');
    return new Test(`receiveUnlock${trimmedNamed}ShouldUnlock${trimmedNamed}s`, () => {
      // Given
      APCC.receiveItems(`Unlock ${building.name}`);

      // Should
      APCC.checkBuildingsUnlocked(BUILDINGS.GRANDMA, building);
    });
  }));

  let tests_progressive = new TestSuite("PROGRESSIVE",
    // 1 item received
    ...APCC.buildingsNoGrandma.map(building => {
      let trimmedNamed = building.name.replace(/ /g, '');
      return new Test(`receive1Progressive${trimmedNamed}ShouldUnlock${trimmedNamed}s`, () => {
        // Given
        APCC.receiveItems(`Progressive ${building.name}`);

        // Should
        APCC.checkBuildingsUnlocked(BUILDINGS.GRANDMA, building);
        assert("Should still not have any building bought", Game.BuildingsOwned === 0);
        assert("Should still have cookies at 0", Game.cookies === 0);
        assert("Should still have cps at 0", Game.cookiesPs === 0);
        assert("Should still have no item received", APCC.upgradesOwned === 0);
      });
    }),

    // 2 items received
    ...APCC.buildingsNoGrandma.map(building => {
      let trimmedNamed = building.name.replace(/ /g, '');
      return new Test(`receive2Progressive${trimmedNamed}ShouldUnlock${trimmedNamed}s`, () => {
        // Given
        doXTimes(2, () => APCC.receiveItems(`Progressive ${building.name}`));

        // Should
        APCC.checkBuildingsUnlocked(BUILDINGS.GRANDMA, building);
        assert("Should still not have any building bought", Game.BuildingsOwned === 0);
        assert("Should still have cookies at 0", Game.cookies === 0);
        assert("Should still have cps at 0", Game.cookiesPs === 0);
        assert("Should receive exactly 1 item", APCC.upgradesOwned === 1);
      });
    }),

    // 3 items received
    ...APCC.buildingsNoGrandma.map(building => {
      let trimmedNamed = building.name.replace(/ /g, '');
      return new Test(`receive3Progressive${trimmedNamed}ShouldUnlock${trimmedNamed}s`, () => {
        // Given
        doXTimes(3, () => APCC.receiveItems(`Progressive ${building.name}`))

        // Should
        APCC.checkBuildingsUnlocked(BUILDINGS.GRANDMA, building);
        assert("Should still not have any building bought", Game.BuildingsOwned === 0);
        assert("Should still have cookies at 0", Game.cookies === 0);
        assert("Should still have cps at 0", Game.cookiesPs === 0);
        assert("Should receive exactly 2 items", APCC.upgradesOwned === 2);
      });

    }),

    // More than 3 items received
    ...APCC.buildingsNoGrandma.map(building => {
      let trimmedNamed = building.name.replace(/ /g, '');
      return new Test(`receiveMoreProgressive${trimmedNamed}ShouldUnlock${trimmedNamed}s`, () => {
        // Given
        doXTimes(4, () => APCC.receiveItems(`Progressive ${building.name}`))

        // Should
        APCC.checkBuildingsUnlocked(BUILDINGS.GRANDMA, building);
        assert("Should still not have any building bought", Game.BuildingsOwned === 0);
        assert("Should still have cookies at 0", Game.cookies === 0);
        assert("Should still have cps at 0", Game.cookiesPs === 0);
        assert("Should receive exactly 2 items", APCC.upgradesOwned === 2);
      });
    }),
  );

  let buildingTests = [tests_notProgressive, tests_progressive];
  buildingTests.map(testSuite => {
    testSuite.run();
    testSuite.printReport();
  })
  console.testLog("=== END OF BUILDING TESTS ===")

  console.testLog("### End of tests ! To debug a single test, select a test object and right click > 'Store as a global variable', then run it.\nDon't forget to re-enable debug level logs")
}, 1000); // 1s timeout to let the main script get data from the server