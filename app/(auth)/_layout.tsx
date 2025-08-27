import { Slot } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className={"bg-white h-full"}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
