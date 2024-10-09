import { Text } from 'app/design/typography'
import {
  Column,
  Div,
  Row,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'app/design/total-design'
import { View } from 'app/design/view'
import { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { useLink } from 'solito/link'

import { useNavigation } from 'expo-router'

import React from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { IconButton, MD3Colors, Button } from 'react-native-paper'

const Tab = createBottomTabNavigator()

import { MainTab } from '../../../components/home/home_tab'

function AboutTab() {

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <Column className="items-center justify-center pl-1.5 pr-1.5">
          {[...Array(10)].map((_, index) => (
            <Text key={index} className="mb-4 text-2xl font-bold">
              Home ${index}
            </Text>
          ))}
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold">About</Text>
          </View>
        </Column>
      </ScrollView>
    </SafeAreaView>
  )
}

function ContactTab() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Contact</Text>
    </View>
  )
}

export function HomeScreen() {
  const navigation = useNavigation()

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="home" color={color} />
          ),
        }}
        component={MainTab}
      />
      <Tab.Screen
        name="Sale"
        options={{
          headerShown: false,
          title: 'House Sale',
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="ios-compass-sharp" color={color} />
          ),
          headerTintColor: MD3Colors.neutral10,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
        component={AboutTab}
      />
      <Tab.Screen
        name="Customer"
        options={{
          headerShown: false,
          title: 'Customer',
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="ios-people" color={color} />
          ),
          headerTintColor: MD3Colors.neutral10,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
        component={AboutTab}
      />
      <Tab.Screen
        name="Notifications"
        options={{
          headerShown: false,
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="ios-notifications" color={color} />
          ),
          headerTintColor: MD3Colors.neutral10,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
        component={AboutTab}
      />

      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              size={24}
              name="ios-person-circle-outline"
              color={color}
            />
          ),
        }}
        component={ContactTab}
      />
    </Tab.Navigator>
  )
}
