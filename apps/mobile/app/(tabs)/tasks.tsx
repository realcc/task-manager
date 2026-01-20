import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { router } from 'expo-router';

const GET_TASKS = gql`
  query GetTasks($take: Int) {
    tasks(take: $take) {
      items {
        id
        title
        description
        status
        priority
        dueDate
      }
    }
  }
`;

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
}

export default function TasksScreen() {
  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    variables: { take: 50 },
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load tasks</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tasks = data?.tasks?.items || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first task to get started
            </Text>
          </View>
        }
      />
    </View>
  );
}

function TaskCard({ task }: { task: Task }) {
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
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/task/${task.id}`)}
    >
      <Text style={styles.cardTitle}>{task.title}</Text>
      {task.description && (
        <Text style={styles.cardDescription} numberOfLines={2}>
          {task.description}
        </Text>
      )}
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
    </TouchableOpacity>
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
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
