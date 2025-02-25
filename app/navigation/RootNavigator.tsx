import AuthNavigator from './AuthNavigator';
import { useUser } from '../UserContext';
import TabsTeacher from './TabsTeacher';

function RootNavigator() {
    const { user } = useUser(); // Verifica se o usuário está autenticado

    return (
        <>
            {user.token ? <TabsTeacher /> : <AuthNavigator />}
        </>
    );
}

export default RootNavigator;
