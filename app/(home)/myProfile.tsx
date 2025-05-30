import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Text, Avatar,
  Surface,
  Divider,
  Appbar
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { getInitials } from '@/common/common';
import { patchUser } from '@/api/users/users.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Skeleton from '@/components/Skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as z from "zod";
import { PostUser } from '@/api/users/users.types';
import UserForm from '@/components/UserForm';
import InfoField from '@/components/InfoField';

const MyProfile = () => {
  const { user, setUser } = useUser();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const modalSchema = z.object({
    name: z.string().min(1, "Obrigatório"),
    image: z.string().optional()
  });

  const { control, handleSubmit, setValue, } = useForm<z.infer<typeof modalSchema>>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
      name: user?.name || '',
      // image: user?.image || '',
    },
  });

  const mutation = useMutation({

    mutationFn: async (data: Partial<PostUser>) => {
      return await patchUser(user?.id! || '', data);

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getRelationship'] });
    },
  });


  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalhes do usuário(a)" />
      </Appbar.Header>
      <FlatList
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        data={[{}]}
        keyExtractor={() => 'header'}
        renderItem={() =>
          <>
            {mutation.isPending ? <StudentProfileLoading /> : <>
              <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: theme.colors.primaryContainer,
                    padding: 20,
                    paddingBottom: 100,
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -45,
                      zIndex: 1,
                    }}
                  >
                    {user?.image ? <Avatar.Image size={100} source={{ uri: user.image }} /> : <Avatar.Text size={100} label={getInitials(user?.name || '')} />}
                  </View>
                </View>

                <Text
                  variant="headlineMedium"
                  style={{ marginTop: 40 }}
                >
                  {user?.name}
                </Text>
              </View>
              <UserForm onSubmit={() => { }} userData={user} >{
                <InfoField title='E-mail' description={user?.email || ''} style={{ marginVertical: 16 }} />
              }
              </UserForm>

            </>}

          </>


        }
      />
    </>

  );
};

export default MyProfile;

const StudentProfileLoading = () => {
  const { theme } = useTheme();

  return (
    <>
      <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Container superior com fundo */}
        <View
          style={{
            width: '100%',
            backgroundColor: theme.colors.primaryContainer,
            padding: 20,
            paddingBottom: 100,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Skeleton do Avatar */}
          <View
            style={{
              position: 'absolute',
              bottom: -45,
              zIndex: 1,
            }}
          >
            <Skeleton style={{ width: 80, height: 80, borderRadius: 40 }} />
          </View>
        </View>

        {/* Skeleton do nome */}
        <Skeleton style={{ width: 180, height: 24, borderRadius: 6, marginTop: 40 }} />
      </View>

      {/* Container dos dados */}
      <Surface elevation={2} style={{ display: 'flex', gap: 16, margin: 16, padding: 16 }}>
        <Skeleton style={{ width: '100%', height: 20, borderRadius: 4 }} />
        <Divider />
        <Skeleton style={{ width: '100%', height: 20, borderRadius: 4 }} />
        <Divider />
        <Skeleton style={{ width: '100%', height: 20, borderRadius: 4 }} />
        <Divider />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Skeleton style={{ width: 40, height: 20, borderRadius: 10 }} />
          <Skeleton style={{ width: 80, height: 20, borderRadius: 4 }} />
        </View>
      </Surface>
    </>
  );
};
