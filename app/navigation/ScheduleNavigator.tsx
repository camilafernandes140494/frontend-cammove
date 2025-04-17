// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import Schedules from '../(schedules)/schedules';
import CreateSchedules from '../(schedules)/createSchedules';


const Stack = createStackNavigator();

function CreateScheduleNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Schedules" component={Schedules} options={{ headerShown: false }} />
      <Stack.Screen name="CreateSchedules" component={CreateSchedules} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default CreateScheduleNavigator;
