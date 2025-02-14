// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import Workouts from '../(workouts)/workouts';
import CreateWorkout from '../(workouts)/createWorkout';


const Stack = createStackNavigator();

function WorkoutsNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Workouts" component={Workouts} options={{ headerShown: false }} />
            <Stack.Screen name="CreateWorkout" component={CreateWorkout} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default WorkoutsNavigator;
