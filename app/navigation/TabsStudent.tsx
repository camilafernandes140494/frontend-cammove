import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import HomeStudentNavigator from './HomeStudentNavigator';
import AssessmentsStudentNavigator from './AssessmentsStudentNavigator';
import WorkoutsNavigatorStudent from './WorkoutsNavigatorStudent';
import { MyTeacherProvider } from '../../context/MyTeacherContext';
import SchedulesNavigatorStudent from './ScheduleNavigatorStudent';

const Tab = createBottomTabNavigator();

function TabsStudent() {
  const { isDarkMode, theme } = useTheme();

  return (
    <MyTeacherProvider >
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
        <Tab.Screen name="ScheduleScreen" component={SchedulesNavigatorStudent} options={{
          headerShown: false,
          tabBarLabel: "Agenda",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }} />

      </Tab.Navigator>
    </MyTeacherProvider>
  );
}

export default TabsStudent;
