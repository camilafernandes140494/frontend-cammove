
import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from 'react-native-paper';


interface InfoFieldProps extends ViewProps {
  title: string;
  description: string;
  children?: React.ReactNode;

}

const InfoField = ({ title, description, children, ...props }: InfoFieldProps) => {


  return (
    <View style={{ display: 'flex', gap: 10 }} {...props}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
        {children}

        <Text variant='bodySmall' style={{ textTransform: 'uppercase' }}>{title}</Text>
      </View>
      <Text variant='bodyLarge' style={{ fontWeight: 600 }}>{description}</Text>
    </View>

  );
};

export default InfoField;