import { getUserById } from "@/api/users/users.api";
import type { Users } from "@/api/users/users.types";
import { useQuery } from "@tanstack/react-query";
import React, {
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";

type StudentContextType = {
	student: Users | undefined;
	isLoading: boolean;
	refetchStudent: (id: string) => void;
	resetStudent: () => void;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({
	children,
	studentCode: initialStudentCode,
}: {
	children: ReactNode;
	studentCode: string;
}) => {
	const [studentCode, setStudentCode] = useState(initialStudentCode);

	const {
		data: student,
		isLoading: isLoadingStudent,
		isFetching: isFetchingStudent,
	} = useQuery({
		queryKey: ["student", studentCode],
		queryFn: () => getUserById(studentCode),
		enabled: !!studentCode,
	});

	const refetchStudent = (newStudentCode: string) => {
		setStudentCode(newStudentCode);
	};

	const resetStudent = () => {
		setStudentCode(initialStudentCode);
	};

	const isLoading = isLoadingStudent || isFetchingStudent;

	return (
		<StudentContext.Provider
			value={{ student, refetchStudent, isLoading, resetStudent }}
		>
			{children}
		</StudentContext.Provider>
	);
};

export const useStudent = () => {
	const context = useContext(StudentContext);
	if (!context) {
		throw new Error("useStudent must be used within a StudentProvider");
	}
	return context;
};
