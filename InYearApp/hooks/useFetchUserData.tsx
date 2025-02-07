import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from "react-native-health";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.Weight,
    ],
    write: [],
  },
};

const useUserData = () => {
  const [hasPermissions, setHasPermission] = useState<boolean>(false);

  // State variables
  const [userName, setUserName] = useState<string>("");

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== "ios") return;

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log("Error checking availability:", err);
        return;
      }
      if (!isAvailable) {
        console.log("Apple Health not available");
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log("Error getting permissions:", err);
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) return;

    // Fetch user
    setUserName("Tim");

    
  }, [hasPermissions]);

  return {
    userName,
  };
};

export default useUserData;
