import React, { useState } from 'react';
import { FlatList } from 'react-native';
import {
  Text, Appbar
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStudent } from '../context/StudentContext';
import { useUser } from '../UserContext';
import StudentCard from '@/components/StudentCard';
import { useTheme } from '../ThemeContext';

const StudentProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();
  const { refetchStudent } = useStudent();
  const [params, setParams] = useState('');
  const { studentProfileId } = route.params as { studentProfileId: string | undefined };
  const [newStudent, setNewStudent] = useState(!studentProfileId);
  const { theme } = useTheme();

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      ListHeaderComponent={
        <>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate('Home' as never)} />
            <Appbar.Content title="Perfil do aluno" />
          </Appbar.Header>
          {!newStudent && <StudentCard>
            {studentProfileId && <Text variant="bodySmall" style={{ marginLeft: 16, color: theme.colors.outline }}>ID: {studentProfileId}</Text>}
          </StudentCard>}
        </>
      }
      data={[{}]}
      keyExtractor={() => 'header'}
      renderItem={() =>
        <>

        </>

      }
    />
  );
};

export default StudentProfile;
