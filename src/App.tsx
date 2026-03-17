import { Button, StyleSheet, View } from "react-native";
import { sendLargeMessage, sendSmallMessage } from "./api";

export default function App() {
  return (
    <View style={styles.container}>
      <Button title={"Small"} onPress={() => sendSmallMessage("small")} />
      <Button title={"Large"} onPress={() => sendLargeMessage("large")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
