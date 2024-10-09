import {
  Button as ReactNativeBtn,
  View as ReactNativeView,
  SafeAreaView as ReactNativeSafeAreaView,
  ScrollView as ReactNativeScrollView,
  TouchableOpacity as ReactNativeTouchableOpacity,
  TextInput as ReactNativeTextInput,
  Alert as ReactNativeAlert,
} from 'react-native'
import { styled } from 'nativewind'
import DropDownPicker from 'react-native-dropdown-picker'
export const Button = styled(ReactNativeBtn)
export const Column = styled(ReactNativeView, {
  props: {
    className: 'flex flex-col',
  },
})
export const Row = styled(ReactNativeView, {
  props: {
    className: 'flex flex-row',
  },
})

export const Div = styled(ReactNativeView)

export const SafeAreaView = styled(ReactNativeSafeAreaView)

export const ScrollView = styled(ReactNativeScrollView)

export const TouchableOpacity = styled(ReactNativeTouchableOpacity)

export const TextInput = styled(ReactNativeTextInput)

export const StyledDropDownPicker = styled(DropDownPicker)
