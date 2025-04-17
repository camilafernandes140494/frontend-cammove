import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ExercisesNavigator from './ExercisesNavigator';
import WorkoutsNavigator from './WorkoutsNavigator';
import HomeNavigator from './HomeNavigator';
import AssessmentsNavigator from './AssessmentsNavigator';
import { useTheme } from '../ThemeContext';
import ScheduleNavigator from './ScheduleNavigator';

const Tab = createBottomTabNavigator();

function TabsTeacher() {
  const { isDarkMode, theme } = useTheme();

  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', // Fundo da tab bar
        borderTopColor: isDarkMode ? '#333' : '#ddd', // Cor da borda superior
      },
      tabBarActiveTintColor: isDarkMode ? theme.colors.onPrimaryContainer : '#6200EE', // Cor do ícone ativo
      tabBarInactiveTintColor: isDarkMode ? '#AAAAAA' : '#666666', // Cor do ícone inativo
    }}>
      <Tab.Screen name="HomeScreen" component={HomeNavigator} options={{
        headerShown: false,
        tabBarLabel: "Início",
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
      <Tab.Screen name="ScheduleScreen" component={ScheduleNavigator} options={{
        headerShown: false,
        tabBarLabel: "Agenda",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="calendar-outline" size={size} color={color} />
        ),
      }} />

    </Tab.Navigator>
  );
}

export default TabsTeacher;
