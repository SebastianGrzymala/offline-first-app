import { Button, FlatList, Text, View } from "react-native";
import { useLoggerStore } from "../logger/useLoggerStore";

export const Logs = () => {
  const logs = useLoggerStore((state) => state.logs);
  const clearLogs = useLoggerStore((state) => state.clearLogs);
  return (
    <>
      {!!logs.length && <Button title="Clear Logs" onPress={clearLogs} />}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.timestamp}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.timestamp}: {item.payload}
            </Text>
          </View>
        )}
      />
    </>
  );
};
