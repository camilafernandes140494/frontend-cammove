import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { useFormikContext } from 'formik';
import { useTheme } from '@/app/ThemeContext';

interface FormikTextInputProps extends TextInputProps {
    name: string;
}
const FormikTextInput = ({ name, ...props }: FormikTextInputProps) => {
    const { values, handleChange, handleBlur, touched, errors } = useFormikContext<any>();

    // Pegando a mensagem de erro corretamente
    const errorMessage = touched[name] && errors[name];
    const { theme } = useTheme();
    return (
        <View style={{ marginBottom: 10 }}>
            <TextInput
                {...props}
                style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    paddingHorizontal: 15,
                    marginBottom: 5,
                    borderWidth: 1,
                    borderColor: errorMessage ? theme.error : '#ddd',  // Erro no campo -> borda vermelha
                }}
                onChangeText={handleChange(name)}
                onBlur={handleBlur(name)}
                value={values[name]}
            />
            {errorMessage && typeof errorMessage === 'string' && (
                <Text style={{ color: theme.error, fontSize: 12 }}>{errorMessage}</Text>
            )}
        </View>
    );
};

export default FormikTextInput;
