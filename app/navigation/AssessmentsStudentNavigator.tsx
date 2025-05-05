// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import { StudentProvider } from '../../context/StudentContext';
import { useUser } from '@/context/UserContext';
import AssessmentsStudent from '../(assessments)/assessmentsStudent';
import DetailsAssessmentsStudent from '../(assessments)/detailsAssessmentsStudent';


const Stack = createStackNavigator();

function CreateAssessmentsStudentNavigator() {
  const { user } = useUser();

  return (
    <StudentProvider studentCode={user?.id || ''}>
      <Stack.Navigator>
        <Stack.Screen name="AssessmentsStudent" component={AssessmentsStudent} options={{ headerShown: false }} />
        <Stack.Screen name="DetailsAssessmentsStudent" component={DetailsAssessmentsStudent} options={{ headerShown: false }} />
      </Stack.Navigator>
    </StudentProvider>
  );
}

export default CreateAssessmentsStudentNavigator;
