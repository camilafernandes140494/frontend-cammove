import AuthNavigator from './AuthNavigator';
import { useUser } from '../UserContext';
import TabsTeacher from './TabsTeacher';

function RootNavigator() {
    const { user } = useUser();

    return (
        <>
            {user?.token ? <TabsTeacher /> : <AuthNavigator />}
        </>
    );
}

export default RootNavigator;
