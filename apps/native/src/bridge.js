import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';

// Gameplay remains offline; the native ad SDK alone owns ad network traffic.
const native = Capacitor.isNativePlatform();
const health = { native, platform: Capacitor.getPlatform(), listenersReady: false, iosAudioSession: window.__IOS_AUDIO_SESSION__ ?? null, errors: [] };
const emit = (name, detail = {}) => window.dispatchEvent(new CustomEvent(name, { detail }));
const ads = native && Capacitor.getPlatform() === 'ios' ? registerPlugin('GameAds') : null;
const adListeners = ads ? Promise.all([
  ads.addListener('pause', () => emit('exception:ad-pause')),
  ads.addListener('status', detail => emit('exception:ad-status', detail)),
]) : Promise.resolve();
window.ExceptionNative = {
  ads: ads ? {
    prepare: async () => { await adListeners; return ads.prepare(); },
    presentation: covered => ads.presentation({covered: !!covered}),
    privacy: () => ads.privacy(),
    report: () => ads.report(),
    support: () => ads.support(),
  } : null,
  health,
  minimize: () => native ? App.minimizeApp().catch(error => health.errors.push(String(error))) : Promise.resolve(),
};
if (native) {
  Promise.all([
    App.addListener('pause', () => emit('exception:inactive')),
    App.addListener('appStateChange', ({ isActive }) => emit(isActive ? 'exception:active' : 'exception:inactive')),
    App.addListener('backButton', () => emit('exception:back')),
  ]).then(() => { health.listenersReady = true; }).catch(error => health.errors.push(String(error)));
  StatusBar.hide().catch(error => health.errors.push(String(error)));
}
