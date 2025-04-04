import AuthNavigator from './AuthNavigator';
import { useUser } from '../UserContext';
import TabsTeacher from './TabsTeacher';
import TabsStudent from './TabsStudent';

function RootNavigator() {
    const { user } = useUser();

    return (
        <>
            {user?.token ? user?.permission === 'TEACHER' ? <TabsTeacher /> : <TabsStudent /> : <AuthNavigator />}
        </>
    );
}

export default RootNavigator;
