import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../(home)/home';
import { Ionicons } from '@expo/vector-icons';
import ExercisesNavigator from './ExercisesNavigator';
import WorkoutsNavigator from './WorkoutsNavigator';

const Tab = createBottomTabNavigator();

function HomeTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />
                ),
            }} />
            <Tab.Screen name="Workouts" component={WorkoutsNavigator} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="fitness" size={size} color={color} />
                ),
            }} />
            <Tab.Screen name="Exercises" component={ExercisesNavigator} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="barbell" size={size} color={color} />
                ),
            }} />
        </Tab.Navigator>
    );
}

export default HomeTabs;
