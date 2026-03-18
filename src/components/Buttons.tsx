import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { sendLargeMessage, sendSmallMessage } from "../api";
import { useHighPriorityStore, useLowPriorityStore } from "../queue";

export const Buttons = () => {
  const smallMessagesCount = useHighPriorityStore(
    (state) => state.messages.length,
  );
  const largeMessagesCount = useLowPriorityStore(
    (state) => state.messages.length,
  );

  const [smallCounter, setSmallCounter] = useState(0);
  const [largeCounter, setLargeCounter] = useState(0);

  const handleSmallPress = () => {
    setSmallCounter((prev) => prev + 1);
    sendSmallMessage("small " + (smallCounter + 1));
  };

  const handleLargePress = () => {
    setLargeCounter((prev) => prev + 1);
    sendLargeMessage("large " + (largeCounter + 1));
  };

  return (
    <View style={styles.container}>
      <View>
        <Button title={`Small`} onPress={handleSmallPress} />
        <Text>Pending messages: {smallMessagesCount}</Text>
      </View>
      <View>
        <Button title={"Large"} onPress={handleLargePress} />
        <Text>Pending messages: {largeMessagesCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 15,
  },
});
