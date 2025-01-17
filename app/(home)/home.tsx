import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';

const Home = () => {
    const { user } = useUser();
    return (
        <View >
            <Text >Welcome to the Home Screen!</Text>
            <Text >{user.id}</Text>

        </View>
    );
};



export default Home;
