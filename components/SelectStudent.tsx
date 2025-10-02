import { getRelationship } from "@/api/relationships/relationships.api";
import type { Student } from "@/api/relationships/relationships.types";
import type { STATUS } from "@/api/users/users.types";
import { getInitials } from "@/common/common";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Avatar, Card, Chip } from "react-native-paper";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

interface UserListProps {
	teacherId: string;
	onSelect: (student: Student) => void;
	filterName?: string;
	studentStatus?: STATUS;
	showStatus?: boolean;
}

const SelectStudent = ({
	teacherId,
	filterName,
	onSelect,
	studentStatus = "ACTIVE",
	showStatus = false,
}: UserListProps) => {
	const { theme, isDarkMode } = useTheme();
	const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
	const [studentsFilter, setStudentsFilter] = useState<Student[]>();

	const {
		data: students,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["getRelationship", teacherId, studentStatus],
		queryFn: () => getRelationship(teacherId, { status: studentStatus }),
		enabled: !!teacherId,
	});

	useEffect(() => {
		if (!students) return;
		let filteredData = students.students;
		if (filterName) {
			filteredData = filteredData.filter((student) =>
				student.studentName.toLowerCase().includes(filterName.toLowerCase()),
			);
		}

		setStudentsFilter(filteredData);
	}, [filterName, students]);

	return (
		<FlatList
			data={studentsFilter}
			ListFooterComponent={
				isLoading ? (
					<ActivityIndicator
						animating={true}
						style={{ marginTop: 16 }}
						size="large"
					/>
				) : null
			}
			renderItem={({ item }) => (
				<TouchableOpacity
					onPress={() => {
						onSelect(item);
						setSelectedStudent(item.studentId);
					}}
				>
					<Card
						mode="outlined"
						style={{
							marginVertical: 10,
							backgroundColor:
								selectedStudent === item.studentId
									? theme.colors.primaryContainer
									: isDarkMode
										? theme.colors.background
										: "white",
							borderRadius: 16,
							borderColor:
								selectedStudent === item.studentId
									? theme.colors.primary
									: undefined,
						}}
					>
						<Card.Title
							title={item.studentName}
							left={(props) => (
								<Avatar.Text {...props} label={getInitials(item.studentName)} />
							)}
						/>
						{showStatus && (
							<Card.Content>
								<Chip
									mode="flat"
									compact
									disabled
									icon={() => (
										<Ionicons
											name={
												item.studentStatus === "ACTIVE"
													? "checkmark"
													: "alert-circle-outline"
											}
											size={18}
											color={
												item.studentStatus === "ACTIVE" ? "#2E7D32" : "#C62828"
											}
											style={{ marginRight: 4 }}
										/>
									)}
									style={{
										backgroundColor:
											item.studentStatus === "ACTIVE" ? "#C8E6C9" : "#FFCDD2",
										alignSelf: "flex-start",
									}}
									textStyle={{
										color:
											item.studentStatus === "ACTIVE" ? "#2E7D32" : "#C62828",
									}}
								>
									{item.studentStatus === "ACTIVE" ? "Ativo" : "Inativo"}
								</Chip>
							</Card.Content>
						)}
					</Card>
				</TouchableOpacity>
			)}
			contentContainerStyle={{ paddingBottom: 100 }}
			refreshing={isLoading || isFetching}
			keyExtractor={(item) => `${item.studentId}`}
			ListEmptyComponent={
				isLoading || isFetching ? (
					<View>
						{Array.from({ length: 5 }).map((_, index) => (
							<Skeleton
								key={index}
								style={{
									width: "90%",
									height: 100,
									borderRadius: 4,
									marginVertical: 8,
									alignSelf: "center",
								}}
							/>
						))}
					</View>
				) : (
					<EmptyState onRetry={() => refetch()} />
				)
			}
		/>
	);
};

export default SelectStudent;
