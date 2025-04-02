import React, { useState } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  Button,
  HelperText,
  Text,
  Snackbar,
} from 'react-native-paper';
import { postCreateUser } from '@/api/auth/auth.api';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';


export type RootOnboardingStackParamList = {
  createUser: undefined;
  Onboarding: { email?: string };
};

const CreateUser = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootOnboardingStackParamList>>();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Por favor, insira um email válido')
      .required('O email é obrigatório'),
    password: Yup.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('A senha é obrigatória'),
  });




  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoadingButton(true)
    try {
      const userCredential = await postCreateUser(values);
      setUser({ id: userCredential.uid });
      navigation.navigate('Onboarding', { email: values.email });

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    } finally {
      setIsLoadingButton(false)
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.primary,
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
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <TextInput
                mode="flat"
                label="E-mail"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={{
                  backgroundColor: theme.background,
                }}
                error={touched.email && Boolean(errors.email)}
              />
              {touched.email && errors.email && (
                <HelperText type="error">{errors.email}</HelperText>
              )}
              <TextInput
                mode="flat"
                label="Senha"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={{
                  backgroundColor: theme.background,
                }}
                error={touched.password && Boolean(errors.password)}
              />
              {touched.password && errors.password && (
                <HelperText type="error">{errors.password}</HelperText>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit as any}
                loading={isLoadingButton}
                disabled={isLoadingButton}
                style={{
                  borderRadius: 10,
                  marginVertical: 20,
                }}
                contentStyle={{ height: 50 }}
              >
                Cadastre-se
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default CreateUser;
