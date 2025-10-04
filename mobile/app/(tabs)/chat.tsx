import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { useState } from 'react';
import { useFlashcards } from '../../hooks/useFlashcards';

const FlashcardsScreen = () => {
  const { flashcards, loading, error, reload } = useFlashcards();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-white px-4 pt-10">
      <Text className="text-2xl font-semibold mb-4">Your flashcards</Text>
      {loading && flashcards.length === 0 ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#00D4FF" />
          <Text className="text-gray-500 mt-4">Loading flashcards…</Text>
        </View>
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : (
        <FlatList
          data={flashcards}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={() => (
            <Text className="text-slate-500 mt-10 text-center">
              No flashcards yet. Start by creating lessons and review items on the web.
            </Text>
          )}
          renderItem={({ item }) => (
            <View className="border border-slate-200 rounded-3xl p-4 mb-4">
              <Text className="text-lg font-semibold text-slate-900">{item.front}</Text>
              <Text className="text-slate-600 mt-2">{item.back}</Text>
              {item.hint ? <Text className="text-xs text-slate-400 mt-2">Hint: {item.hint}</Text> : null}
              <View className="flex-row justify-between mt-3">
                <Text className="text-xs text-slate-400">
                  Next review: {item.next_review_date ? item.next_review_date.split('T')[0] : 'Anytime'}
                </Text>
                <Text className="text-xs text-slate-400">Reviews: {item.review_count}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FlashcardsScreen;
