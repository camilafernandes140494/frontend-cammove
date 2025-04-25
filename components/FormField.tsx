import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Switch, HelperText, Button, Menu, Text, RadioButton, Checkbox, TextInputProps, Chip, ButtonProps } from "react-native-paper";
import { Controller } from "react-hook-form";
import { useTheme } from "@/app/ThemeContext";
import { maskDateInput, maskTimeInput } from "@/common/common";
import { Calendar } from "react-native-calendars";

interface FormFieldProps extends Omit<TextInputProps, "onChange" | "value"> {
  control: any;
  name: string;
  label?: string;
  type?: "text" | "switch" | "select" | "radio" | "checkbox" | 'chip' | "chip-multi" | 'birthDate' | 'number' | 'calendar' | 'time' | 'custom';
  options?: any[];
  getLabel?: (option: any) => string;
  buttonProps?: Partial<ButtonProps>;
  customRender?: (field: {
    value: any;
    onChange: (val: any) => void;
    onBlur: () => void;
  }, fieldState: { error?: any }) => React.ReactNode;
}

export function FormField({ control, name, label, type = "text", options, getLabel, buttonProps, customRender, ...textInputProps }: FormFieldProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { theme } = useTheme();
  const today = new Date().toISOString().split('T')[0];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <View style={{ marginBottom: 10 }}>
          {(type === "text" || type === "birthDate" || type === 'number' || type === 'time') && (
            <TextInput
              label={label}
              value={value?.toString() || ''}
              onChangeText={(text) => {
                let newValue;

                if (type === "birthDate") {
                  newValue = maskDateInput(text);
                }
                else if (type === "time") {
                  newValue = maskTimeInput(text);
                }
                else if (type === "number") {
                  newValue = Number(text);
                } else {
                  newValue = text;
                }

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
                  {...buttonProps}
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

          {type === "calendar" && (
            <>
              <Text style={{ margin: 10, color: theme.colors.primary, }}>{label}</Text>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 10,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >

                <Calendar
                  markedDates={
                    (value || []).reduce((acc: any, date: string) => {
                      acc[date] = { selected: true, selectedColor: theme.colors.primary };
                      return acc;
                    }, {})
                  }
                  onDayPress={(day: any) => {
                    const selectedDate = day.dateString;
                    let updatedDates = [...(value || [])];

                    if (updatedDates.includes(selectedDate)) {
                      updatedDates = updatedDates.filter((d) => d !== selectedDate); // desmarca
                    } else {
                      updatedDates.push(selectedDate); // marca
                    }

                    onChange(updatedDates);
                  }}
                  monthFormat={'MMMM yyyy'}
                  minDate={today}
                />
              </View>
            </>

          )}

          {type === "chip-multi" && options && (<>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
              {options.map((option, index) => {
                const isSelected = Array.isArray(value) && value.includes(option.value);
                return (
                  <Chip
                    key={index}
                    selected={isSelected}
                    onPress={() => {
                      let updatedValue = Array.isArray(value) ? [...value] : [];
                      if (isSelected) {
                        updatedValue = updatedValue.filter((val) => val !== option.value);
                      } else {
                        updatedValue.push(option.value);
                      }
                      onChange(updatedValue);
                    }}
                  >
                    {option.label}
                  </Chip>
                );
              })}
            </View>
          </>
          )}

          {type === "custom" && customRender && (
            <>
              {customRender({ value, onChange, onBlur }, { error })}
            </>
          )}

          {error && <HelperText type="error">{error.message}</HelperText>}
        </View>
      )}
    />
  );
}
