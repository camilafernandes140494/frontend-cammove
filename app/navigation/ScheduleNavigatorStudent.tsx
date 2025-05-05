// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import { StudentProvider } from '../../context/StudentContext';
import { useUser } from '@/context/UserContext';
import SchedulesStudent from '../(schedules)/schedulesStudent';
import RegisterSchedules from '../(schedules)/registerSchedules';


const Stack = createStackNavigator();

function SchedulesNavigatorStudent() {
  const { user } = useUser();

  return (
    <StudentProvider studentCode={user?.id || ''}>
      <Stack.Navigator>
        <Stack.Screen name="SchedulesStudent" component={SchedulesStudent} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterSchedules" component={RegisterSchedules} options={{ headerShown: false }} />
      </Stack.Navigator>
    </StudentProvider>

  );
}

export default SchedulesNavigatorStudent;
