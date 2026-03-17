import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Buttons } from "./components/Buttons";
import { Logs } from "./components/Logs";
import { useConsumer } from "./queue";

export default function App() {
  useConsumer();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Buttons />
        <Logs />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: 30,
  },
});
