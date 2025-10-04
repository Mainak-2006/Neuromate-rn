import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00D4FF',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#6B7280' : '#9CA3AF',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 40,
          right: 40,
          height: 70,
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(17, 25, 40, 0.75)' 
            : 'rgba(255, 255, 255, 0.85)',
          borderRadius: 35,
          borderWidth: 1,
          borderColor: colorScheme === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          paddingBottom: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 14,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "planet" : "planet-outline"} 
              size={focused ? 28 : 24} 
              color={focused ? '#00D4FF' : color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "flash" : "flash-outline"} 
              size={focused ? 28 : 24} 
              color={focused ? '#00D4FF' : color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "code-working" : "code-working-outline"} 
              size={focused ? 28 : 24} 
              color={focused ? '#00D4FF' : color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "rocket" : "rocket-outline"} 
              size={focused ? 28 : 24} 
              color={focused ? '#00D4FF' : color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="oauth-native-callback"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}