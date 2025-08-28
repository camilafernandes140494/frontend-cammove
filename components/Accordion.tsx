import type * as React from "react";
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
}: AccordionProps<T>) => {
	return (
		<List.Accordion
			title={title}
			description={description}
			left={(props) => <List.Icon {...props} icon={icon} />}
		>
			<List.Item title={() => children} />
		</List.Accordion>
	);
};
