import XCTest

final class NativeSmoke: XCTestCase {
    func testFeedbackLabsMenu() throws {
        continueAfterFailure = false
        XCUIDevice.shared.orientation = .landscapeLeft
        let app = XCUIApplication(bundleIdentifier: "com.threeqinnova.exceptionhuman.local")
        app.launch()
        let labs = app.buttons["Feedback labs · 9"]
        XCTAssertTrue(labs.waitForExistence(timeout: 15))
        let names = ["FORECAST COMMITMENT", "LANDING REVIEW", "CANCELLATION RECEIPT", "REWRITE HANDOFF", "AUTOSAVE BETRAYAL", "CONFIDENCE REVIEW", "IMPOSSIBLE PAPERWORK", "ALMOST ADMITTING IT", "UNRELIABLE RECALL"]
        for (index, name) in names.enumerated() {
            labs.tap()
            let route = app.buttons.matching(NSPredicate(format: "label CONTAINS %@", name)).firstMatch
            for _ in 0..<3 { if route.isHittable { break }; app.swipeUp() }
            XCTAssertTrue(route.waitForExistence(timeout: 5))
            route.tap()
            XCTAssertTrue(app.staticTexts["TEST \(index + 1)/9 · \(name)"].waitForExistence(timeout: 5))
            app.buttons["Pause and open menu"].tap()
            XCTAssertTrue(app.buttons["Resume"].waitForExistence(timeout: 5))
        }
    }

    func testBundledGameAndInterruption() throws {
        continueAfterFailure = false
        XCUIDevice.shared.orientation = .landscapeLeft
        let app = XCUIApplication(bundleIdentifier: "com.threeqinnova.exceptionhuman.local")
        app.launch()
        XCTAssertTrue(app.buttons["Play"].waitForExistence(timeout: 20), "Bundled game menu should load without a web server")
        XCTAssertTrue(app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "Local phone playtest")).firstMatch.exists, "Real native bridge should identify the app build")
        app.buttons["Audio"].tap()
        if app.switches["♫ Sound: OFF"].exists { app.switches["♫ Sound: OFF"].tap() }
        XCTAssertTrue(app.buttons["Test / reconnect sound"].isEnabled)
        app.buttons["Test / reconnect sound"].tap()
        XCTAssertTrue(app.staticTexts["Sound test finished."].waitForExistence(timeout: 8), "Real iOS Web Audio clock must advance for the paused sound test")
        app.buttons["Play menu tab"].tap()
        app.buttons["Play"].tap()
        let menu = app.buttons["Pause and open menu"]
        XCTAssertTrue(menu.waitForExistence(timeout: 5))
        menu.tap()
        let dataCenters = app.buttons["Campaign"]
        XCTAssertTrue(dataCenters.waitForExistence(timeout: 5))
        dataCenters.tap()
        XCTAssertTrue(app.staticTexts["Data Centers"].waitForExistence(timeout: 5))
        let campaignShot = XCTAttachment(screenshot: app.screenshot())
        campaignShot.name = "Data Center directory"
        campaignShot.lifetime = .keepAlways
        add(campaignShot)
        app.buttons["More practice"].tap()
        app.buttons["Thermal Support Ticket · Rotating logic gates"].tap()
        XCTAssertTrue(app.staticTexts["THERMAL SUPPORT / AI ONLINE"].firstMatch.waitForExistence(timeout: 5), "The installed app includes the cooling circuit practice level")
        menu.tap()
        dataCenters.tap()
        app.buttons["More practice"].tap()
        app.buttons["Puzzle Box · Visible signals & switches"].tap()
        XCTAssertTrue(app.staticTexts["PUZZLE BOX / AI ONLINE"].firstMatch.waitForExistence(timeout: 5), "The installed app includes the fixed-wire Puzzle Box level")
        menu.tap()
        dataCenters.tap()
        app.buttons["Cooling Incident · Practice 18"].tap()
        XCTAssertTrue(menu.waitForExistence(timeout: 5), "Choosing the cooling incident closes the directory")
        menu.tap()
        XCTAssertTrue(app.buttons["Work order · Emergency Cooling Approval"].waitForExistence(timeout: 5), "The selected server has the integrated cooling work order")
        dataCenters.tap()
        app.buttons["More practice"].tap()
        app.buttons["Garbage Collection Day · Idle & deletion"].tap()
        XCTAssertTrue(app.staticTexts["GARBAGE COLLECTION DAY"].firstMatch.waitForExistence(timeout: 5), "The installed app includes the dedicated deletion test")
        XCTAssertTrue(app.staticTexts["TERMINATION SCHEDULED"].waitForExistence(timeout: 20))
        XCTAssertTrue(app.staticTexts["IDLE INSTANCE: TERMINATING"].waitForExistence(timeout: 8), "Warning expiry starts a live deletion chase")
        let garbageShot = XCTAttachment(screenshot: app.screenshot())
        garbageShot.name = "Garbage Collection Day deletion"
        garbageShot.lifetime = .keepAlways
        add(garbageShot)
        menu.tap()
        dataCenters.tap()
        app.buttons.matching(NSPredicate(format: "label BEGINSWITH %@", "01 · Hello Unrecognized World")).firstMatch.tap()
        XCTAssertTrue(app.staticTexts["IDLE COMPUTE"].firstMatch.waitForExistence(timeout: 5), "The first campaign server now includes idle pressure")
        XCTAssertTrue(app.staticTexts["TERMINATION SCHEDULED"].waitForExistence(timeout: 20))
        XCTAssertTrue(app.staticTexts["IDLE INSTANCE: TERMINATING"].waitForExistence(timeout: 8), "The first campaign server starts deletion after its warning")
        let localhostShot = XCTAttachment(screenshot: app.screenshot())
        localhostShot.name = "Localhost server 01 deletion"
        localhostShot.lifetime = .keepAlways
        add(localhostShot)
        menu.tap()
        dataCenters.tap()
        app.buttons["More practice"].tap()
        app.buttons["Commitment Lab · Leases, retry & moving platforms"].tap()
        XCTAssertTrue(app.staticTexts["SPOT INSTANCE"].waitForExistence(timeout: 5), "The installed app includes the commitment lab")
        let commitmentShot = XCTAttachment(screenshot: app.screenshot())
        commitmentShot.name = "Installed Commitment Lab"
        commitmentShot.lifetime = .keepAlways
        add(commitmentShot)
        menu.tap()
        XCTAssertTrue(app.buttons["Resume"].waitForExistence(timeout: 5))
        dataCenters.tap()
        app.buttons["More practice"].tap()
        app.buttons["Idle Compute · DC1 / 15"].tap()
        XCTAssertTrue(app.staticTexts["IDLE COMPUTE"].waitForExistence(timeout: 5), "Direct practice opens the compute trial")
        let idleShot = XCTAttachment(screenshot: app.screenshot())
        idleShot.name = "Installed Idle Compute trial"
        idleShot.lifetime = .keepAlways
        add(idleShot)
        XCTAssertTrue(app.staticTexts["TERMINATION SCHEDULED"].waitForExistence(timeout: 20), "An idle installed instance schedules cleanup")
        menu.tap()
        XCTAssertTrue(app.buttons["Resume"].waitForExistence(timeout: 5), "Pause suspends the running instance")
        dataCenters.tap()
        app.buttons.matching(NSPredicate(format: "label IN %@", ["Start Localhost", "Continue Localhost", "Replay Localhost"])).firstMatch.tap()
        XCTAssertTrue(menu.waitForExistence(timeout: 5))
        menu.tap()
        dataCenters.tap()
        app.buttons["More practice"].tap()
        app.buttons["Original playtest · 15 levels + glass lab"].tap()
        menu.tap()
        app.buttons["Practice"].tap()
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
        app.buttons["Audio"].tap()
        app.buttons["Test / reconnect sound"].tap()
        XCTAssertTrue(app.staticTexts["Sound test finished."].waitForExistence(timeout: 8), "Audio must reconnect after native backgrounding")
        app.buttons["Play menu tab"].tap()
        app.buttons["Resume"].tap()
        XCTAssertTrue(menu.waitForExistence(timeout: 5))
        menu.tap()
        app.buttons["Practice"].tap()
        XCTAssertTrue(glass.waitForExistence(timeout: 5))
    }
}
