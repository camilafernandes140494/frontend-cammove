import { getReviewsByTeacher } from "@/api/reviews/reviews.api";
import CardReview from "@/components/CardReview";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, View } from "react-native";
import { Appbar } from "react-native-paper";

type ReviewsStudentProps = {
	navigation: any;
};

const Reviews = ({ navigation }: ReviewsStudentProps) => {
	const { theme } = useTheme();
	const { user } = useUser();

	const {
		data: review,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["getReviewsByTeacher", user?.id],
		queryFn: () => getReviewsByTeacher(user?.id || ""),
		enabled: !!user?.id,
	});

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.navigate("Home")} />
				<Appbar.Content title="Avaliações" />
			</Appbar.Header>
			<FlatList
				style={{ flex: 1, backgroundColor: theme.colors.background }}
				contentContainerStyle={{
					flexGrow: 1,
					paddingBottom: 20,
					marginTop: 16,
				}}
				data={review}
				refreshing={isLoading || isFetching}
				renderItem={({ item }) => (
					<CardReview reviewData={item} navigation={navigation} />
				)}
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
		</View>
	);
};

export default Reviews;
