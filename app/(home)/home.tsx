import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Card, IconButton } from "react-native-paper";
import { useTheme } from "../ThemeContext";
import CardProfile from "@/components/CardProfile";
import { AvatarImageSource } from "react-native-paper/lib/typescript/components/Avatar/AvatarImage";
import { getUserById, patchUser, postUser } from "@/api/users/users.api";
import { useUser } from "../UserContext";
import { useQuery } from "@tanstack/react-query";
import UserForm from "@/components/UserForm";
import { GENDER, PERMISSION } from "@/api/users/users.types";

const Home = () => {

    const { user } = useUser();

    console.log(user)
    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20,
                gap: 20,
            }}
        >
            <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
                Olá {user.name}
            </Text>

        </ScrollView>
    );
};

export default Home;
