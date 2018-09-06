package com.htwmapper;

import android.*;
import android.app.*;
import android.support.v4.app.*;
import android.support.v4.content.*;
import android.support.v7.app.*;
import android.content.*;
import android.os.*;
import android.util.*;
import android.view.*;
import android.widget.*;
import android.Manifest;

import java.util.ArrayList;
import java.util.Collections;

import com.indooratlas.android.sdk.R;

import com.indooratlas.android.sdk.IAGeofence;
import com.indooratlas.android.sdk.IAGeofenceEvent;
import com.indooratlas.android.sdk.IAGeofenceListener;
import com.indooratlas.android.sdk.IAGeofenceRequest;
import com.indooratlas.android.sdk.IALocation;
import com.indooratlas.android.sdk.IALocationListener;
import com.indooratlas.android.sdk.IALocationManager;
import com.indooratlas.android.sdk.IALocationRequest;


import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    private final int CODE_PERMISSIONS = 1;
    private static final String TAG = "test";
    private IALocationManager mIALocationManager;
  
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String[] neededPermissions = {
            Manifest.permission.CHANGE_WIFI_STATE,
            Manifest.permission.ACCESS_WIFI_STATE,
            Manifest.permission.ACCESS_COARSE_LOCATION
        };
        ActivityCompat.requestPermissions( this, neededPermissions, CODE_PERMISSIONS );
      
      mIALocationManager = IALocationManager.create(this);
    }
  
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  
        //Handle if any of the permissions are denied, in grantResults
    }  

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HTWMapper";
    }

    private IALocationListener mIALocationListener = new IALocationListener() {
        
        // Called when the location has changed.
        @Override
        public void onLocationChanged(IALocation location) {

            Log.d(TAG, "Latitude: " + location.getLatitude());
            Log.d(TAG, "Longitude: " + location.getLongitude());
            Log.d(TAG, "Floor number: " + location.getFloorLevel());
        }
        
        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {
            // N/A
        }
    };
        
        @Override
        protected void onResume() {
            super.onResume();
            mIALocationManager.requestLocationUpdates(IALocationRequest.create(), mIALocationListener);
        }
    
}
