package com.threeqinnova.exceptionhuman.local;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GameAdsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
