import { View } from 'app/design/view'
import { Text, TextLink } from 'app/design/typography'
import axios from 'axios'
import { google } from '@ai-sdk/google'

export function HomeWebScreen() {
  const fetchUsers = () => {
    axios
      .get('http://localhost:3030/api/users/all')
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error('There was an error fetching the users!', error)
      })
  }

  const getGemini = () => {

  }

  return (
    <View className="flex-1 items-center justify-center">
      <TextLink className="w-1/3" tw="text-1" href="/">
        asdasdasd
      </TextLink>
      <button onClick={fetchUsers}>Fetch Users</button>
    </View>
  )
}
