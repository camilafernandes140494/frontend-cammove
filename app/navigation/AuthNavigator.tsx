import type { UserType } from "@/context/UserContext";
import { createStackNavigator } from "@react-navigation/stack";
import CreateUser from "../(auth)/createUser";
import Login from "../(auth)/login";
import ResetPassword from "../(auth)/resetPassword";
import Home from "../(home)/home";
import Onboarding from "../(onboarding)/onboarding";

const Stack = createStackNavigator();

interface AuthNavigatorProps {
	user?: Partial<UserType> | null;
}
function AuthNavigator(user: AuthNavigatorProps) {
	return (
		<Stack.Navigator
			initialRouteName={
				user?.user?.id &&
				(!user?.user?.permission || user?.user?.permission === null) &&
				!user?.user?.onboarding_completed
					? "Onboarding"
					: "Login"
			}
		>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="CreateUser"
				component={CreateUser}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Onboarding"
				component={Onboarding}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Home"
				component={Home}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ResetPassword"
				component={ResetPassword}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

export default AuthNavigator;
