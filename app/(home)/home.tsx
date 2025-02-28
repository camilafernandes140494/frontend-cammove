import React from 'react';
import { ScrollView, View, } from 'react-native';
import { Appbar, Button, Text, } from 'react-native-paper';
import { useUser } from '../UserContext';


const Home = () => {
    const { user, setUser } = useUser();

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Content title="Title" />
                <Appbar.Action icon="calendar" onPress={() => { }} />
                <Appbar.Action icon="magnify" onPress={() => { }} />
            </Appbar.Header>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 50,
                }}
            >
                <Button onPress={() => setUser({
                    id: null,
                    name: null,
                    gender: null,
                    permission: null,
                    token: null
                })}>deslogar</Button>

                <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
                    Olá {user?.name}
                </Text>

                {/* <Skeleton style={{ width: '90%', height: 500, borderRadius: 10 }} /> */}
            </ScrollView>
        </View>

    );
};

export default Home;
