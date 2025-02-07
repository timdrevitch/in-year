import { useState, useEffect } from "react";
import { Platform } from "react-native";
import AppleHealthKit, { HealthInputOptions, HealthKitPermissions } from "react-native-health";

const useYearlyHealthData = (year: number, date?: Date) => {
  const [yearlySteps, setYearlySteps] = useState<number>(0);
  const [averageDailySteps, setAverageDailySteps] = useState<number>(0);
  const [yearlyFlights, setYearlyFlights] = useState<number>(0);
  const [averageDailyFlights, setAverageDailyFlights] = useState<number>(0);
  const [yearlyDistance, setYearlyDistance] = useState<number>(0);
  const [averageDailyDistance, setAverageDailyDistance] = useState<number>(0);
  const [yearlyCalories, setYearlyCalories] = useState<number>(0);
  const [yearlyWeight, setYearlyWeight] = useState<number>(0);
  const [yearlyHeartRate, setYearlyHeartRate] = useState<number>(0);
  const [yearlyWorkoutDuration, setYearlyWorkoutDuration] = useState(0);
  const [yearlySleepDuration, setYearlySleepDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const today = new Date();
  const isCurrentYear = year === today.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = isCurrentYear
    ? today // Use today if the year is current
    : new Date(year, 11, 31, 23, 59, 59);

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    // Request necessary HealthKit permissions
    const permissions: HealthKitPermissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.FlightsClimbed,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.SleepAnalysis,
          AppleHealthKit.Constants.Permissions.Workout,
          AppleHealthKit.Constants.Permissions.Weight,
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
        startDate: startOfYear.toISOString(),
        endDate: endOfYear.toISOString(),
        ascending: false,
      };

      AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
        if (err) {
          console.error("Error fetching step count:", err);
          return;
        }

        if (!results || results.length === 0) {
          console.warn("No step data found.");
          setYearlySteps(0);
          setAverageDailySteps(0);
          return;
        }

        const totalSteps = results.reduce((sum, entry) => sum + entry.value, 0);
        const totalDays = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24)) + 1;
        const avgSteps = totalDays > 0 ? totalSteps / totalDays : 0;

        setYearlySteps(totalSteps);
        setAverageDailySteps(avgSteps);
      });
    }

    function fetchYearlyDistance() {
      const options: HealthInputOptions = {
        startDate: startOfYear.toISOString(),
        endDate: endOfYear.toISOString(),
        ascending: false,
      };

      AppleHealthKit.getDailyDistanceWalkingRunningSamples(options, (err, results) => {
        if (err) {
          console.error("Error fetching distance:", err);
          return;
        }

        const totalDistance = results.reduce((sum, entry) => sum + entry.value, 0);
        const totalDays = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24)) + 1;
        const avgDistance = totalDays > 0 ? totalDistance / totalDays : 0;

        setYearlyDistance(totalDistance);
        setAverageDailyDistance(avgDistance);
      });
    }

    function fetchYearlyFlights() {
      const options: HealthInputOptions = {
        startDate: startOfYear.toISOString(),
        endDate: endOfYear.toISOString(),
      };

      AppleHealthKit.getDailyFlightsClimbedSamples(options, (err, results) => {
        if (err) {
          console.error("Error fetching flights climbed:", err);
          return;
        }
        const totalFlights = results.reduce((sum, entry) => sum + entry.value, 0);
        const totalDays = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24)) + 1;
        const avgFlights = totalDays > 0 ? totalFlights / totalDays : 0;

        setYearlyFlights(totalFlights);
        setAverageDailyFlights(avgFlights);
      });
    }

    function fetchYearlyCalories() {
      const options: HealthInputOptions = {
        startDate: startOfYear.toISOString(),
        endDate: endOfYear.toISOString(),
        ascending: false,
      };

      AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
        if (err) {
          console.error("Error fetching calories:", err);
          return;
        }

        const totalCalories = results.reduce((sum, entry) => sum + entry.value, 0);
        const totalDays = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24)) + 1;
        const avgCalories = results.length > 0 ? totalCalories / totalDays : 0;

        setYearlyCalories(avgCalories);
      });
    };

    function fetchYearlyWeight() {
      if (date) {
        const startDateWeight = new Date(date);
        startDateWeight.setHours(0, 0, 0, 0); // Start of the given date
        const endDateWeight = new Date(startDateWeight.getTime() + 86400000); 
        const options: HealthInputOptions = {
          unit: AppleHealthKit.Constants.Units.pound,
          startDate: startDateWeight.toISOString(),
          endDate: endDateWeight.toISOString(),
          includeManuallyAdded: true,
          limit: 1, // Get the most recent entry for that day
        };
  
        AppleHealthKit.getWeightSamples(options, (err, results) => {
          if (err) {
            console.error("Error fetching heart rate:", err);
            return;
          }
          const validDays = results.filter(entry => new Date(entry.startDate) <= today);
          const totalWeight = validDays.reduce((sum, entry) => sum + entry.value, 0);
          const avgWeight = validDays.length > 0 ? totalWeight / validDays.length : 0;
          setYearlyWeight(avgWeight);
        });
      }
    };

    function fetchYearlyHeartRate() {
      const options: HealthInputOptions = {
        startDate: startOfYear.toISOString(),
        endDate: endOfYear.toISOString(),
      };

      AppleHealthKit.getHeartRateSamples(options, (err, results) => {
        if (err) {
          console.error("Error fetching heart rate:", err);
          return;
        }
        const validDays = results.filter(entry => new Date(entry.startDate) <= today);
        const totalHeartRate = validDays.reduce((sum, entry) => sum + entry.value, 0);
        const avgHeartRate = validDays.length > 0 ? totalHeartRate / validDays.length : 0;
        setYearlyHeartRate(avgHeartRate);
      });
    }

    function fetchYearlySleepDuration() {
      if (date) {
        // For fetching sleep data
        const startOfSleepWindow = new Date(date);
        startOfSleepWindow.setDate(date.getDate() - 1); // Go back one day
        startOfSleepWindow.setHours(12, 0, 0, 0); // Set to noon
        const endOfSleepWindow = new Date(date);
        endOfSleepWindow.setHours(12, 0, 0, 0); // Today at noon

        const sleepOptions: HealthInputOptions = {
          startDate: startOfSleepWindow.toISOString(),
          endDate: endOfSleepWindow.toISOString(),
          ascending: false, // Fetch most recent first
          limit: 1000, // Limit to a reasonable number of records
        };

        AppleHealthKit.getSleepSamples(sleepOptions, (err, results) => {
          if (err) {
            console.error("Error fetching sleep samples:", err);
            return;
          }
      
          // Group sleep durations by day
          const dailySleepMap = new Map(); // Key: Date (YYYY-MM-DD), Value: Total sleep in ms for that day

          results.forEach(entry => {
            const start = new Date(entry.startDate).getTime();
            const end = new Date(entry.endDate).getTime();
            const sleepDuration = end - start; // Duration in milliseconds

            const dayKey = new Date(entry.startDate).toISOString().split("T")[0]; // YYYY-MM-DD

            if (dailySleepMap.has(dayKey)) {
              dailySleepMap.set(dayKey, dailySleepMap.get(dayKey) + sleepDuration);
            } else {
              dailySleepMap.set(dayKey, sleepDuration);
            }
          });

          // Compute the average daily sleep
          const totalSleep = Array.from(dailySleepMap.values()).reduce((sum, duration) => sum + duration, 0);
          const numDays = dailySleepMap.size;
          const avgSleepDuration = numDays > 0 ? (totalSleep / numDays / (1000 * 60 * 60)) / 2 : 0; // Convert ms → hours

          setYearlySleepDuration(avgSleepDuration);
        });
      } else {
        console.warn("[useFetchYearlyStepsData.tsx] Could not fetch yearly sleep data because date was now provided.")
      }
    }

    fetchYearlySteps();
    fetchYearlyDistance();
    fetchYearlyFlights();
    fetchYearlyCalories();
    fetchYearlyWeight();
    fetchYearlyHeartRate();
    fetchYearlySleepDuration();
  }, [hasPermission, year]);

  return {
    yearlySteps,
    averageDailySteps,
    yearlyFlights,
    averageDailyFlights,
    yearlyDistance,
    averageDailyDistance,
    yearlyCalories,
    yearlyWeight,
    yearlyHeartRate,
    yearlyWorkoutDuration,
    yearlySleepDuration,
  };
};

export default useYearlyHealthData;