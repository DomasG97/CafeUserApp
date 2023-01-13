import React from 'react'
import { useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import Firebase from '../firebaseConfig'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';
import uuid from 'react-native-uuid'

function RegisterScreen({navigation}) {
    const [email, setEmail] = useState('user3@email.com')
    const [password, setPassword] = useState('password3')

    function registerUser() {
        const auth = getAuth(Firebase)
        createUserWithEmailAndPassword(auth, email, password)
        .then((currentUser) => {
            alert("Registration was successful")
            setEmail('')
            setPassword('')
            saveUser(currentUser.user.uid, currentUser.user.email)
            navigation.navigate('Login')
        })
        .catch(err => {
            alert(err)
        })
    }

    function saveUser(userId, userEmail) {
        const db = getDatabase(Firebase)
        set(ref(db, 'users/' + userId), {
            email: userEmail,
            discountCode: uuid.v4(),
            codeUseCount: 0,
            codeScanned: false
        })
    }
    
    return(
    <View style={styles.screen}>
        <Text style={styles.title}>Register</Text>
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
        <TouchableOpacity
            style={styles.button}
            onPress={() => registerUser()}>
            <View>
                <Text>Register</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity 
            style={{marginTop: 10}} 
            onPress={() => navigation.replace('Login')}>
            <Text>Already got an account? Sign in</Text>
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

export default RegisterScreen