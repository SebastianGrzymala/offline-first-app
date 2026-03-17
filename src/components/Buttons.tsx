import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useHighPriorityStore, useLowPriorityStore } from "../queue";

export const Buttons = () => {
  const addSmallItem = useHighPriorityStore((state) => state.addItem);
  const smallItemsCount = useHighPriorityStore((state) => state.items.length);
  const addLargeItem = useLowPriorityStore((state) => state.addItem);
  const largeItemsCount = useLowPriorityStore((state) => state.items.length);
  const [smallCounter, setSmallCounter] = useState(0);
  const [largeCounter, setLargeCounter] = useState(0);

  const handleSmallPress = () => {
    setSmallCounter((prev) => prev + 1);
    addSmallItem({
      id: Date.now().toString(),
      payload: `small ${smallCounter + 1}`,
    });
  };

  const handleLargePress = () => {
    setLargeCounter((prev) => prev + 1);
    addLargeItem({
      id: Date.now().toString(),
      payload: `large ${largeCounter + 1}`,
    });
  };

  return (
    <View style={styles.container}>
      <Button title={`Small`} onPress={handleSmallPress} />
      <Text>Pending items: {smallItemsCount}</Text>
      <Button title={"Large"} onPress={handleLargePress} />
      <Text>Pending items: {largeItemsCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
