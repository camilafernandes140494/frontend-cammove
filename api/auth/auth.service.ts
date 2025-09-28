// authService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

let token: string | null = null;

export const authService = {
	getToken: () => token,

	setToken: async (newToken: string) => {
		token = newToken;
		await AsyncStorage.setItem("@user_token", newToken);
	},

	clearToken: async () => {
		token = null;
		await AsyncStorage.removeItem("@user_token");
	},

	loadToken: async () => {
		const storedToken = await AsyncStorage.getItem("@user_token");
		if (storedToken) {
			token = storedToken;
			return token;
		}
		return null;
	},
};
