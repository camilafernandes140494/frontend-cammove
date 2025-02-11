// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import Exercises from '../(exercises)/exercises';
import CreateExercise from '../(exercises)/createExercise';


const Stack = createStackNavigator();

function CreateExercisesNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Exercises" component={Exercises} options={{ headerShown: false }} />
            <Stack.Screen name="CreateExercise" component={CreateExercise} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default CreateExercisesNavigator;
