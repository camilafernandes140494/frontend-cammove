import { calculateAge, getGender, getInitials } from "@/common/common";
import { useStudent } from "@/context/StudentContext";
import { useTheme } from "@/context/ThemeContext";
import React, { type ReactNode } from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import Skeleton from "./Skeleton";

interface StudentCardProps {
	children?: ReactNode;
}

const StudentCard = ({ children }: StudentCardProps) => {
	const { theme } = useTheme();
	const { student, isLoading } = useStudent();

	return (
		<View
			style={{
				backgroundColor: theme.colors.secondaryContainer,
				paddingVertical: 16,
			}}
		>
			{isLoading ? (
				<SkeletonStudentCard />
			) : (
				<>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							gap: 16,
							alignItems: "center",
							paddingHorizontal: 16,
							marginBottom: 10,
						}}
					>
						{student?.image ? (
							<Avatar.Image size={60} source={{ uri: student.image }} />
						) : (
							<Avatar.Text label={getInitials(student?.name || "")} />
						)}

						<View style={{ gap: 10 }}>
							<Text style={{ fontSize: 16 }}>{`${student?.name}`}</Text>
							<Text style={{ fontSize: 14 }}>
								{`Gênero: ${getGender(student?.gender || "")} | ${calculateAge(student?.birthDate || "")} anos`}
							</Text>
						</View>
					</View>
					{children}
				</>
			)}
		</View>
	);
};

const SkeletonStudentCard = () => (
	<View
		style={{
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			marginBottom: 10,
			gap: 24,
		}}
	>
		<Skeleton style={{ borderRadius: "50%", height: 48, width: 48 }} />
		<View style={{ gap: 10 }}>
			<Skeleton style={{ marginTop: 12, height: 24, width: 250 }} />
			<Skeleton style={{ marginTop: 1, height: 24, width: 200 }} />
		</View>
	</View>
);

export default StudentCard;
