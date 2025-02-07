import { useState, useCallback, useEffect, useRef } from "react";
import { Text, View, useThemeColor } from "../../components/Themed";
import Value from "../../components/Value";
import { ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import useHealthData from "../../hooks/useFetchStepsData";
import useYearlyHealthData from "../../hooks/useFetchYearlyStepsData";
import { Picker } from "@react-native-picker/picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";

type HomeScreenProps = {};

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [inYear, setInYear] = useState<number>(2025);
  const [stepChange, setStepChange] = useState<number | null>(null);
  const [distanceChange, setDistanceChange] = useState<number | null>(null);
  const [yearFitnessFilter, setYearFitnessFilter] = useState<"totals" | "averages">("totals");
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
    weight: weightYesterday,
    heartRate: heartRateYesterday,
    sleepDuration: sleepDurationYesterday,
  } = useHealthData(yesterday);
  const { steps, flights, distance, calories, weight, heartRate, sleepDuration } = useHealthData(date);
  const { yearlySteps, averageDailySteps, yearlyFlights, averageDailyFlights, yearlyDistance, averageDailyDistance, yearlyCalories, yearlyWeight, yearlyHeartRate, yearlySleepDuration } = useYearlyHealthData(inYear, date);

  // Use the theme colors for text and background
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "darkerText");
  const titleColor = useThemeColor({}, "text");
  const changeText = useThemeColor({}, "greenText");
  const redText = useThemeColor({}, "redText");
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
  }, []);

  useEffect(() => {
    // Whenever the date is updated (e.g. from pull-to-refresh)
    // Trigger the useHealthData hook to re-fetch both today's and yesterday's data
  }, []);

  // useEffect(() => {
  //   if (steps > previousSteps.current) {
  //     const stepCountChange = steps - previousSteps.current;
  //     setStepChange(stepCountChange);
  //     previousSteps.current = steps; // Update previousSteps
  //   } else if (steps === previousSteps.current) {
  //     setStepChange(null); // Reset stepChange if no change
  //   }
  // }, [steps]); // Only trigger when steps change

  // useEffect(() => {
  //   if (distance > previousDistance.current) {
  //     const distanceCountChange = distance - previousDistance.current;
  //     setDistanceChange(distanceCountChange);
  //     previousDistance.current = distance; // Update previousDistance
  //   } else if (distance === previousDistance.current) {
  //     setDistanceChange(null); // Reset distanceChange if no change
  //   }
  // }, [distance]);

  // const handleYearChange = (year: number) => {
  //   setSelectedYear(year);
  //   setInYear(year); // Update the parent component's state if necessary
  // };


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
        {/* Fitness Card */}
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Fitness</Text>
            <SegmentedControlTab
              values={["Totals", "Averages"]}
              selectedIndex={yearFitnessFilter === "totals" ? 0 : 1}
              onTabPress={(index) => setYearFitnessFilter(index === 0 ? "totals" : "averages")}
              tabsContainerStyle={styles.segmentedControl}
              tabStyle={{ backgroundColor: cardBackgroundColor, borderColor: textColor, borderWidth: 1 }}
              activeTabStyle={{ backgroundColor: backgroundColor, borderColor: titleColor, borderWidth: 1 }}
              tabTextStyle={{ color: textColor }}
              activeTabTextStyle={{ color: titleColor, fontWeight: "bold" }}
            />
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          {yearFitnessFilter === "totals" ? (
            <>
              <Value
                label={`Total Steps in ${inYear}:`}
                ionicon="footsteps"
                value={yearlySteps.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                changeColor="green"
                change={`${"↑ " + Math.abs(steps).toLocaleString(undefined, { maximumFractionDigits: 0 })} today`}
              />
              <Value
                label={`Total Distance Walking or Running in ${inYear}:`}
                fontAwesome6Icon="person-walking-luggage"
                value={`${(yearlyDistance / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km`}
                changeColor="green"
                change={`↑ ${(distance / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km today`}
              />
              <Value
                label={`Total Floors Climbed in ${inYear}:`}
                fontAwesome6Icon="stairs"
                value={yearlyFlights.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
                changeColor="green"
                change={`↑ ${flights.toLocaleString(undefined, { maximumFractionDigits: 0 })} today`}
              />
            </>
          ) : (
            <>
              <Value
                label={`Avg Steps per Day in ${inYear}:`}
                ionicon="footsteps"
                value={`${averageDailySteps.toLocaleString(undefined, { maximumFractionDigits: 0 })} /d`}
                changeColor="green"
                //change={`↑ ${steps.toLocaleString()} today`}
              />
              <Value
                label={`Avg Distance Walking or Running per Day in ${inYear}:`}
                fontAwesome6Icon="person-walking-luggage"
                value={`${(averageDailyDistance / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km/d`}
                changeColor="green"
                //change={`↑ ${steps.toLocaleString()} today`}
              />
              <Value
                label={`Avg Floors Climbed per Day in ${inYear}:`}
                fontAwesome6Icon="stairs"
                value={`${averageDailyFlights.toLocaleString(undefined, { maximumFractionDigits: 0 })} /d`} 
                changeColor="green"
                //change={`↑ ${steps.toLocaleString()} today`}
              />
            </>
          )}
        </View>
        {/* Health Card */}
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Health</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          <Value
            label={`Avg Active Calories Burned per Day in ${inYear}:`}
            fontAwesome5Icon="fire-alt"
            value={yearlyCalories.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          />
          <Value
            label={`Avg Heart Rate per Day in ${inYear}:`}
            fontAwesome5Icon="heartbeat"
            value={(yearlyHeartRate > 0) ? (
              yearlyHeartRate.toLocaleString(undefined, { maximumFractionDigits: 0 })
            ) : (
              "-"
            )}
          />
          <Value
            label={`Avg Weight in ${inYear}:`}
            fontAwesome6Icon="weight-scale"
            value={(yearlyWeight > 0) ? (
              `${yearlyWeight.toLocaleString(undefined, { maximumFractionDigits: 2 })} lb`
            ) : (
              "-"
            )}
          />
          <Value
            label={`Avg Sleep Duration per Night in ${inYear}:`}
            ionicon="bed"
            value={yearlySleepDuration > 0 ? (
              `${yearlySleepDuration.toLocaleString(undefined, { maximumFractionDigits: 2 })} hr`
            ) : (
              `-`
            )}
          />
        </View>
      </View>
      <View style={styles.group}>
        <Text style={[styles.title, { color: titleColor }]}>Today ({date.toLocaleDateString()})</Text>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Fitness</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          <Value
            label={`Total Steps Today:`}
            ionicon="footsteps"
            value={(steps > 0) ? (steps.toLocaleString(undefined, { maximumFractionDigits: 0 })) : ("-")}
            changeColor={(steps - stepsYesterday >= 0) ? ("green") : ("red")} 
            change={(steps > 0) ? (
              `${(steps - stepsYesterday) > 0 ? ("↑ " + (steps - stepsYesterday).toLocaleString(undefined, { maximumFractionDigits: 0 })) : ("↓ " + Math.abs(steps - stepsYesterday).toLocaleString(undefined, { maximumFractionDigits: 0 }))} from yesterday`
            ) : (
              ""
            )}
          />
          <Value
            label={`Total Distance Walking or Running Today:`}
            fontAwesome6Icon="person-walking-luggage"
            value={`${(distance / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km`}
            changeColor={((distance / 1000) - (distanceYesterday / 1000) >= 0) ? ("green") : ("red")} 
            change={`${((distance / 1000) - (distanceYesterday / 1000)) > 0 ? ("↑ " + ((distance / 1000) - (distanceYesterday / 1000)).toLocaleString(undefined, { maximumFractionDigits: 2 })) : ("↓ " + Math.abs((distance / 1000) - (distanceYesterday / 1000)).toLocaleString(undefined, { maximumFractionDigits: 2 }))} km from yesterday`}
            //change={distanceChange ? (distanceChange / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 }) : null}
          />
          <Value 
            label={`Total Floors Climbed Today:`} 
            fontAwesome6Icon="stairs" 
            value={flights.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
            changeColor={(flights - flightsYesterday >= 0) ? ("green") : ("red")} 
            change={`${(flights - flightsYesterday) > 0 ? ("↑ " + (flights - flightsYesterday).toLocaleString(undefined, { maximumFractionDigits: 0 })) : ("↓ " + Math.abs(flights - flightsYesterday).toLocaleString(undefined, { maximumFractionDigits: 0 }))} from yesterday`}
          />
        </View>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Health</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          <Value 
            label={`Active Calories Burned Today:`} 
            fontAwesome5Icon="fire-alt" 
            changeColor={(calories - caloriesYesterday >= 0) ? ("green") : ("red")} 
            value={calories.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
            change={`${(calories - caloriesYesterday) >= 0 ? ("↑ " + (calories - caloriesYesterday)) : ("↓ " + Math.abs(calories - caloriesYesterday))} from yesterday`}
          />
          <Value 
            label={`Average Heart Rate Today:`} 
            fontAwesome5Icon="heartbeat" 
            changeColor={(heartRate - heartRateYesterday >= 0) ? ("green") : ("red")} 
            value={`${heartRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
            change={`${(heartRate - heartRateYesterday) >= 0 ? ("↑ " + (heartRate - heartRateYesterday)) : ("↓ " + Math.abs(heartRate - heartRateYesterday))} from yesterday`}
          />
          <Value 
            label={`Weight Today:`} 
            fontAwesome6Icon="weight-scale" 
            changeColor={(weight - weightYesterday >= 0) ? ("green") : ("red")} 
            value={(weight > 0) ? (`${weight.toLocaleString(undefined, { maximumFractionDigits: 2 })} lb`
            ) : (
              "-"
            )}
            change={(weight > 0) ? (
              `${(weight - weightYesterday) >= 0 ? ("↑ " + (weight - weightYesterday).toLocaleString(undefined, { maximumFractionDigits: 2 })) : ("↓ " + Math.abs(weight - weightYesterday).toLocaleString(undefined, { maximumFractionDigits: 2 }))} lb from yesterday`
            ) : (
              ""
            )}
          />
          <Value 
            label={`Sleep Duration Last Night:`} 
            ionicon="bed" 
            changeColor={(sleepDuration - sleepDurationYesterday >= 0) ? ("green") : ("red")} 
            value={(sleepDuration > 0) ? (
              `${sleepDuration.toLocaleString(undefined, { maximumFractionDigits: 2 })} hr`
            ) : (
              `-`
            )}
            change={`${(sleepDuration > 0) ? (
              `${(sleepDuration - sleepDurationYesterday) >= 0 ? ("↑ " + (sleepDuration - sleepDurationYesterday).toLocaleString(undefined, { maximumFractionDigits: 2 })) : ("↓ " + Math.abs(sleepDuration - sleepDurationYesterday).toLocaleString(undefined, { maximumFractionDigits: 2 }))} hr from yesterday`) : (
                ""
              )}`}
          />
        </View>
      </View>
      <View style={styles.group}>
        <Text style={[styles.title, { color: titleColor }]}>Yesterday ({yesterday.toLocaleDateString()})</Text>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Fitness</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          <Value label={`Total Steps Yesterday:`} ionicon="footsteps" value={stepsYesterday.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
          <Value
            label={`Total Distance Walking or Running Yesterday:`}
            fontAwesome6Icon="person-walking-luggage"
            value={`${(distanceYesterday / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km`}
          />
          <Value label={`Total Floors Climbed Yesterday:`} fontAwesome6Icon="stairs" value={flightsYesterday.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
        </View>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={[styles.subTitleContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.subTitle, { color: titleColor }]}>Health</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal-circle-sharp" size={30} color={textColor} />
            </TouchableOpacity>
          </View>
          <Value label={`Active Calories Burned Yesterday:`} fontAwesome5Icon="fire-alt" value={caloriesYesterday.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
          <Value label={`Average Heart Rate Yesterday:`} fontAwesome5Icon="heartbeat" value={heartRateYesterday.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
          <Value 
            label={`Weight Yesterday:`} 
            fontAwesome6Icon="weight-scale" 
            value={(weightYesterday > 0) ? (`${weightYesterday.toLocaleString(undefined, { maximumFractionDigits: 2 })} lb`
            ) : (
              "-"
            )}
          />
          <Value 
            label={`Sleep Duration Yesterday:`} 
            ionicon="bed"
            value={`${sleepDurationYesterday.toLocaleString(undefined, { maximumFractionDigits: 2 })} hr`}
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
  segmentedControl: {
    flex: 1,
    marginHorizontal: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: "gray",
  },
  values: {
    flexDirection: "row",
    gap: 25,
    flexWrap: "wrap",
    marginTop: 20,
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
