import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_TASK, {
    variables: { id },
  });

  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const handleStatusChange = async (newStatus: string) => {
    await updateTask({
      variables: { id, input: { status: newStatus } },
    });
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask({ variables: { id } });
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !data?.task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Task not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const task = data.task;

  const statusColors: Record<string, string> = {
    TODO: '#e5e7eb',
    IN_PROGRESS: '#dbeafe',
    DONE: '#dcfce7',
  };

  const priorityColors: Record<string, string> = {
    LOW: '#e5e7eb',
    MEDIUM: '#fef3c7',
    HIGH: '#fee2e2',
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Task Details',
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete}>
              <Text style={{ color: '#dc2626', fontSize: 16 }}>Delete</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{task.title}</Text>

          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: statusColors[task.status] }]}>
              <Text style={styles.badgeText}>
                {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status === 'TODO' ? 'To Do' : 'Done'}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: priorityColors[task.priority] }]}>
              <Text style={styles.badgeText}>{task.priority}</Text>
            </View>
          </View>

          {task.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{task.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Update Status</Text>
            <View style={styles.statusButtons}>
              {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    task.status === status && styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusChange(status)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      task.status === status && styles.statusButtonTextActive,
                    ]}
                  >
                    {status === 'IN_PROGRESS' ? 'In Progress' : status === 'TODO' ? 'To Do' : 'Done'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {task.dueDate && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Due Date</Text>
              <Text style={styles.infoText}>
                {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Created</Text>
            <Text style={styles.infoText}>
              {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
  },
});
