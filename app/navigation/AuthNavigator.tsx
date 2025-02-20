import { createStackNavigator } from '@react-navigation/stack';
import Login from '../(auth)/login';
import CreateUser from '../(auth)/createUser';


const Stack = createStackNavigator();

function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="CreateUser" component={CreateUser} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default AuthNavigator;
