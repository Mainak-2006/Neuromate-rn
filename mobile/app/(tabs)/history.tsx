import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { useLessons } from '../../hooks/useLessons';
import { useQuizzes } from '../../hooks/useQuizzes';
import { useQuizAttempts } from '../../hooks/useQuizAttempts';
import { useReviews } from '../../hooks/useReviews';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="mb-8">
    <Text className="text-xl font-semibold text-slate-900 mb-3">{title}</Text>
    {children}
  </View>
);

const HistoryScreen = () => {
  const { documents, loading: docsLoading, error: docsError, reload: reloadDocs } = useDocuments();
  const { lessons, loading: lessonsLoading, error: lessonsError, reload: reloadLessons } =
    useLessons();
  const { quizzes, loading: quizzesLoading, error: quizzesError, reload: reloadQuizzes } =
    useQuizzes();
  const {
    quizAttempts,
    loading: attemptsLoading,
    error: attemptsError,
    reload: reloadAttempts,
  } = useQuizAttempts();
  const { reviews, loading: reviewsLoading, error: reviewsError, reload: reloadReviews } =
    useReviews();

  const [refreshing, setRefreshing] = useState(false);

  const loading =
    docsLoading || lessonsLoading || quizzesLoading || attemptsLoading || reviewsLoading;

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      reloadDocs(),
      reloadLessons(),
      reloadQuizzes(),
      reloadAttempts(),
      reloadReviews(),
    ]);
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00D4FF" />
        <Text className="text-gray-500 mt-4">Loading history…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-4 pt-8"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text className="text-2xl font-semibold mb-6">Your learning history</Text>

      <Section title="Documents">
        {docsError ? (
          <Text className="text-red-500">{docsError}</Text>
        ) : documents.length === 0 ? (
          <Text className="text-slate-500">No documents uploaded yet.</Text>
        ) : (
          <FlatList
            data={documents}
            keyExtractor={(doc) => doc.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="border border-slate-200 rounded-3xl p-4 mb-3">
                <Text className="text-slate-900 font-semibold" numberOfLines={2}>
                  {item.text}
                </Text>
                {item.source_url ? (
                  <Text className="text-xs text-blue-500 mt-2">{item.source_url}</Text>
                ) : null}
                <Text className="text-xs text-slate-400 mt-2">
                  Created: {item.created_at.split('T')[0]}
                </Text>
              </View>
            )}
          />
        )}
      </Section>

      <Section title="Lessons">
        {lessonsError ? (
          <Text className="text-red-500">{lessonsError}</Text>
        ) : lessons.length === 0 ? (
          <Text className="text-slate-500">No lessons created yet.</Text>
        ) : (
          <FlatList
            data={lessons}
            keyExtractor={(lesson) => lesson.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="border border-slate-200 rounded-3xl p-4 mb-3">
                <Text className="text-slate-900 font-semibold">{item.title}</Text>
                {item.summary ? (
                  <Text className="text-slate-600 mt-1" numberOfLines={2}>
                    {item.summary}
                  </Text>
                ) : null}
                <Text className="text-xs text-slate-400 mt-2">
                  Created: {item.created_at.split('T')[0]}
                </Text>
              </View>
            )}
          />
        )}
      </Section>

      <Section title="Quizzes">
        {quizzesError ? (
          <Text className="text-red-500">{quizzesError}</Text>
        ) : quizzes.length === 0 ? (
          <Text className="text-slate-500">No quizzes available yet.</Text>
        ) : (
          <FlatList
            data={quizzes}
            keyExtractor={(quiz) => quiz.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="border border-slate-200 rounded-3xl p-4 mb-3">
                <Text className="text-slate-900 font-semibold">Quiz for lesson {item.lesson_id}</Text>
                <Text className="text-xs text-slate-400 mt-2">
                  Created: {item.created_at.split('T')[0]}
                </Text>
              </View>
            )}
          />
        )}
      </Section>

      <Section title="Quiz attempts">
        {attemptsError ? (
          <Text className="text-red-500">{attemptsError}</Text>
        ) : quizAttempts.length === 0 ? (
          <Text className="text-slate-500">No quiz attempts recorded.</Text>
        ) : (
          <FlatList
            data={quizAttempts}
            keyExtractor={(attempt) => attempt.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="border border-slate-200 rounded-3xl p-4 mb-3">
                <Text className="text-slate-900 font-semibold">Quiz {item.quiz_id}</Text>
                <Text className="text-slate-600 mt-1">
                  Score: {item.score === null ? 'Pending' : `${item.score}%`}
                </Text>
                <Text className="text-xs text-slate-400 mt-2">
                  Created: {item.created_at.split('T')[0]}
                </Text>
              </View>
            )}
          />
        )}
      </Section>

      <Section title="Flashcard reviews">
        {reviewsError ? (
          <Text className="text-red-500">{reviewsError}</Text>
        ) : reviews.length === 0 ? (
          <Text className="text-slate-500">No reviews yet.</Text>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(review) => review.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="border border-slate-200 rounded-3xl p-4 mb-3">
                <Text className="text-slate-900 font-semibold">Flashcard {item.flashcard_id}</Text>
                <Text className="text-slate-600 mt-1">Quality: {item.quality}</Text>
                <Text className="text-xs text-slate-400 mt-2">
                  Reviewed: {item.review_date.split('T')[0]}
                </Text>
              </View>
            )}
          />
        )}
      </Section>
    </ScrollView>
  );
};

export default HistoryScreen;