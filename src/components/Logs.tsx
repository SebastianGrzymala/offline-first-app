import { FlatList, Text, View } from "react-native";
import { useLoggerStore } from "../logger/useLoggerStore";

export const Logs = () => {
  const logs = useLoggerStore((state) => state.logs);
  return (
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
  );
};
