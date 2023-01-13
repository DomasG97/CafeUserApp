import React from 'react'
import { useState, useEffect } from 'react'
import { Text, View, FlatList, StyleSheet, Dimensions} from 'react-native'
import Firebase from '../firebaseConfig';
import { getDatabase, ref, onValue } from 'firebase/database';
import uuid from 'react-native-uuid'

export default function ActiveOrderScreen({route, navigation}) {
    const {userId} = route.params
    const [order, setOrder] = useState([])
    const [preparing, setPreparing] = useState(false)
    const [finished, setFinished] = useState(false)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const db = getDatabase(Firebase)
        const menuRef = ref(db, 'orders/' + userId)
        onValue(menuRef, (snapshot) => {
            const orderData = snapshot.val()
            if(orderData === null) {
                navigation.navigate('Home', {userId: userId})
            }
            else {
                setPreparing(orderData.preparing)
                setFinished(orderData.finished)
                setOrder(orderData.order)
                setTotal(orderData.total)
            }
        })
    }, [])

    function getOrderStatus() {
        if(preparing === false) {
            return <Text style={{fontWeight: 'bold', fontSize: 15, color: 'red'}}>Order not accepted yet...</Text>
        }
        else if(preparing === true && finished === false) {
            return <Text style={{fontWeight: 'bold', fontSize: 15, color: 'orange'}}>Order is being prepared...</Text>
        }
        else {
            return <Text style={{fontWeight: 'bold', color: 'green'}}>Order is finished!</Text>
        }
    }

    return(
        <View style={styles.screen}>
            <Text style={styles.title}>Your order</Text>
            <View style={styles.horizontalLine}></View>
            <View>
                <FlatList
                    data={order}
                    renderItem={({item}) => {
                        return(
                            <View
                                style={styles.item}>       
                                <View style = {{flexDirection: 'column'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>{item.type}</Text>
                                    <Text>Price: {item.price}$</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
            <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceText}>Total: {total.toFixed(2)}$</Text>
            </View>
            <View>{getOrderStatus()}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: Dimensions.get('window').height,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 250
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingTop: 20,
        paddingBottom: 10,
        textShadowColor: 'grey',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        elevation: 5
    },
    horizontalLine: {
        width: Dimensions.get('window').width - 20,
        borderBottomWidth: 3,
        borderBottomColor: 'brown',
        borderRadius: 100,
        marginTop: 5,
        marginBottom: 15
    },
    item: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: 70,
        width: Dimensions.get('window').width - 20,
        marginBottom: 20,
        paddingLeft: 20,
        borderBottomWidth: 3,
        borderRadius: 10,
        borderBottomColor: 'lightgrey',
    },
    totalPriceContainer: {
        marginVertical: 20
    },
    totalPriceText: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})