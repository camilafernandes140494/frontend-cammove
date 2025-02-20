// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import Workouts from '../(workouts)/workouts';
import CreateWorkout from '../(workouts)/createWorkout';
import { StudentProvider } from '../context/StudentContext';
import { useUser } from '../UserContext';
import DetailsWorkout from '../(workouts)/detailsWorkout';


const Stack = createStackNavigator();

function WorkoutsNavigator() {
    const { user } = useUser();

    return (
        <StudentProvider studentCode={user.id || ''}>
            <Stack.Navigator>
                <Stack.Screen name="Workouts" component={Workouts} options={{ headerShown: false }} />
                <Stack.Screen name="CreateWorkout" component={CreateWorkout} options={{ headerShown: false }} />
                <Stack.Screen name="DetailsWorkout" component={DetailsWorkout} options={{ headerShown: false }} />
            </Stack.Navigator>
        </StudentProvider>

    );
}

export default WorkoutsNavigator;
