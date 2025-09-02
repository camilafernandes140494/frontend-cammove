import { useTheme } from "@/context/ThemeContext";
import type * as React from "react";
import { useState } from "react";
import { View } from "react-native";
import { List } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";

type AccordionProps<T> = {
	title: string;
	description?: string;
	children?: React.ReactNode;
	defaultExpanded?: boolean;
	icon?: IconSource;
};

export const Accordion = <T,>({
	title,
	description,
	children,
	icon = "folder",
	defaultExpanded = false,
}: AccordionProps<T>) => {
	const [expanded, setExpanded] = useState(defaultExpanded);
	const { theme } = useTheme();

	return (
		<View
			style={{
				borderWidth: 1,
				borderColor: expanded ? theme.colors.primary : "#ccc",
				borderRadius: 8,
				marginVertical: 12,
				overflow: "hidden",
			}}
		>
			<List.Accordion
				expanded={expanded}
				onPress={() => setExpanded(!expanded)}
				title={title}
				description={description}
				left={(props) => <List.Icon {...props} icon={icon} />}
			>
				<View
					style={{
						paddingRight: 40,
						paddingVertical: 24,
					}}
				>
					{children}
				</View>
			</List.Accordion>
		</View>
	);
};
