import * as React from 'react';
import { List } from 'react-native-paper';

type AccordionProps<T> = {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
};

const Accordion = <T,>({
  title,
  children,
  defaultExpanded = false,
}: AccordionProps<T>) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <List.Section title="Accordions">
      <List.Accordion
        title="Uncontrolled Accordion"
        left={props => <List.Icon {...props} icon="folder" />}>
        <List.Item title="First item" />
        <List.Item title="Second item" />
      </List.Accordion>

      <List.Accordion
        title="Controlled Accordion"
        left={props => <List.Icon {...props} icon="folder" />}
        expanded={expanded}
        onPress={handlePress}>
        <List.Item title="First item" />
        <List.Item title="Second item" />
      </List.Accordion>
    </List.Section>
  );
};



