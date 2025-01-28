import React, { useState } from 'react';
import { View, FlatList, Text, Dimensions, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const { width } = Dimensions.get('window');

const CarouselWithDots = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const data = [
        { key: '1', title: 'Personalize treinos para seus alunos.' },
        { key: '2', title: 'Acompanhe métricas e progresso facilmente.' },
        { key: '3', title: 'Ofereça uma experiência profissional.' },
    ];

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(pageIndex);
    };

    const renderItem = ({ item }: { item: { title: string } }) => (
        <View style={styles.slide}>
            <Text style={styles.slideText}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Carrossel */}
            <FlatList
                data={data}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.key}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />

            {/* Indicadores (bolinhas) */}
            <View style={styles.dotsContainer}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: index === activeIndex ? '#6200ee' : '#ccc' },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    slide: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    slideText: {
        fontSize: 18,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});

export default CarouselWithDots;
