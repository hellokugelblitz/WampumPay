import { KeyboardAvoidingView, Text, View, ScrollView, Platform } from 'react-native'
import React, { Component } from 'react'


const ios = Platform.OS === 'ios';
export default function CustomKeyboardView({children}) {
    return (
        <KeyboardAvoidingView behavior={ios? 'padding':'height'} style={{flex:1}}>
            <ScrollView
                style={{flex:1}}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    children
                }
            </ScrollView>
        </KeyboardAvoidingView>
    )
}