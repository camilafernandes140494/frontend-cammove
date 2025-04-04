import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Switch, HelperText, Button, Menu, Text, RadioButton, Checkbox, TextInputProps, Chip } from "react-native-paper";
import { Controller } from "react-hook-form";
import { useTheme } from "@/app/ThemeContext";
import { maskDateInput } from "@/common/common";

interface FormFieldProps extends Omit<TextInputProps, "onChange" | "value"> {
  control: any;
  name: string;
  label: string;
  type?: "text" | "switch" | "select" | "radio" | "checkbox" | 'chip' | 'birthDate';
  options?: any[];
  getLabel?: (option: any) => string;
}

export function FormField({ control, name, label, type = "text", options, getLabel, ...textInputProps }: FormFieldProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { theme } = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: 10 }}>
          {(type === "text" || type === "birthDate") && (
            <TextInput
              label={label}
              value={value}
              onChangeText={(text) => {
                const newValue = type === "birthDate" ? maskDateInput(text) : text;
                onChange(newValue);
              }}
              mode="outlined"
              error={!!error}
              {...textInputProps}
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
              style={{ width: '90%' }}
              anchor={
                <Button
                  mode="outlined"
                  style={{ borderWidth: error ? 2 : 1, borderColor: error ? theme.colors.error : undefined }}
                  textColor={error ? theme.colors.error : undefined}
                  onPress={() => setMenuVisible(true)}>
                  {value ? getLabel?.(value) || label : label}
                </Button>
              }
            >
              {options.map((opt) => (
                <Menu.Item
                  key={JSON.stringify(opt)}
                  title={getLabel ? getLabel(opt) : JSON.stringify(opt)}
                  onPress={() => {
                    onChange(opt);
                    setMenuVisible(false);
                  }}
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
                    key={JSON.stringify(opt)}
                    label={getLabel ? getLabel(opt) : JSON.stringify(opt)}
                    value={opt}
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


          {type === "chip" && options && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
              {options.map((option, index) => (
                <Chip
                  key={index}
                  selected={value === option.value}
                  onPress={() => onChange(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </View>
          )}

          {error && <HelperText type="error">{error.message}</HelperText>}
        </View>
      )}
    />
  );
}
