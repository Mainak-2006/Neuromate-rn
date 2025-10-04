import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useMemo, useState } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useAuth } from '@clerk/clerk-expo';
import { Alert } from 'react-native';

export default function Index() {
  const { progress, loading: progressLoading, error: progressError, reload: reloadProgress } =
    useProgress();
  const {
    flashcards,
    loading: flashcardLoading,
    error: flashcardError,
    reload: reloadFlashcards,
  } = useFlashcards();

  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const isLoading = progressLoading || flashcardLoading;

  const upcomingFlashcards = useMemo(() => {
    return (flashcards ?? [])
      .slice()
      .sort((a, b) => (a.next_review_date ?? '').localeCompare(b.next_review_date ?? ''))
      .slice(0, 5);
  }, [flashcards]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([reloadProgress(), reloadFlashcards()]);
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out successfully");
    } catch (err: any) {
      console.log("Error signing out:", err);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-8"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text className="text-3xl font-bold text-center mb-6">Welcome to NeuroMate</Text>

      {isLoading ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="large" color="#00D4FF" />
          <Text className="text-gray-500 mt-4">Loading your data...</Text>
        </View>
      ) : (
        <View className="space-y-6">
          <View className="bg-slate-900 rounded-3xl p-6 shadow-lg">
            <Text className="text-white text-xl font-semibold mb-2">Learning overview</Text>
            {progressError ? (
              <Text className="text-red-300">{progressError}</Text>
            ) : progress ? (
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-slate-300">Lessons completed</Text>
                  <Text className="text-white font-bold">{progress.lessons_completed}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-300">Quizzes taken</Text>
                  <Text className="text-white font-bold">{progress.quizzes_taken}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-300">Average score</Text>
                  <Text className="text-white font-bold">
                    {progress.avg_score === null ? '—' : `${progress.avg_score.toFixed(1)}%`}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-300">Flashcards created</Text>
                  <Text className="text-white font-bold">{progress.flashcards_created}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-300">Streak</Text>
                  <Text className="text-white font-bold">{progress.streak_days} days</Text>
                </View>
              </View>
            ) : (
              <Text className="text-slate-300">No progress data yet. Start learning!</Text>
            )}
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <Text className="text-xl font-semibold text-slate-900 mb-4">
              Upcoming flashcards
            </Text>
            {flashcardError ? (
              <Text className="text-red-500">{flashcardError}</Text>
            ) : upcomingFlashcards.length === 0 ? (
              <Text className="text-slate-500">No flashcards yet. Create one from the Flashcards tab.</Text>
            ) : (
              <View className="space-y-4">
                {upcomingFlashcards.map((card) => (
                  <View key={card.id} className="border border-slate-200 rounded-2xl p-4">
                    <Text className="text-slate-900 font-semibold">{card.front}</Text>
                    <Text className="text-slate-600 mt-2">{card.back}</Text>
                    <View className="flex-row justify-between mt-3">
                      <Text className="text-xs text-slate-400">
                        Next review: {card.next_review_date ? card.next_review_date.split('T')[0] : 'Anytime'}
                      </Text>
                      <Text className="text-xs text-slate-400">Reviews: {card.review_count}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
