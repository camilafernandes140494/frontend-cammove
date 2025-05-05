// WorkoutsNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import Assessments from '../(assessments)/assessments';
import CreateAssessments from '../(assessments)/createAssessments';
import DetailsAssessments from '../(assessments)/detailsAssessments';
import { StudentProvider } from '../../context/StudentContext';
import { useUser } from '@/context/UserContext';


const Stack = createStackNavigator();

function CreateAssessmentsNavigator() {
  const { user } = useUser();

  return (
    <StudentProvider studentCode={user?.id || ''}>
      <Stack.Navigator>
        <Stack.Screen name="Assessments" component={Assessments} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAssessments" component={CreateAssessments} options={{ headerShown: false }} />
        <Stack.Screen name="DetailsAssessments" component={DetailsAssessments} options={{ headerShown: false }} />
      </Stack.Navigator>
    </StudentProvider>
  );
}

export default CreateAssessmentsNavigator;
