// import { useAuth } from './hooks/useAuth'; // Exemplo de hook para autenticação
import HomeNavigator from './HomeNavigator';
import AuthNavigator from './AuthNavigator';
import { useUser } from '../UserContext';

function RootNavigator() {
    const { user } = useUser(); // Verifica se o usuário está autenticado

    return (
        <>
            {user.id ? <HomeNavigator /> : <AuthNavigator />}
        </>
    );
}

export default RootNavigator;
