import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Avatar, Card } from 'react-native-paper';
import { FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/app/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { getRelationship } from '@/api/relationships/relationships.api';
import { getInitials } from '@/common/common';
import { Student } from '@/api/relationships/relationships.types';

interface UserListProps {
    teacherId: string
    onSelect: (student: Student) => void
    filterName?: string
}

const SelectStudent = ({ teacherId, filterName, onSelect }: UserListProps) => {
    const { theme } = useTheme();
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [studentsFilter, setStudentsFilter] = useState<Student[]>();

    const { data: students, isLoading } = useQuery({
        queryKey: ['getRelationship', teacherId],
        queryFn: () => getRelationship(teacherId),
        enabled: !!teacherId
    });

    useEffect(() => {
        if (!students) return;
        let filteredData = students.students;

        if (filterName) {
            filteredData = filteredData.filter((student) =>
                student.studentName.toLowerCase().includes(filterName.toLowerCase())
            );
        }

        setStudentsFilter(filteredData);
    }, [filterName, students]);

    return (
        <FlatList
            data={studentsFilter}
            ListFooterComponent={isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" /> : null}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                    onSelect(item);
                    setSelectedStudent(item.studentId);
                }}>
                    <Card
                        mode='outlined'
                        style={{
                            marginVertical: 10,
                            backgroundColor: selectedStudent === item.studentId ? theme.colors.primaryContainer : 'white',
                            borderRadius: 16,
                            borderColor: selectedStudent === item.studentId ? theme.colors.primary : undefined,
                        }}
                    >
                        <Card.Title
                            title={item.studentName}
                            left={(props) => <Avatar.Text {...props} label={getInitials(item.studentName)} />}

                        />
                    </Card>
                </TouchableOpacity>
            )}
            keyExtractor={item => `${item.studentId}`}
        />
    );
};

export default SelectStudent;
