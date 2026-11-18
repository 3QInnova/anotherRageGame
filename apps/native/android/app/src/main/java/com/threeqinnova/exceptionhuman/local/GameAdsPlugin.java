package com.threeqinnova.exceptionhuman.local;

import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.*;
import com.google.ads.mediation.admob.AdMobAdapter;
import com.google.android.ump.*;

/** Fixed placement only. JavaScript cannot supply ad IDs, coordinates, sizes, or URLs. */
@CapacitorPlugin(name = "GameAds")
public class GameAdsPlugin extends Plugin {
    private AdView banner;
    private ConsentInformation consent;
    private boolean started, initialized, loaded, formOpen, ready;
    private boolean covered = true, active = true;
    private String status = "Ads have not started.";
    private final View.OnLayoutChangeListener layoutListener = (v,l,t,r,b,ol,ot,or,ob) -> layout();
    @Override public void load() {
        consent = UserMessagingPlatform.getConsentInformation(getContext());
        getBridge().getWebView().addOnLayoutChangeListener(layoutListener);
    }
    private JSObject snapshot() {
        JSObject data = new JSObject();
        data.put("mode", BuildConfig.LIVE_ADS ? "live" : "test");
        data.put("loaded", loaded); data.put("status", status);
        data.put("privacyRequired", consent.getPrivacyOptionsRequirementStatus() == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED);
        return data;
    }
    private void announce(String text) { status = text; notifyListeners("status", snapshot()); }
    private void pauseGame() { covered = true; layout(); notifyListeners("pause", new JSObject()); }
    private void clearBanner() {
        loaded = false;
        if (banner != null) { if (banner.getParent() instanceof ViewGroup) ((ViewGroup)banner.getParent()).removeView(banner); banner.destroy(); banner = null; }
    }
    @PluginMethod public void prepare(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (started) { call.resolve(snapshot()); return; }
            started = true; gatherConsent(call);
        });
    }
    private void gatherConsent(PluginCall call) {
        ready = false; clearBanner(); formOpen = true; pauseGame();
        announce("Checking ad privacy choices…");
        consent.requestConsentInfoUpdate(getActivity(), new ConsentRequestParameters.Builder().build(), () ->
            UserMessagingPlatform.loadAndShowConsentFormIfRequired(getActivity(), error -> {
                formOpen = false;
                ready = error == null && consent.canRequestAds();
                if (ready) startAds(); else announce("Ads are off. You can keep playing.");
                layout(); call.resolve(snapshot());
            }), error -> {
                formOpen = false; announce("Ad privacy unavailable. Ads remain off; you can keep playing.");
                layout(); call.resolve(snapshot());
            });
    }
    private void startAds() {
        if (!ready || !consent.canRequestAds()) return;
        if (initialized) { loadBanner(); return; }
        initialized = true;
        MobileAds.setRequestConfiguration(new RequestConfiguration.Builder().setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_G).build());
        MobileAds.initialize(getContext(), result -> getActivity().runOnUiThread(() -> {
            MobileAds.putPublisherFirstPartyIdEnabled(false);
            loadBanner();
        }));
    }
    private void loadBanner() {
        if (banner != null || !ready || !consent.canRequestAds()) return;
        banner = new AdView(getContext());
        banner.setAdSize(AdSize.BANNER);
        banner.setAdUnitId(BuildConfig.BANNER_AD_UNIT_ID);
        banner.setContentDescription("Advertisement");
        banner.setVisibility(View.GONE);
        FrameLayout host = getActivity().findViewById(android.R.id.content);
        host.addView(banner, new FrameLayout.LayoutParams(dp(320), dp(50)));
        banner.setAdListener(new AdListener() {
            @Override public void onAdLoaded() { loaded = true; layout(); announce(BuildConfig.LIVE_ADS ? "Advertisement from Google." : "Google test ad — no live advertising."); }
            @Override public void onAdFailedToLoad(LoadAdError error) { loaded = false; layout(); announce("No ad available. You can keep playing."); }
            @Override public void onAdOpened() { formOpen = true; pauseGame(); }
            @Override public void onAdClosed() { formOpen = false; pauseGame(); }
        });
        Bundle extras = new Bundle(); extras.putString("npa", "1");
        layout();
        banner.loadAd(new AdRequest.Builder().addNetworkExtrasBundle(AdMobAdapter.class, extras).build());
    }
    private int dp(int value) { return Math.round(value * getContext().getResources().getDisplayMetrics().density); }
    private void layout() {
        if (banner == null) return;
        View web = getBridge().getWebView();
        FrameLayout host = getActivity().findViewById(android.R.id.content);
        int[] w = new int[2], h = new int[2]; web.getLocationInWindow(w); host.getLocationInWindow(h);
        // Match the game's fixed 320x50 slot inside the WebView's own viewport.
        FrameLayout.LayoutParams p = new FrameLayout.LayoutParams(dp(320), dp(50));
        View decor = getActivity().getWindow().getDecorView();
        WindowInsetsCompat rootInsets = ViewCompat.getRootWindowInsets(decor);
        Insets safe = rootInsets == null ? Insets.NONE : rootInsets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
        int left = Math.max(0, safe.left - w[0]);
        int right = Math.max(0, w[0] + web.getWidth() - (decor.getWidth() - safe.right));
        int bottom = Math.max(0, w[1] + web.getHeight() - (decor.getHeight() - safe.bottom));
        p.leftMargin = w[0] - h[0] + left + (web.getWidth() - left - right - dp(320)) / 2;
        p.topMargin = w[1] - h[1] + web.getHeight() - Math.max(dp(8), bottom) - dp(50);
        banner.setLayoutParams(p);
        boolean show = loaded && active && !covered && !formOpen && web.getWidth() > web.getHeight() && web.getWidth() >= dp(368) && p.topMargin >= 0;
        banner.setVisibility(show ? View.VISIBLE : View.GONE);
    }
    @PluginMethod public void presentation(PluginCall call) {
        getActivity().runOnUiThread(() -> { covered = call.getBoolean("covered", true); layout(); call.resolve(); });
    }
    @PluginMethod public void privacy(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (formOpen) { call.reject("Another dialog is open."); return; }
            pauseGame(); formOpen = true;
            if (consent.getPrivacyOptionsRequirementStatus() == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED) {
                UserMessagingPlatform.showPrivacyOptionsForm(getActivity(), error -> {
                    formOpen = false; clearBanner(); ready = error == null && consent.canRequestAds();
                    if (ready) startAds(); else announce("Ads are off. You can keep playing.");
                    layout(); call.resolve(snapshot());
                });
            } else {
                new AlertDialog.Builder(getActivity()).setTitle("Ad privacy & information")
                    .setMessage("Google supplies banner ads. Requests ask for non-personalized ads. Google may still process device, network and ad-interaction data. Use the ad's information control for details. No privacy-options form is currently required by Google's consent service.")
                    .setPositiveButton("Check privacy choices", (d, which) -> { formOpen = false; gatherConsent(call); })
                    .setNegativeButton("Done", (d, which) -> { formOpen = false; layout(); call.resolve(snapshot()); })
                    .setOnCancelListener(d -> { formOpen = false; layout(); call.resolve(snapshot()); }).show();
            }
        });
    }
    @PluginMethod public void support(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            pauseGame();
            try { getActivity().startActivity(new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:Support.exeptionHuman@3qinnova.com?subject=EXCEPTION%3A%20HUMAN%20support"))); call.resolve(); }
            catch (Exception e) { call.reject("Email Support.exeptionHuman@3qinnova.com from your usual email service."); }
        });
    }
    @PluginMethod public void report(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            pauseGame();
            String response = banner != null && banner.getResponseInfo() != null ? banner.getResponseInfo().getResponseId() : "No response ID available";
            Intent intent = new Intent(Intent.ACTION_SEND).setType("text/plain");
            intent.putExtra(Intent.EXTRA_TEXT, "EXCEPTION: HUMAN — ad report\nPlacement: Android fixed bottom banner\nAd response: " + response + "\nSend to Support.exeptionHuman@3qinnova.com. Describe the problem before sending.");
            try { getActivity().startActivity(Intent.createChooser(intent, "Report an ad")); call.resolve(); }
            catch (Exception e) { call.reject("No sharing app is available."); }
        });
    }
    @Override protected void handleOnPause() { active = false; if (banner != null) banner.pause(); layout(); }
    @Override protected void handleOnResume() { active = true; if (banner != null) banner.resume(); layout(); }
    @Override protected void handleOnDestroy() { getBridge().getWebView().removeOnLayoutChangeListener(layoutListener); clearBanner(); }
}
