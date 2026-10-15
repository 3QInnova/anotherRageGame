import XCTest

final class NativeSmoke: XCTestCase {
    func testBundledGameAndInterruption() throws {
        continueAfterFailure = false
        XCUIDevice.shared.orientation = .landscapeLeft
        let app = XCUIApplication(bundleIdentifier: "com.threeqinnova.exceptionhuman.local")
        app.launch()
        XCTAssertTrue(app.buttons["Play"].waitForExistence(timeout: 20), "Bundled game menu should load without a web server")
        XCTAssertTrue(app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "Local phone playtest")).firstMatch.exists, "Real native bridge should identify the app build")
        app.buttons["Play"].tap()
        let menu = app.buttons["Pause and open menu"]
        XCTAssertTrue(menu.waitForExistence(timeout: 5))
        menu.tap()
        let glass = app.buttons["Glass sightline test"]
        XCTAssertTrue(glass.waitForExistence(timeout: 5))
        glass.tap()
        XCTAssertTrue(app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "GLASS LAB")).firstMatch.waitForExistence(timeout: 5))
        let shot = XCTAttachment(screenshot: app.screenshot())
        shot.name = "Installed glass lab"
        shot.lifetime = .keepAlways
        add(shot)
        XCUIDevice.shared.press(.home)
        app.activate()
        XCTAssertTrue(app.buttons["Resume"].waitForExistence(timeout: 10), "Returning from background requires explicit Resume")
        app.buttons["Resume"].tap()
        XCTAssertTrue(menu.waitForExistence(timeout: 5))
        menu.tap()
        XCTAssertTrue(glass.waitForExistence(timeout: 5))
    }
}
