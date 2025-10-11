import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

const History = () => {
  const [sessionStatus, setSessionStatus] = useState<'checking' | 'active' | 'signed-out' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setErrorMessage(error.message)
        setSessionStatus('error')
        return
      }

      setSessionStatus(data.session ? 'active' : 'signed-out')
    }

    fetchSession()
  }, [])

  return (
    <View>
      <Text>history</Text>
      <Text>Supabase session: {sessionStatus}</Text>
      {errorMessage && <Text>{errorMessage}</Text>}
    </View>
  )
}

export default History

