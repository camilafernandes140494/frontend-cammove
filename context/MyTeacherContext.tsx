import { getMyTeacher } from "@/api/relationships/relationships.api";
import type { Relationship } from "@/api/relationships/relationships.types";
import { getUserById } from "@/api/users/users.api";
import type { Users } from "@/api/users/users.types";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, type ReactNode, useContext } from "react";
import { useUser } from "./UserContext";

type MyTeacherContextType = {
	teacher: Relationship | undefined;
	teacherData?: Users;
};

const MyTeacherContext = createContext<MyTeacherContextType | undefined>(
	undefined,
);

export const MyTeacherProvider = ({ children }: { children: ReactNode }) => {
	const { user } = useUser();

	const { data: teacher } = useQuery({
		queryKey: ["getMyTeacher", user?.id],
		queryFn: () => getMyTeacher(user?.id || ""),
		enabled: !!user?.id,
	});

	const { data: teacherData } = useQuery({
		queryKey: ["getMyTeacherIdDevice", teacher?.teacherId],
		queryFn: () => getUserById(teacher?.teacherId || ""),
		enabled: !!teacher?.teacherId,
	});

	return (
		<MyTeacherContext.Provider value={{ teacher, teacherData }}>
			{children}
		</MyTeacherContext.Provider>
	);
};

export const useMyTeacher = () => {
	const context = useContext(MyTeacherContext);
	if (!context) {
		throw new Error("useMyTeacher must be used within a MyTeacherProvider");
	}
	return context;
};
