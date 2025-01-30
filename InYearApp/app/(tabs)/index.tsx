import { useState, useCallback, useEffect, useRef } from "react";
import { Text, View, useThemeColor } from "../../components/Themed";
import Value from "../../components/Value";
import { ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import useHealthData from "../../hooks/useFetchStepsData";
import useYearlyHealthData from "../../hooks/useFetchYearlyStepsData";
import { Picker } from "@react-native-picker/picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

type HomeScreenProps = {};

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [inYear, setInYear] = useState<number>(2025);
  const [stepChange, setStepChange] = useState<number | null>(null);
  const [distanceChange, setDistanceChange] = useState<number | null>(null);
  const previousSteps = useRef<number>(0);
  const previousDistance = useRef<number>(0);
  const [selectedYear, setSelectedYear] = useState(inYear);

  const yesterday: Date = new Date();
  yesterday.setDate(date.getDate() - 1);

  const {
    steps: stepsYesterday,
    flights: flightsYesterday,
    distance: distanceYesterday,
    calories: caloriesYesterday,
    heartRate: heartRateYesterday,
  } = useHealthData(yesterday);
  const { steps, flights, distance, calories, heartRate } = useHealthData(date);
  const { yearlySteps, yearlyFlights, yearlyDistance, yearlyCalories, yearlyHeartRate } = useYearlyHealthData(inYear);

  // Use the theme colors for text and background
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "darkerText");
  const titleColor = useThemeColor({}, "text");
  const changeText = useThemeColor({}, "greenText");
  const interactionText = useThemeColor({}, "blueText");

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);

    setTimeout(() => {
      const stepCountChange = steps - previousSteps.current;
      const distanceCountChange = distance - previousDistance.current;

      if (stepCountChange > 0) {
        setStepChange(stepCountChange); // Save the increase
        previousSteps.current = steps; // Update the previous steps value
      } else {
        setStepChange(null); // Reset if no increase
      }
      if (distanceCountChange > 0) {
        setDistanceChange(distanceCountChange); // Save the increase
        previousDistance.current = distance; // Update the previous distance value
      } else {
        setDistanceChange(null); // Reset if no increase
      }

      // Refresh date to trigger new data fetch
      setDate(new Date());
    }, 1000);

    // Simulate a network request or async operation
    setTimeout(() => {
      setIsRefreshing(false); // Stop refreshing
    }, 1500);
  }, [steps, yearlySteps, distance]);

  useEffect(() => {
    // Whenever the date is updated (e.g. from pull-to-refresh)
    // Trigger the useHealthData hook to re-fetch both today's and yesterday's data
  }, [date]);

  useEffect(() => {
    if (steps > previousSteps.current) {
      const stepCountChange = steps - previousSteps.current;
      setStepChange(stepCountChange);
      previousSteps.current = steps; // Update previousSteps
    } else if (steps === previousSteps.current) {
      setStepChange(null); // Reset stepChange if no change
    }
  }, [steps]); // Only trigger when steps change

  useEffect(() => {
    if (distance > previousDistance.current) {
      const distanceCountChange = distance - previousDistance.current;
      setDistanceChange(distanceCountChange);
      previousDistance.current = distance; // Update previousDistance
    } else if (distance === previousDistance.current) {
      setDistanceChange(null); // Reset distanceChange if no change
    }
  }, [distance]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setInYear(year); // Update the parent component's state if necessary
  };


  return (
    <ScrollView
      id="home-page"
      contentContainerStyle={[styles.container, { backgroundColor }]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh} // Set the refresh handler
          tintColor={textColor} // Customize the loading spinner color
        />
      }
    >
      <View style={styles.group}>
        <Text style={[styles.title, { color: titleColor }]}>In {inYear} ...</Text>
        {/* <Picker
          selectedValue={selectedYear}
          style={{ backgroundColor: cardBackgroundColor, color: titleColor }}
          onValueChange={handleYearChange}
        >
          <Picker.Item label="2023" value={2023} />
          <Picker.Item label="2024" value={2024} />
          <Picker.Item label="2025" value={2025} />
        </Picker> */}
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Fitness</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          <Value
            label="Steps:"
            ionicon="footsteps"
            value={yearlySteps.toLocaleString()}
            change={steps.toLocaleString() + " today"}
          />
          <Value
            label="Distance:"
            fontAwesome6Icon="person-walking-luggage"
            value={`${(yearlyDistance / 1000).toFixed(2)} km`}
            change={(distance / 1000).toFixed(2) + " km today"}
          />
          {/* <Value label="Floors Climbed:" value={yearlyFlights.toString()} />
          <Value label="Active Calories Burned:" value={yearlyCalories.toString()} />
          <Value label="Average Heart Rate:" value={yearlyHeartRate.toString()} /> */}
        </View>
      </View>
      <View style={styles.group}>
        <Text style={[styles.title, { color: titleColor }]}>Today</Text>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Fitness</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          <Value
            label="Steps:"
            ionicon="footsteps"
            value={steps.toLocaleString()}
            change={stepChange ? stepChange.toLocaleString() : null}
          />
          <Value
            label="Distance:"
            fontAwesome6Icon="person-walking-luggage"
            value={`${(distance / 1000).toFixed(2)} km`}
            change={distanceChange ? (distanceChange / 1000).toFixed(2) : null}
          />
          <Value label="Floors Climbed:" fontAwesome6Icon="stairs" value={flights.toString()} />
          <Value label="Active Calories Burned:" fontAwesome5Icon="fire-alt" value={calories.toString()} />
          <Value label="Average Heart Rate:" fontAwesome5Icon="heartbeat" value={heartRate.toString()} />
        </View>
      </View>
      <View style={styles.group}>
        <Text style={[styles.title, { color: titleColor }]}>Yesterday</Text>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Fitness</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          <Value label="Steps:" ionicon="footsteps" value={stepsYesterday.toString()} />
          <Value
            label="Distance:"
            fontAwesome6Icon="person-walking-luggage"
            value={`${(distanceYesterday / 1000).toFixed(2)} km`}
          />
          <Value label="Floors Climbed:" fontAwesome6Icon="stairs" value={flightsYesterday.toString()} />
          <Value
            label="Active Calories Burned:"
            fontAwesome5Icon="fire-alt"
            value={caloriesYesterday.toString()}
          />
          <Value
            label="Average Heart Rate:"
            fontAwesome5Icon="heartbeat"
            value={heartRateYesterday.toString()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexGrow: 1,
    justifyContent: "center",
    padding: 12,
  },
  group: {
    marginBottom: 20, // Space between the "Yesterday" and "Today" sections
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  subTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: -5,
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 30,
  },
  card: {
    borderRadius: 10, // Rounded corners for the card
    padding: 15, // Adjusted padding inside the card
    marginTop: 10, // Space between the title and the card
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Vertical shadow offset
    shadowOpacity: 0.1, // Transparency of the shadow
    shadowRadius: 4, // Blur of the shadow
    elevation: 5, // Shadow for Android (elevation)
    borderWidth: 2, // Border width for the card
    borderColor: "gray", // Border color for the card
  },
  values: {
    flexDirection: "row",
    gap: 25,
    flexWrap: "wrap",
    marginTop: 20, // Adjusted margin between items in the card
  },
  picker: {
    height: 50,
    width: 150,
    backgroundColor: '#333',
    color: '#fff',
  },
  datePicker: {
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  date: {
    fontWeight: "500",
    fontSize: 20,
    marginHorizontal: 20,
  },
  changeText: {
    color: "green",
    fontSize: 16,
    marginLeft: 10,
  },
  iconButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
