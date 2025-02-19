import React from "react";
import { View } from "react-native";
import { TextInput, Switch, HelperText, Button, Menu, Text, RadioButton, Checkbox } from "react-native-paper";
import { Controller } from "react-hook-form";

interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  type?: "text" | "switch" | "select" | "radio" | "checkbox";
  options?: { label: string; value: any }[];
}

export function FormField({ control, name, label, type = "text", options }: FormFieldProps) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: 10 }}>
          {type === "text" && (
            <TextInput
              label={label}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              error={!!error}
            />
          )}

          {type === "switch" && (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text>{label}</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}

          {type === "select" && options && (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setMenuVisible(true)}>
                  {options.find((opt) => opt.value === value)?.label || label}
                </Button>
              }
            >
              {options.map((opt) => (
                <Menu.Item
                  key={opt.value}
                  title={opt.label}
                  onPress={() => { onChange(opt.value); setMenuVisible(false); }}
                />
              ))}
            </Menu>
          )}

          {type === "radio" && options && (
            <View>
              <Text>{label}</Text>
              <RadioButton.Group onValueChange={onChange} value={value}>
                {options.map((opt) => (
                  <RadioButton.Item
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                  />
                ))}
              </RadioButton.Group>
            </View>
          )}

          {type === "checkbox" && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox status={value ? "checked" : "unchecked"} onPress={() => onChange(!value)} />
              <Text onPress={() => onChange(!value)}>{label}</Text>
            </View>
          )}

          {error && <HelperText type="error">{error.message}</HelperText>}
        </View>
      )}
    />
  );
}