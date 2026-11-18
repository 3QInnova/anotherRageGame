import UIKit
import Capacitor
import GoogleMobileAds
import UserMessagingPlatform

// This bridge accepts presentation/privacy actions only, never placement, URLs or ad IDs.
@objc(GameAdsPlugin)
public final class GameAdsPlugin: CAPPlugin, CAPBridgedPlugin, BannerViewDelegate {
    public let identifier = "GameAdsPlugin"
    public let jsName = "GameAds"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "prepare", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "presentation", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "privacy", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "report", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "support", returnType: CAPPluginReturnPromise)
    ]
    private var banner: BannerView?
    private var started = false
    private var sdkStarted = false
    private var consentReady = false
    private var formOpen = false
    private var covered = true
    private var loaded = false
    private var active = true
    private var status = "Ads have not started."
    private var observations: [NSObjectProtocol] = []
    private let testUnit = "ca-app-pub-3940256099942544/2934735716"
    private var live: Bool {
        #if DEBUG
        return false
        #else
        return Bundle.main.object(forInfoDictionaryKey: "EHLiveAdsEnabled") as? Bool == true
        #endif
    }
    public override func load() {
        observations.append(NotificationCenter.default.addObserver(forName: UIApplication.willResignActiveNotification, object: nil, queue: .main) { [weak self] _ in
            self?.active = false; self?.layoutBanner()
        })
        observations.append(NotificationCenter.default.addObserver(forName: UIApplication.didBecomeActiveNotification, object: nil, queue: .main) { [weak self] _ in
            self?.active = true; self?.layoutBanner()
        })
    }
    deinit { observations.forEach { NotificationCenter.default.removeObserver($0) } }
    private func snapshot() -> [String: Any] {
        ["mode": live ? "live" : "test", "loaded": loaded, "status": status,
         "privacyRequired": ConsentInformation.shared.privacyOptionsRequirementStatus == .required]
    }
    private func announce(_ text: String) {
        status = text
        notifyListeners("status", data: snapshot())
    }
    private func pauseGame() { covered = true; layoutBanner(); notifyListeners("pause", data: [:]) }
    @objc func prepare(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard !self.started else { call.resolve(self.snapshot()); return }
            self.started = true
            self.gatherConsent { call.resolve(self.snapshot()) }
        }
    }
    private func gatherConsent(completion: @escaping () -> Void) {
        guard let controller = bridge?.viewController else { announce("Ads unavailable. You can keep playing."); completion(); return }
        consentReady = false; loaded = false; banner?.removeFromSuperview(); banner = nil
        formOpen = true; pauseGame(); announce("Checking ad privacy choices…")
        let parameters = RequestParameters()
        // No invented age, geography or consent state. The live app's configured UMP messages apply.
        ConsentInformation.shared.requestConsentInfoUpdate(with: parameters) { [weak self] error in
            Task { @MainActor in
                guard let self else { return }
                if let error {
                    self.formOpen = false
                    self.announce("Ads unavailable: \(error.localizedDescription) You can keep playing.")
                    completion(); return
                }
                do {
                    try await ConsentForm.loadAndPresentIfRequired(from: controller)
                    self.formOpen = false
                    self.consentReady = ConsentInformation.shared.canRequestAds
                    if self.consentReady { self.startAds() }
                    else { self.announce("Ads are off for the current privacy choices.") }
                } catch {
                    self.formOpen = false
                    self.announce("Ad privacy could not finish. Ads remain off; you can keep playing.")
                }
                completion()
            }
        }
    }
    private func startAds() {
        guard consentReady, ConsentInformation.shared.canRequestAds else { return }
        if sdkStarted { loadBanner(); return }
        sdkStarted = true
        let config = MobileAds.shared.requestConfiguration
        config.setPublisherFirstPartyIDEnabled(false)
        config.coarseLocationCollectionEnabled = false
        config.publisherPrivacyPersonalizationState = .disabled
        config.maxAdContentRating = .general
        MobileAds.shared.start { [weak self] _ in
            DispatchQueue.main.async { self?.loadBanner() }
        }
    }
    private func loadBanner() {
        guard banner == nil, consentReady, ConsentInformation.shared.canRequestAds,
              let controller = bridge?.viewController else { return }
        let view = BannerView(adSize: AdSizeBanner)
        view.adUnitID = live ? Bundle.main.object(forInfoDictionaryKey: "EHBannerAdUnitID") as? String : testUnit
        view.rootViewController = controller
        view.delegate = self
        view.accessibilityIdentifier = "admob-fixed-banner"
        view.isHidden = true
        controller.view.addSubview(view)
        banner = view
        layoutBanner()
        let request = Request()
        let extras = Extras()
        extras.additionalParameters = ["npa": "1"]
        request.register(extras)
        announce(live ? "Loading advertisement…" : "Loading Google test banner…")
        view.load(request)
    }
    // Same fixed allocation as #mobileBannerSlot. No adaptive size, remote offset or JS coordinates.
    func layoutBanner() {
        guard let host = bridge?.viewController?.view, let banner else { return }
        let safe = host.safeAreaInsets
        banner.frame = CGRect(x: (host.bounds.width + safe.left - safe.right - 320) / 2,
                              y: host.bounds.height - max(8, safe.bottom) - 50, width: 320, height: 50)
        banner.isHidden = !loaded || !active || covered || formOpen || host.bounds.width <= host.bounds.height
    }
    @objc func presentation(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.covered = call.getBool("covered") ?? true
            self.layoutBanner(); call.resolve()
        }
    }
    public func bannerViewDidReceiveAd(_ bannerView: BannerView) {
        loaded = true; layoutBanner()
        announce(live ? "Advertisement from Google." : "Google test ad — no live advertising.")
    }
    public func bannerView(_ bannerView: BannerView, didFailToReceiveAdWithError error: Error) {
        loaded = false; layoutBanner()
        announce("No ad available. You can keep playing.")
    }
    public func bannerViewWillPresentScreen(_ bannerView: BannerView) {
        formOpen = true; pauseGame(); layoutBanner()
    }
    public func bannerViewDidDismissScreen(_ bannerView: BannerView) {
        formOpen = false; layoutBanner(); pauseGame()
    }
    @objc func privacy(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard !self.formOpen, let controller = self.bridge?.viewController else { call.reject("Another dialog is open."); return }
            self.pauseGame(); self.formOpen = true; self.layoutBanner()
            if ConsentInformation.shared.privacyOptionsRequirementStatus == .required {
                Task { @MainActor in
                    do {
                        try await ConsentForm.presentPrivacyOptionsForm(from: controller)
                        self.formOpen = false
                        self.consentReady = ConsentInformation.shared.canRequestAds
                        self.banner?.removeFromSuperview(); self.banner = nil; self.loaded = false
                        if self.consentReady { self.startAds() }
                        else { self.announce("Ads are off for the current privacy choices.") }
                        self.layoutBanner(); call.resolve(self.snapshot())
                    } catch {
                        self.formOpen = false; self.layoutBanner()
                        self.announce("Privacy choices could not open. Please try again.")
                        call.resolve(self.snapshot())
                    }
                }
            } else {
                let alert = UIAlertController(title: "Ad privacy & information", message: "\(self.live ? "Google supplies the banner ads." : "This build uses Google test ads only.") Ad requests ask for non-personalized ads. Google may still process device, network and ad-interaction data. When available, use the ad's information/AdChoices control for details about that ad.\n\nNo privacy-options form is currently required by Google's consent service. You can check again below.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Check privacy choices", style: .default) { _ in
                    self.formOpen = false; self.gatherConsent { call.resolve(self.snapshot()) }
                })
                alert.addAction(UIAlertAction(title: "Done", style: .cancel) { _ in
                    self.formOpen = false; self.layoutBanner(); call.resolve(self.snapshot())
                })
                controller.present(alert, animated: true)
            }
        }
    }
    @objc func support(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.pauseGame()
            let url = URL(string: "mailto:Support.exeptionHuman@3qinnova.com?subject=EXCEPTION%3A%20HUMAN%20support")!
            UIApplication.shared.open(url, options: [:]) { opened in
                if opened { call.resolve() }
                else { call.reject("No email app is available. Email Support.exeptionHuman@3qinnova.com from your usual email service.") }
            }
        }
    }
    @objc func report(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard !self.formOpen, let controller = self.bridge?.viewController else { call.reject("Another dialog is open."); return }
            self.pauseGame(); self.formOpen = true; self.layoutBanner()
            let response = self.banner?.responseInfo?.responseIdentifier ?? "No response ID available"
            let text = "EXCEPTION: HUMAN — ad report\nPlacement: iOS fixed bottom banner\nMode: \(self.live ? "live" : "test")\nAd response: \(response)\nApp version: \(Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "unknown") (\(Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "unknown"))\nDate: \(ISO8601DateFormatter().string(from: Date()))\n\nSend to Support.exeptionHuman@3qinnova.com. Describe the problem before sending. No screenshot is attached automatically."
            let sheet = UIActivityViewController(activityItems: [text], applicationActivities: nil)
            sheet.popoverPresentationController?.sourceView = controller.view
            sheet.popoverPresentationController?.sourceRect = CGRect(x: controller.view.bounds.midX, y: controller.view.bounds.midY, width: 1, height: 1)
            sheet.completionWithItemsHandler = { [weak self] _, _, _, _ in
                self?.formOpen = false; self?.layoutBanner(); call.resolve()
            }
            controller.present(sheet, animated: true)
        }
    }
}
