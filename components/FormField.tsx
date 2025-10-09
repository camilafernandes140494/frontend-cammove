import { maskDateInput, maskTimeInput } from "@/common/common";
import { useTheme } from "@/context/ThemeContext";
import type React from "react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import {
	Button,
	type ButtonProps,
	Checkbox,
	Chip,
	Dialog,
	HelperText,
	List,
	Portal,
	Switch,
	Text,
	TextInput,
	type TextInputProps,
} from "react-native-paper";

interface FormFieldProps extends Omit<TextInputProps, "onChange" | "value"> {
	control: any;
	name: string;
	label?: string;
	type?:
		| "text"
		| "switch"
		| "select"
		| "multi-select"
		| "radio"
		| "checkbox"
		| "chip"
		| "chip-multi"
		| "birthDate"
		| "number"
		| "calendar"
		| "time"
		| "custom";
	options?: any[];
	getLabel?: (option: any) => string;
	buttonProps?: Partial<ButtonProps>;
	customRender?: (
		field: {
			value: any;
			onChange: (val: any) => void;
			onBlur: () => void;
		},
		fieldState: { error?: any },
	) => React.ReactNode;
}

export function FormField({
	control,
	name,
	label,
	type = "text",
	options,
	getLabel,
	buttonProps,
	customRender,
	...textInputProps
}: FormFieldProps) {
	const [menuVisible, setMenuVisible] = useState(false);
	const { theme } = useTheme();
	const today = new Date().toISOString().split("T")[0];

	const [selectedOptions, setSelectedOptions] = useState<any[]>([]); // ou tipa com seu tipo real

	const toggleOption = (option: any) => {
		setSelectedOptions((prev) => {
			const alreadySelected = prev.find(
				(item) => JSON.stringify(item) === JSON.stringify(option),
			);
			if (alreadySelected) {
				return prev.filter(
					(item) => JSON.stringify(item) !== JSON.stringify(option),
				);
			}
			return [...prev, option];
		});
	};

	return (
		<Controller
			control={control}
			name={name}
			render={({
				field: { onChange, value, onBlur },
				fieldState: { error },
			}) => (
				<View style={{ marginBottom: 10 }}>
					{(type === "text" ||
						type === "birthDate" ||
						type === "number" ||
						type === "time") && (
						<TextInput
							error={!!error}
							label={label}
							mode="outlined"
							onChangeText={(text) => {
								let newValue;

								if (type === "birthDate") {
									newValue = maskDateInput(text);
								} else if (type === "time") {
									newValue = maskTimeInput(text);
								} else if (type === "number") {
									newValue = Number(text);
								} else {
									newValue = text;
								}

								onChange(newValue);
							}}
							value={value?.toString() || ""}
							{...textInputProps}
						/>
					)}

					{type === "switch" && (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Text>{label}</Text>
							<Switch onValueChange={onChange} value={value} />
						</View>
					)}

					{type === "multi-select" && options && (
						<>
							<Button
								mode="outlined"
								theme={{
									colors: {
										outline: error ? theme.colors.error : theme.colors.primary,
									},
								}}
								{...buttonProps}
								onPress={() => setMenuVisible(true)}
								textColor={error ? theme.colors.error : undefined}
							>
								{selectedOptions.length > 0
									? selectedOptions
											.map((opt) => getLabel?.(opt) || JSON.stringify(opt))
											.join(", ")
									: label}
							</Button>

							<Portal>
								<Dialog
									onDismiss={() => setMenuVisible(false)}
									visible={menuVisible}
								>
									<Dialog.Title>{label}</Dialog.Title>
									<Dialog.ScrollArea>
										<ScrollView style={{ maxHeight: 400 }}>
											{options.map((opt) => {
												const isSelected = selectedOptions.find(
													(item) =>
														JSON.stringify(item) === JSON.stringify(opt),
												);

												return (
													<List.Item
														key={JSON.stringify(opt)}
														left={() =>
															isSelected ? (
																<List.Icon icon="check" />
															) : (
																<List.Icon icon="checkbox-blank-outline" />
															)
														}
														onPress={() => toggleOption(opt)}
														title={
															getLabel ? getLabel(opt) : JSON.stringify(opt)
														}
													/>
												);
											})}
										</ScrollView>
									</Dialog.ScrollArea>
									<Dialog.Actions>
										<Button onPress={() => setMenuVisible(false)}>
											Fechar
										</Button>
									</Dialog.Actions>
								</Dialog>
							</Portal>
						</>
					)}

					{type === "select" && options && (
						<>
							<Button
								mode="outlined"
								theme={{
									colors: {
										outline: error ? theme.colors.error : theme.colors.primary,
									},
								}}
								{...buttonProps}
								onPress={() => setMenuVisible(true)}
								textColor={error ? theme.colors.error : undefined}
							>
								{value ? getLabel?.(value) || label : label}
							</Button>

							<Portal>
								<Dialog
									onDismiss={() => setMenuVisible(false)}
									visible={menuVisible}
								>
									<Dialog.Title>{label}</Dialog.Title>
									<Dialog.ScrollArea>
										<ScrollView style={{ maxHeight: 400 }}>
											{options.map((opt) => (
												<List.Item
													key={JSON.stringify(opt)}
													onPress={() => {
														onChange(opt);
														setMenuVisible(false);
													}}
													title={getLabel ? getLabel(opt) : JSON.stringify(opt)}
												/>
											))}
										</ScrollView>
									</Dialog.ScrollArea>
									<Dialog.Actions>
										<Button onPress={() => setMenuVisible(false)}>
											Fechar
										</Button>
									</Dialog.Actions>
								</Dialog>
							</Portal>
						</>
					)}
					{type === "radio" && options && (
						<View>
							{label && <Text>{label}</Text>}

							{options.map((opt, index) => {
								// Se opt for objeto, pegamos opt.value, senão usamos opt direto
								const optionValue = typeof opt === "object" ? opt.value : opt;
								const optionLabel = getLabel
									? getLabel(opt)
									: String(optionValue);
								const isSelected = value === optionValue;

								return (
									<List.Item
										key={index}
										title={optionLabel}
										onPress={() => onChange(optionValue)} // retorna só o value
										left={() => (
											<View
												style={{
													width: 24,
													height: 24,
													borderRadius: 12,
													borderWidth: 2,
													borderColor: isSelected
														? theme.colors.primary
														: theme.colors.outline,
													alignItems: "center",
													justifyContent: "center",
													marginRight: 8,
												}}
											>
												{isSelected && (
													<View
														style={{
															width: 12,
															height: 12,
															borderRadius: 6,
															backgroundColor: theme.colors.primary,
														}}
													/>
												)}
											</View>
										)}
									/>
								);
							})}
						</View>
					)}

					{type === "checkbox" && (
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Checkbox
								onPress={() => onChange(!value)}
								status={value ? "checked" : "unchecked"}
							/>
							<Text onPress={() => onChange(!value)}>{label}</Text>
						</View>
					)}

					{type === "chip" && options && (
						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								gap: 10,
								marginTop: 20,
							}}
						>
							{options.map((option, index) => (
								<Chip
									key={index}
									onPress={() => onChange(option.value)}
									selected={value === option.value}
								>
									{option.label}
								</Chip>
							))}
						</View>
					)}

					{type === "calendar" && (
						<>
							<Text style={{ margin: 10, color: theme.colors.primary }}>
								{label}
							</Text>
							<View
								style={{
									backgroundColor: "#fff",
									borderRadius: 12,
									padding: 10,
									elevation: 3,
									shadowColor: "#000",
									shadowOpacity: 0.1,
									shadowRadius: 4,
									shadowOffset: { width: 0, height: 2 },
								}}
							>
								<Calendar
									markedDates={(value || []).reduce(
										(acc: any, date: string) => {
											acc[date] = {
												selected: true,
												selectedColor: theme.colors.primary,
											};
											return acc;
										},
										{},
									)}
									minDate={today}
									monthFormat={"MMMM yyyy"}
									onDayPress={(day: any) => {
										const selectedDate = day.dateString;
										let updatedDates = [...(value || [])];

										if (updatedDates.includes(selectedDate)) {
											updatedDates = updatedDates.filter(
												(d) => d !== selectedDate,
											); // desmarca
										} else {
											updatedDates.push(selectedDate); // marca
										}

										onChange(updatedDates);
									}}
								/>
							</View>
						</>
					)}

					{type === "chip-multi" && options && (
						<>
							<View
								style={{
									flexDirection: "row",
									flexWrap: "wrap",
									gap: 10,
									marginTop: 20,
								}}
							>
								{options.map((option, index) => {
									const isSelected =
										Array.isArray(value) && value.includes(option.value);
									return (
										<Chip
											key={index}
											onPress={() => {
												let updatedValue = Array.isArray(value)
													? [...value]
													: [];
												if (isSelected) {
													updatedValue = updatedValue.filter(
														(val) => val !== option.value,
													);
												} else {
													updatedValue.push(option.value);
												}
												onChange(updatedValue);
											}}
											selected={isSelected}
										>
											{option.label}
										</Chip>
									);
								})}
							</View>
						</>
					)}

					{type === "custom" && customRender && (
						<>{customRender({ value, onChange, onBlur }, { error })}</>
					)}

					{error && <HelperText type="error">{error.message}</HelperText>}
				</View>
			)}
		/>
	);
}
