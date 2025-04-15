
import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text, TextProps } from 'react-native-paper';


interface InfoFieldProps extends ViewProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  propsTitle?: Partial<TextProps<any>>;
  propsDescription?: Partial<TextProps<any>>;

}

const InfoField = ({ title, description, children, propsTitle, propsDescription, ...props }: InfoFieldProps) => {


  return (
    <View style={{ display: 'flex', gap: 10 }} {...props}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
        {children}
        <Text variant='bodySmall' style={{ textTransform: 'uppercase' }}  {...propsTitle}>{title}</Text>
      </View>
      <Text variant='bodyLarge' style={{ fontWeight: 600 }} {...propsDescription}>{description}</Text>
    </View>

  );
};

export default InfoField;