import { useState, useEffect } from "react";
import { Platform } from "react-native";
import AppleHealthKit, { HealthInputOptions, HealthKitPermissions, HealthUnit } from "react-native-health";

const useYearlyHealthData = (year: number) => {
  const [yearlySteps, setYearlySteps] = useState<number>(0);
  const [yearlyFlights, setYearlyFlights] = useState<number>(0);
  const [yearlyDistance, setYearlyDistance] = useState<number>(0);
  const [yearlyCalories, setYearlyCalories] = useState<number>(0);
  const [yearlyHeartRate, setYearlyHeartRate] = useState<number>(0);
  const [yearlyWorkoutDuration, setYearlyWorkoutDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const startOfYear = new Date(year, 0, 1).toISOString();
  const endOfYear = new Date(year, 11, 31, 23, 59, 59).toISOString();

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    // Check permissions first
    const permissions: HealthKitPermissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps, 
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning
        ],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.error("HealthKit permission error:", err);
        return;
      }
      setHasPermission(true);
    });
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

    function fetchYearlySteps() {
      const options: HealthInputOptions = {
        startDate: startOfYear,
        endDate: endOfYear,
        ascending: false,
      };

      AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
        if (err) {
          console.error("Error fetching step count:", err);
          return;
        }
        const totalSteps = results.reduce((sum, entry) => sum + entry.value, 0);
        setYearlySteps(totalSteps);
      });
    }

    function fetchYearlyDistance() {
      const options: HealthInputOptions = {
        startDate: startOfYear,
        endDate: endOfYear,
      };

      AppleHealthKit.getDailyDistanceWalkingRunningSamples(options, (err, results) => {
        if (err) {
          console.error("Error fetching distance:", err);
          return;
        }
        const totalDistance = results.reduce((sum, entry) => sum + entry.value, 0);
        setYearlyDistance(totalDistance);
      });
    }

    fetchYearlySteps();
    fetchYearlyDistance();
  }, [hasPermission, year]);

  return {
    yearlySteps,
    yearlyFlights,
    yearlyDistance,
    yearlyCalories,
    yearlyHeartRate,
    yearlyWorkoutDuration,
  };
};

export default useYearlyHealthData;