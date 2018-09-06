package com.htwmapper;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;
import java.lang.Runnable;
import javax.annotation.Nullable;

import com.indooratlas.android.sdk.*;
import com.indooratlas.android.sdk.resources.*;

public class IndooratlasModule extends ReactContextBaseJavaModule
implements LifecycleEventListener {

  public static final String TAG = "Indooratlas";
  public static final int CODE_PERMISSIONS = 1;

  private ReactApplicationContext appContext;
  private IALocationManager mLocationManager;
  private IALocationListener mLocationListener;

  public IndooratlasModule(ReactApplicationContext reactContext) {
    super(reactContext);
    appContext = reactContext;
    appContext.addLifecycleEventListener(this);

    // save 'this' to call class methods from within the following listener
    final IndooratlasModule self = this;
    
    mLocationListener = new IALocationListener() {
      public void onLocationChanged(IALocation location) {
        // location has changed, put received location into a WritableMap and send to JS
        WritableMap params = Arguments.createMap();
        params.putDouble("latitude", location.getLatitude());
        params.putDouble("longitude", location.getLongitude());
        params.putInt("floorLevel", location.getFloorLevel());
        self.sendEvent("onLocationChanged", params);
      }

      public void onStatusChanged(String provider, int status, Bundle extras) {
        // gets called when provider status changes
        WritableMap params = Arguments.createMap();
        params.putInt("status", status);
        self.sendEvent("onStatusChanged", params);
      }
    };

    (new Handler(Looper.getMainLooper())).post(new Runnable() {
      @Override
      public void run() {
        // provides access to the location services
        mLocationManager = IALocationManager.create(appContext);
      }
    });
  }

  @Override
  public void onHostResume() {
    (new Handler(Looper.getMainLooper())).post(new Runnable() {
      @Override
      public void run() {
        // now onLocation/StatusChanged of mLocationListener will get called once the location changes
        Boolean result = mLocationManager.requestLocationUpdates(IALocationRequest.create(), mLocationListener);
      }
    });
  }
  
  @Override
  public void onHostPause() {
    mLocationManager.removeLocationUpdates(mLocationListener);
  }
  
  @Override
  public void onHostDestroy() {
    mLocationManager.destroy();
  }

  @Override
  public String getName() {
    return TAG;
  }

  private void sendEvent(String eventName, @Nullable WritableMap params) {
    // sends an event to JS, can be listened to with DeviceEventEmitter.addListener() there
    // passed params are a JS object containing keys and values of the WritableMap
    appContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

}
