// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import { StudentProvider } from '../context/StudentContext';
import { useUser } from '../UserContext';
import WorkoutsStudent from '../(workouts)/workoutsStudent';
import DetailsWorkoutStudent from '../(workouts)/detailsWorkoutStudent';
import ReviewsStudent from '../(reviews)/reviewsStudent';


const Stack = createStackNavigator();

function WorkoutsNavigatorStudent() {
  const { user } = useUser();

  return (
    <StudentProvider studentCode={user?.id || ''}>
      <Stack.Navigator>
        <Stack.Screen name="WorkoutsStudent" component={WorkoutsStudent} options={{ headerShown: false }} />
        <Stack.Screen name="ReviewsStudent" component={ReviewsStudent} options={{ headerShown: false }} />
        <Stack.Screen name="DetailsWorkoutStudent" component={DetailsWorkoutStudent} options={{ headerShown: false }} />
      </Stack.Navigator>
    </StudentProvider>

  );
}

export default WorkoutsNavigatorStudent;
