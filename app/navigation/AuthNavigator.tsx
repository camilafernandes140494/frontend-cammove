import { createStackNavigator } from '@react-navigation/stack';
import Login from '../(auth)/login';
import CreateUser from '../(auth)/createUser';


const Stack = createStackNavigator();

function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="CreateUser" component={CreateUser} />
        </Stack.Navigator>
    );
}

export default AuthNavigator;
