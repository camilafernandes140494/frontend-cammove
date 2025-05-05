import AuthNavigator from './AuthNavigator';
import { useUser } from '@/context/UserContext';
import TabsTeacher from './TabsTeacher';
import TabsStudent from './TabsStudent';

function RootNavigator() {
    const { user } = useUser();

    return (
        <>
            {user?.onboarding_completed ? user?.permission === 'TEACHER' ? <TabsTeacher /> : <TabsStudent /> : <AuthNavigator />}
        </>
    );
}

export default RootNavigator;
