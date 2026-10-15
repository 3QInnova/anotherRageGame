import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';

// The game remains offline; native integration handles only device lifecycle.
const native = Capacitor.isNativePlatform();
const health = { native, platform: Capacitor.getPlatform(), listenersReady: false, errors: [] };
const emit = (name, detail = {}) => window.dispatchEvent(new CustomEvent(name, { detail }));
window.ExceptionNative = {
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
