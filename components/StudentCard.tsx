import { useStudent } from "@/context/StudentContext";
import { useTheme } from "@/context/ThemeContext";
import { calculateAge, getGender, getInitials } from "@/common/common";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";

interface StudentCardProps {
  children?: ReactNode;
}

const StudentCard = ({ children }: StudentCardProps) => {
  const { theme } = useTheme();
  const { student } = useStudent();

  const LeftContent = (props: any) =>
    student?.image ? (
      <Avatar.Image
        {...props}
        size={60}
        source={{ uri: student.image }}
        style={{ backgroundColor: 'transparent', marginRight: 30 }}
      />
    ) : (
      <Avatar.Text
        {...props}
        size={60}
        label={getInitials(student?.name || '')}
        style={{ marginRight: 16 }}
      />
    );
  return <View style={{ backgroundColor: theme.colors.secondaryContainer, paddingVertical: 16 }}>
    <View style={{ display: "flex", flexDirection: 'row', gap: 16, alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 }}>
      {student?.image
        ? <Avatar.Image size={60} source={{ uri: student.image }} />
        : <Avatar.Text label={getInitials(student?.name || '')} />}

      <View style={{ gap: 10 }} >
        <Text style={{ fontSize: 16, }}>
          {`${student?.name}`}
        </Text>
        <Text style={{ fontSize: 14, }}>
          {`Gênero: ${getGender(student?.gender || '')} | ${calculateAge(student?.birthDate || '')} anos`}
        </Text>
      </View>
    </View>
    {children}
  </View>;
};



export default StudentCard;
