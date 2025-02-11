// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import Workouts from '../(workouts)/workouts';


const Stack = createStackNavigator();

function WorkoutsNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Workouts" component={Workouts} options={{ headerShown: false }} />
            {/* <Stack.Screen name="ExerciseDetails" component={ExerciseDetails} /> */}
        </Stack.Navigator>
    );
}

export default WorkoutsNavigator;
