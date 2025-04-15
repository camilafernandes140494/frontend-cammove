import React from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useUser } from '../UserContext';

import { useTheme } from '../ThemeContext';
import SelectStudent from '@/components/SelectStudent';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStudent } from '../context/StudentContext';

export type RootHomeStackParamList = {
  home: undefined;
  UserList: undefined;
  StudentProfile: { studentProfileId?: string };
  RegisterUserByTeacher: undefined
};

const UserList = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootHomeStackParamList>>();
  const { refetchStudent } = useStudent();


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode='small'>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Alunos" />
      </Appbar.Header>

      <View style={{ padding: 20, height: "100%" }}>
        <SelectStudent
          teacherId={user?.id!}
          studentStatus={null}
          showStatus={true}
          onSelect={(student) => { refetchStudent(student.studentId), navigation.navigate('StudentProfile', { studentProfileId: student.studentId }) }}
        />
      </View>
    </View>

  );
};

export default UserList;
