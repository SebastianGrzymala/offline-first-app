import { Button, FlatList, Text, View } from "react-native";
import { useLoggerStore } from "../logger/useLoggerStore";

export const Logs = () => {
  const messages = useLoggerStore((state) => state.messages);
  const clearLogs = useLoggerStore((state) => state.clearLogs);
  return (
    <>
      {!!messages.length && <Button title="Clear Logs" onPress={clearLogs} />}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.timestamp}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.timestamp}: {item.message}
            </Text>
          </View>
        )}
      />
    </>
  );
};
