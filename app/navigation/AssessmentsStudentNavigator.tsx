// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import CreateAssessments from '../(assessments)/createAssessments';
import DetailsAssessments from '../(assessments)/detailsAssessments';
import { StudentProvider } from '../context/StudentContext';
import { useUser } from '../UserContext';
import AssessmentsStudent from '../(assessments)/assessmentsStudent';


const Stack = createStackNavigator();

function CreateAssessmentsStudentNavigator() {
  const { user } = useUser();

  return (
    <StudentProvider studentCode={user?.id || ''}>
      <Stack.Navigator>
        <Stack.Screen name="AssessmentsStudent" component={AssessmentsStudent} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAssessments" component={CreateAssessments} options={{ headerShown: false }} />
        <Stack.Screen name="DetailsAssessments" component={DetailsAssessments} options={{ headerShown: false }} />
      </Stack.Navigator>
    </StudentProvider>
  );
}

export default CreateAssessmentsStudentNavigator;
