import { useWindowDimensions } from 'react-native'
import { useNavigation } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer'
import { Text } from 'app/design/typography'
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'app/design/total-design'
import { View } from 'app/design/view'
import DropdownWithHook from './widgets/dropdown'

const Drawer = createDrawerNavigator()

export function MainTab() {
  const dimensions = useWindowDimensions()
  const navigation = useNavigation()

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen
        name="Main"
        component={MainContent}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          drawerStyle: {
            width: 240,
          },
          headerRight: () => (
            <Ionicons
              name="ios-search"
              size={24}
              onPress={openDrawer}
              style={{
                padding: 10,
              }}
            />
          ),
          drawerPosition: 'right',
          drawerType: dimensions.width >= 768 ? 'permanent' : 'slide',
          drawerLabelStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => null,
        }}
      />
    </Drawer.Navigator>
  )
}

function CustomDrawerContent(props) {
  const [selectedDistricts, setSelectedDistricts] = useState([
    'Tây Hồ',
    'Cầu Giấy',
  ])
  const [filters, setFilters] = useState({
    hasPool: false,
    luxuryInterior: false,
    project: false,
  })

  const toggleDistrict = (district) => {
    if (selectedDistricts.includes(district)) {
      setSelectedDistricts(selectedDistricts.filter((d) => d !== district))
    } else {
      setSelectedDistricts([...selectedDistricts, district])
    }
  }

  return (
    <DrawerContentScrollView {...props}>
      <Text className="my-2 ml-4 text-2xl font-bold">Tìm kiếm</Text>

      <TextInput
        placeholder="Từ khoá"
        className="mx-4 my-2 rounded border border-gray-300 p-2"
      />

      <TextInput
        placeholder="Phân khúc"
        className="mx-4 my-2 rounded border border-gray-300 p-2"
      />

      <Text className="ml-4 mt-4 font-bold">Quận/Huyện</Text>
      <View className="mx-4 flex-row flex-wrap">
        {selectedDistricts.map((district) => (
          <TouchableOpacity
            key={district}
            className="mb-2 mr-2 rounded-full bg-gray-200 px-4 py-1"
            onPress={() => toggleDistrict(district)}
          >
            <Text>{district} X</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Diện tích"
        className="mx-4 my-2 rounded border border-gray-300 p-2"
      />

      <TextInput
        placeholder="Mặt tiền"
        className="mx-4 my-2 rounded border border-gray-300 p-2"
      />

      <TextInput
        placeholder="Số tầng"
        className="mx-4 my-2 rounded border border-gray-300 p-2"
      />

      <Text className="ml-4 mt-4 font-bold">Tiêu chí bất động sản</Text>
      <View className="mx-4 my-4 flex-row justify-between">
        <TouchableOpacity
          className="rounded bg-blue-500 px-4 py-2"
          onPress={() => {
            props.navigation.closeDrawer()
          }}
        >
          <Text className="text-center text-white">Tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded border border-blue-500 px-4 py-2">
          <Text className="text-center text-blue-500">Xóa điều kiện</Text>
        </TouchableOpacity>
      </View>

      <Text className="ml-4 italic text-gray-500">
        Lưu ý: Điều kiện tìm kiếm sẽ được lưu trong suốt phiên làm việc.
      </Text>
    </DrawerContentScrollView>
  )
}
const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
]

function MainContent() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="flex-row flex-wrap items-start justify-between py-4">
          <Text className="px-4 text-2xl font-bold">Home</Text>
          <DropdownWithHook />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
