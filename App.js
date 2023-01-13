import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import OrderScreen from './screens/OrderScreen';
import ActiveOrderScreen from './screens/ActiveOrderScreen';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator useLegacyImplementation initialRouteName='Login'>
          <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown: false}}/>
          <Stack.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name='Order' component={OrderScreen} options={{headerShown: false}}/>
          <Stack.Screen name='Scan' component={ScanScreen} options={{headerShown: false}}/>
          <Stack.Screen name='Active' component={ActiveOrderScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
  )
}