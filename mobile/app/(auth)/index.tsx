import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSocialAuth } from '../../hooks/useSocialauth';

export default function App() {
  const { handleSocialAuth, isLoading } = useSocialAuth();
  
  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-gray-600 mt-4 text-base">Signing you in...</Text>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 py-12 items-center justify-between">
        <View className="flex-1 justify-center">
          {/*DEMO IMAGE*/}
          <View className="items-center mb-12">
            <Image
              source={require("../../assets/images/icon.png")}
              className="size-56"
              resizeMode='contain'
            />
            <Text className="text-gray-600 mt-4 text-base text-xl font-bold">Welcome to NeuroMate</Text>
          </View>
          <View className='flex-col gap-2'>
            {/*GOOGLE SIGNIN BUTTON*/}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleSocialAuth("oauth_google")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-center">
                <Image
                  source={require("../../assets/images/google.png")}
                  className="size-10 mr-3"
                  resizeMode="contain"
                />
                <Text className="text-black font-medium text-base">
                  Continue with Google</Text>
              </View>
            </TouchableOpacity>

            {/*FACEBOOK SIGNIN BUTTON*/}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-4 px-6"
              onPress={() => handleSocialAuth("oauth_facebook")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-center">
                <Image
                  source={require("../../assets/images/facebook.jpg")}
                  className="size-7 px-9"
                  resizeMode="contain"
                />
                <Text className="text-black font-medium text-base">
                  Continue with FaceBook</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*APPLE SIGNIN BUTTON*/}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-4 mt-2  px-6"
              onPress={() => handleSocialAuth("oauth_apple")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-center">
                <Image
                  source={require("../../assets/images/apple.png")}
                  className="size-8 px-7"
                  resizeMode="contain"
                />
                <Text className="text-black font-medium gap-2 text-base">
                  Continue with Apple</Text>
              </View>
            </TouchableOpacity>
            
          {/* Terms and Privacy */}
          <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
            By signing up, you agree to our <Text className="text-blue-500">Terms</Text>
            {", "}
            <Text className="text-blue-500">Privacy Policy</Text>
            {", and "}
            <Text className="text-blue-500">Cookie Use</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}