import React from 'react'
import { useState, useEffect } from 'react'
import { Text, View, FlatList, TextInput, TouchableOpacity, StyleSheet, Dimensions,  BackHandler} from 'react-native'
import Firebase from '../firebaseConfig';
import { getDatabase, ref, set, onValue, child, update } from 'firebase/database';
import uuid from 'react-native-uuid'

export default function OrderScreen({route, navigation}) {
    const {userId, initialOrder} = route.params
    const [order, setOrder] = useState(initialOrder)
    const [total, setTotal] = useState(0)
    const [codeUseCount, setCodeUseCount] = useState(0)
    const [codeScanned, setCodeScanned] = useState(false)
    const [cheapest, setCheapest] = useState(order[0])

    useEffect(() => {
        getTotal()
        getCodeUseCount()
        getIsCodeScanned()
        //handleDiscount()
    }, [])

    function getTotal() {
        order.forEach((item) => {
            setTotal(newTotal => newTotal + item.price)
        })
    }

    function getCodeUseCount() {
        const db = getDatabase(Firebase)
        const menuRef = ref(db, 'users/' + userId + '/codeUseCount')
        onValue(menuRef, (snapshot) => {
            setCodeUseCount(snapshot.val())
        })
    }

    function getIsCodeScanned() {
        const db = getDatabase(Firebase)
        const menuRef = ref(db, 'users/' + userId + '/codeScanned')
        onValue(menuRef, (snapshot) => {
            setCodeScanned(snapshot.val())
        })
    }

    function removeItem({item}) {
        const newOrder = order.filter((x) => x.type !== item.type)
        setOrder(newOrder)
        setTotal(total => total - item.price)
    }

    function makeOrder() {
        const db = getDatabase(Firebase)
        set(ref(db, 'orders/' + userId), {
            order: order,
            total: total,
            preparing: false,
            finished: false
        })
    }

    function handleDiscount() {
        console.log(codeUseCount)

        if(codeUseCount >= 6) {
            for(let item of order) {
                if(item.price < cheapest.price) {
                    setCheapest(item)
                }
            }

            const newOrder = order.map((item) => {
                if(item === cheapest) {
                    return { ...item, price: 0}
                }
                return item
            })

            setOrder(newOrder)
            setTotal(total => total - cheapest.price)
        }
    }

    function handleOrder() {

        handleDiscount()
        const db = getDatabase(Firebase)

        update(ref(db, 'users/' + userId), {'codeUseCount': codeUseCount - 6})

        if(codeScanned === true) {
            update(ref(db, 'users/' + userId), {'codeScanned': false})
        }

        makeOrder()

        navigation.replace('Active', {userId: userId})
    }

    function handleScan() {
        if(codeScanned === false) {
            navigation.navigate("Scan", {userId: userId})

            const db = getDatabase(Firebase)
            update(ref(db, 'users/' + userId), {'codeUseCount': codeUseCount + order.length})
        }
        else {
            alert("Code is already scanned")
        }
    }

    return(
        <View style={styles.screen}>
            <View style = {styles.buttonsContainer}>
                <View style={[styles.buttonContainer, {alignItems: 'flex-start'}]}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => handleOrder()}>
                        <Text>Order</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.buttonContainer, {alignItems: 'flex-end'}]}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleScan()}>
                        <Text>Scan discount</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.totalView}>
                <Text style={styles.totalText}>Total: {total.toFixed(2)}$</Text>
                <Text style={styles.totalText}>Cups: {codeUseCount}</Text>
            </View>
            <View style={styles.horizontalLine}></View>
            <View style={styles.itemsContainer}>
                <FlatList
                    data={order}
                    renderItem={({item}) => {
                        return(
                            <View style={styles.item}>
                                <View style={styles.itemInfo}>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>{item.type}</Text>
                                    <Text>Price: {item.price}$</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeItem({item})}>
                                    <Text>X</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        minHeight: Dimensions.get('window').height,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 80
    },
    itemsContainer: {
        marginBottom: 230
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        width: Dimensions.get('window').width - 20,
        marginBottom: 20,
        borderWidth: 3,
        borderRadius: 70,
        borderColor: 'brown',
        borderStyle: 'solid'
    },
    itemInfo: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 120
    },
    buttonsContainer: {
        flexDirection: 'row',
        padding: 10,
        marginHorizontal: 10,
    },
    buttonContainer: {
        width: (Dimensions.get('window').width - 20) / 2,
    },
    button: {
        borderWidth: 3,
        borderColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 40
    },
    totalView: {
        width: Dimensions.get('window').width - 20,
        padding: 10,
        alignItems: 'flex-start',
    },
    totalText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    removeButton: {
        borderWidth: 3,
        borderColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 100,
        marginRight: 30
    },
    horizontalLine: {
        width: Dimensions.get('window').width - 20,
        borderBottomWidth: 3,
        borderBottomColor: 'brown',
        borderRadius: 100,
        marginTop: 5,
        marginBottom: 15
    }
})