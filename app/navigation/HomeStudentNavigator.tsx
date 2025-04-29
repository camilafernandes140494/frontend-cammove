import { createStackNavigator } from '@react-navigation/stack';
import { StudentProvider } from '../context/StudentContext';
import { useUser } from '../UserContext';
import StudentProfile from '../(home)/studentProfile';
import RegisterUserByTeacher from '../(home)/registerUserByTeacher';
import HomeStudent from '../(home)/homeStudent';
import MyProfile from '../(home)/myProfile';


const Stack = createStackNavigator();

function HomeStudentNavigator() {
  const { user } = useUser();

  return (
    <StudentProvider studentCode={user?.id || ''}>
      <Stack.Navigator>
        <Stack.Screen name="HomeStudent" component={HomeStudent} options={{ headerShown: false }} />
        <Stack.Screen name="StudentProfile" component={StudentProfile} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterUserByTeacher" component={RegisterUserByTeacher} options={{ headerShown: false }} />
        <Stack.Screen name="MyProfile" component={MyProfile} options={{ headerShown: false }} />
      </Stack.Navigator>
    </StudentProvider>

  );
}

export default HomeStudentNavigator;
