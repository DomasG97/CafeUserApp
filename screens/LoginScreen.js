import React from 'react'
import { useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import Firebase from '../firebaseConfig'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import uuid from 'react-native-uuid'

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('user1@email.com')
    const [password, setPassword] = useState('password1')

    function loginUser() {
        const auth = getAuth(Firebase)
        signInWithEmailAndPassword(auth, email, password)
        .then((currentUser) => {
            //setEmail('')
            //setPassword('')
            navigation.replace('Home', {userId: currentUser.user.uid, initialOrder: []})
        }).catch(err => {
            alert(err);
        })
    }

    return(
    <View style={styles.screen}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.label}>Email:</Text>
        <View style={styles.input}>
            <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
        </View>
        <Text style={styles.label}>Password:</Text>
        <View style={styles.input}>
            <TextInput
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
        </View>
        <TouchableOpacity style={styles.button} onPress={loginUser}>
            <Text>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={{marginTop: 10}} 
            onPress={() => navigation.replace('Register')}>
            <Text>Don't have an account yet? Register</Text>
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        minHeight: Dimensions.get('window').height,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 40
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        margin: 40,
        textShadowColor: 'grey',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        elevation: 5
    },
    label: {
        fontSize: 15,
        marginTop: 20
    },
    input: {
        width: 200,
        borderBottomWidth: 3,
        borderBottomColor: 'brown',
    },
    button: {
        borderWidth: 3,
        borderColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 40,
        margin: 20
    }
})