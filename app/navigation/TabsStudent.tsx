import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ExercisesNavigator from './ExercisesNavigator';
import { useTheme } from '../ThemeContext';
import HomeStudentNavigator from './HomeStudentNavigator';
import AssessmentsStudentNavigator from './AssessmentsStudentNavigator';
import WorkoutsNavigatorStudent from './WorkoutsNavigatorStudent';

const Tab = createBottomTabNavigator();

function TabsStudent() {
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
      <Tab.Screen name="HomeScreen" component={HomeStudentNavigator} options={{
        headerShown: false,
        tabBarLabel: "Início",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="AssessmentsScreen" component={AssessmentsStudentNavigator} options={{
        headerShown: false,
        tabBarLabel: "Avaliação",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bar-chart-outline" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="WorkoutsScreen" component={WorkoutsNavigatorStudent} options={{
        headerShown: false,
        tabBarLabel: "Treinos",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="fitness" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="ExercisesScreen" component={ExercisesNavigator} options={{
        headerShown: false,
        tabBarLabel: "Agendamentos",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="calendar-outline" size={size} color={color} />
        ),
      }} />

    </Tab.Navigator>
  );
}

export default TabsStudent;
