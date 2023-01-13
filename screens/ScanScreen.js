import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text} from "react-native";
import Firebase from "../firebaseConfig";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getDatabase, ref, set, onValue, child, update } from 'firebase/database';

function ScanScreen({route, navigation}) {
    const {userId} = route.params
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        async function getScanPermissions() {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getScanPermissions();
    }, []);

    function handleCodeScan({ data }) {
        setScanned(true);
        setIsCodeScanned({data})
        
        navigation.goBack()
    };

    function setIsCodeScanned({data}) {
        const db = getDatabase(Firebase)
        const menuRef = ref(db, 'users/' + userId + '/discountCode')
        onValue(menuRef, (snapshot) => {
            const userCode = snapshot.val()
            if(userCode === data) {
                update(ref(db, 'users/' + userId), {'codeScanned': true})
            }
            else {
                alert("Wrong discount code")
            }
        })
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style = {Styles.screen}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleCodeScan}
                style={StyleSheet.absoluteFillObject}/>
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
       </View>
    );
}

const Styles  = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 40,
        backgroundColor: 'white'
    }
})

export default ScanScreen