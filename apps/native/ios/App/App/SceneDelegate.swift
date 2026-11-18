import UIKit
import Capacitor
import AVFAudio
import WebKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = GameBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        GameAudioSession.configure()
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

// Snapshot the real native session for local device diagnostics; no audio permission needed.
class GameBridgeViewController: CAPBridgeViewController {
    private let gameAds = GameAdsPlugin()
    override func capacitorDidLoad() { bridge?.registerPluginInstance(gameAds) }
    override func viewDidLayoutSubviews() { super.viewDidLayoutSubviews(); gameAds.layoutBanner() }
    override func viewSafeAreaInsetsDidChange() { super.viewSafeAreaInsetsDidChange(); gameAds.layoutBanner() }
    override func webViewConfiguration(for instanceConfiguration: InstanceConfiguration) -> WKWebViewConfiguration {
        GameAudioSession.configure()
        let config = super.webViewConfiguration(for: instanceConfiguration)
        #if DEBUG
        let session = AVAudioSession.sharedInstance()
        let info: [String: Any] = ["category": session.category.rawValue, "mode": session.mode.rawValue,
                                   "mixesWithOthers": session.categoryOptions.contains(.mixWithOthers)]
        if let data = try? JSONSerialization.data(withJSONObject: info), let json = String(data: data, encoding: .utf8) {
            config.userContentController.addUserScript(WKUserScript(source: "window.__IOS_AUDIO_SESSION__ = \(json);", injectionTime: .atDocumentStart, forMainFrameOnly: true))
        }
        #endif
        return config
    }
}
