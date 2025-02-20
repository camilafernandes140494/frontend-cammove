import { useStudent } from "@/app/context/StudentContext";
import { useTheme } from "@/app/ThemeContext";
import { calculateAge, getGender, getInitials } from "@/common/common";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { Avatar, Card } from "react-native-paper";

interface StudentCardProps {
  children?: ReactNode;
}

const StudentCard = ({ children }: StudentCardProps) => {
  const { theme } = useTheme();
  const { student } = useStudent();


  return <View style={{ backgroundColor: theme.colors.secondaryContainer, paddingVertical: 16 }}>
    <Card.Title
      title={`${student?.name}`}
      subtitle={`Gênero: ${getGender(student?.gender || '')} | ${calculateAge(student?.birthDate || '')} anos`}
      left={(props) => <Avatar.Text {...props} label={getInitials(student?.name || '')} />}
    />
    {children}
  </View>;
};



export default StudentCard;
