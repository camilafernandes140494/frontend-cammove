import React, { useState } from 'react';
import { View } from 'react-native';
import {
  TextInput,
  Button, Text,
  Snackbar
} from 'react-native-paper';
import { postCreateUser } from '@/api/auth/auth.api';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FormField } from '@/components/FormField';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { PostCreateUser } from '@/api/auth/auth.types';
import { postUser } from '@/api/users/users.api';

export type RootOnboardingStackParamList = {
  createUser: undefined;
  Onboarding: { email?: string };
};

const CreateUser = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootOnboardingStackParamList>>();
  const { user, setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);

  const schema = z.object({
    email: z.string().email('Por favor, insira um email válido').nonempty('O email é obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').nonempty('A senha é obrigatória'),

  });


  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    },
  });


  const mutation = useMutation({
    mutationFn: async (values: PostCreateUser) => {
      const createResult = await postCreateUser(values);
      return { createResult };

    },
    onSuccess: async ({ createResult }, variables) => {
      setUser({ id: createResult.uid, email: variables.email });
      await postUser(createResult.uid!, {
        name: '',
        gender: null,
        birthDate: '',
        permission: null,
        image: '',
        status: 'ACTIVE',
        phone: '',
        email: variables.email
      });
      navigation.navigate('Onboarding', { email: variables.email });
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
      setVisible(true);
    }
  });


  const onSubmit = async (data: any) => {
    mutation.mutate(data);
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary, }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 20,
        }}
      >
        <Text
          variant="displayMedium"
          style={{ color: theme.colors.background }}
        >
          CAMMOVE
        </Text>
        <Text variant="titleMedium" style={{ color: theme.colors.background }}>
          Cadastre-se
        </Text>
      </View>

      <View
        style={{
          flex: 2,
          marginTop: -50,
          backgroundColor: theme.colors.background,
          borderTopEndRadius: 40,
          borderTopStartRadius: 40,
          padding: 20,
          paddingTop: 50,
        }}
      >
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          action={{
            label: '',
            icon: 'close',
            onPress: () => setVisible(false),
          }}
        >
          <Text>Erro ao cadastrar</Text>
        </Snackbar>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <FormField control={control} mode="flat" name="email" label="E-mail" type="text" style={{
            backgroundColor: theme.background,
          }} />
          <FormField control={control} mode="flat" name="password" label="Senha" type="text"
            secureTextEntry={!showPassword}
            style={{
              backgroundColor: theme.background,
            }}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            } />
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={mutation.isPending}
            disabled={mutation.isPending}
            style={{
              borderRadius: 10,
              marginVertical: 20,
            }}
            contentStyle={{ height: 50 }}
          >
            Cadastre-se
          </Button>
        </View>

      </View>
    </View>
  );
};

export default CreateUser;
