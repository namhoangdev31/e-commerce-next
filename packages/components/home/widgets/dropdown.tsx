import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import React, { useState } from 'react'
import { styled } from 'nativewind'
import { StyledDropDownPicker } from 'app/design/total-design'
import { StyleSheet } from 'react-native'

const DropdownWithHook = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | null>(null)
  const [items, setItems] = useState([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ])

  return (
    <View>
      <StyledDropDownPicker
        className="text text-2 w-[30vw] max-w-full flex-1 justify-center"
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select an option"
        style={styles.dropdown}
        mode="SIMPLE"
        theme="LIGHT"
        modalAnimationType="fade"
        dropDownContainerStyle={styles.dropdownContainer}
       open = {open}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  dropdown: {
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingTop: 2,
  },
  selectedOption: {
    marginTop: 16,
    fontSize: 16,
  },
})

export default DropdownWithHook
