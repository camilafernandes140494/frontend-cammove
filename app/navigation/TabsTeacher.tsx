import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ExercisesNavigator from './ExercisesNavigator';
import WorkoutsNavigator from './WorkoutsNavigator';
import HomeNavigator from './HomeNavigator';
import AssessmentsNavigator from './AssessmentsNavigator';

const Tab = createBottomTabNavigator();

function TabsTeacher() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeNavigator} options={{
        headerShown: false,
        tabBarLabel: "Home",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="AssessmentsScreen" component={AssessmentsNavigator} options={{
        headerShown: false,
        tabBarLabel: "Avaliação",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bar-chart-outline" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="WorkoutsScreen" component={WorkoutsNavigator} options={{
        headerShown: false,
        tabBarLabel: "Treinos",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="fitness" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="ExercisesScreen" component={ExercisesNavigator} options={{
        headerShown: false,
        tabBarLabel: "Exercícios",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="barbell" size={size} color={color} />
        ),
      }} />

    </Tab.Navigator>
  );
}

export default TabsTeacher;
