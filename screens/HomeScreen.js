import React from 'react'
import { useState, useEffect } from 'react'
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import Firebase from '../firebaseConfig';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function HomeScreen({route, navigation}) {
    const {userId, initialOrder} = route.params
    const [items, setItems] = useState([])
    const [order, setOrder] = useState(initialOrder)

    useEffect(() =>  {
        const db = getDatabase(Firebase)
        const menuRef = ref(db, 'menu/coffee/')
        onValue(menuRef, (snapshot) => {
            setItems([])
            snapshot.forEach((child) => {
                const newObj = {
                    type: child.key,
                    size: child.val().size,
                    price: child.val().price
                }
                setItems(emptyArray => [...emptyArray, newObj]);
            })
        })
    }, [])

    function addItemToBasket({item}) {
        setOrder(emptyArray => [...emptyArray, item])
    }

    return(
        <View style={styles.screen}>
            <Text style={styles.title}>Coffee</Text>
            <View style={styles.horizontalLine}></View>
            <View>
                <FlatList
                    data={items}
                    renderItem={({item}) => {
                        return(
                            <TouchableOpacity
                                style={styles.item}       
                                onPress={() => addItemToBasket({item})}>
                                <View style = {{flexDirection: 'column'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>{item.type}</Text>
                                    <Text>Price: {item.price}$</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <TouchableOpacity
                style={styles.basketButton}
                onPress={() => navigation.navigate('Order', {userId: userId, initialOrder: order})}>
                    <Text>Basket</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        minHeight: Dimensions.get('window').height,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 220
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
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        width: Dimensions.get('window').width - 20,
        marginBottom: 20,
        borderWidth: 3,
        borderRadius: 70,
        borderColor: 'brown',
        borderStyle: 'solid',
    },
    basketButton: {
        borderWidth: 3,
        borderColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        position: 'absolute',
        bottom: 110,
        right: 30,
        height: 70,
        backgroundColor: 'white',
        borderRadius: 100,
    },
    modalScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: Dimensions.get('window').height - 60,
        width: Dimensions.get('window').width - 30,
        backgroundColor: 'white',
        borderWidth: 3,
        borderRadius: 50,
        borderColor: "lightblue",
    },
    modalItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        width: Dimensions.get('window').width - 60,
        marginBottom: 20,
        borderWidth: 3,
        borderRadius: 70,
        borderColor: 'brown',
        borderStyle: 'solid'
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 80
    },
    buttonContainer: {
        padding: 10
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
    }
})