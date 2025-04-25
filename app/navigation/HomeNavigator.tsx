import { createStackNavigator } from '@react-navigation/stack';
import { StudentProvider } from '../context/StudentContext';
import { useUser } from '../UserContext';
import Home from '../(home)/home';
import StudentProfile from '../(home)/studentProfile';
import RegisterUserByTeacher from '../(home)/registerUserByTeacher';
import UserList from '../(home)/UserList';
import Reviews from '../(reviews)/review';


const Stack = createStackNavigator();

function HomeNavigator() {
    const { user } = useUser();

    return (
        <StudentProvider studentCode={user?.id || ''}>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="UserList" component={UserList} options={{ headerShown: false }} />
                <Stack.Screen name="StudentProfile" component={StudentProfile} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterUserByTeacher" component={RegisterUserByTeacher} options={{ headerShown: false }} />
                <Stack.Screen name="Reviews" component={Reviews} options={{ headerShown: false }} />
            </Stack.Navigator>
        </StudentProvider>

    );
}

export default HomeNavigator;
