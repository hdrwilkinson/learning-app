import { View, Text } from "react-native";

export default function HomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-4xl font-bold mb-4">Learning App</Text>
            <Text className="text-gray-600">
                GenAI-powered learning platform
            </Text>
        </View>
    );
}
