import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useProfile } from '../../hooks/useProfile';

const ProfileScreen = () => {
  const { profile, loading, error, updateProfile, deleteProfile } = useProfile();
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<string | null>('');
  const [subjects, setSubjects] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setGrade(profile.grade);
      setSubjects((profile.subjects ?? []).join(', '));
    }
  }, [profile]);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim() || undefined,
        grade: grade === '' ? null : grade || null,
        subjects: subjects
          ? subjects
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : null,
      });
      Alert.alert('Profile updated');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    Alert.alert(
      'Delete profile',
      'This will remove your profile data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfile();
              Alert.alert('Profile removed');
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete profile');
            }
          },
        },
      ]
    );
  };

  if (loading && !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00D4FF" />
        <Text className="text-gray-500 mt-4">Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-10">
      <Text className="text-2xl font-semibold mb-6">Your profile</Text>

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <View className="space-y-5">
        <View>
          <Text className="text-slate-600 mb-2">Full name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            className="border border-slate-200 rounded-2xl px-4 py-3 text-base"
          />
        </View>

        <View>
          <Text className="text-slate-600 mb-2">Grade</Text>
          <TextInput
            value={grade ?? ''}
            onChangeText={(value) => setGrade(value)}
            placeholder="e.g. Grade 9"
            className="border border-slate-200 rounded-2xl px-4 py-3 text-base"
          />
        </View>

        <View>
          <Text className="text-slate-600 mb-2">Subjects (comma separated)</Text>
          <TextInput
            value={subjects}
            onChangeText={setSubjects}
            placeholder="Math, Biology, History"
            className="border border-slate-200 rounded-2xl px-4 py-3 text-base"
            multiline
          />
        </View>

        <Pressable
          className="bg-slate-900 rounded-2xl py-4 items-center"
          disabled={saving}
          onPress={onSave}
        >
          <Text className="text-white text-base font-semibold">
            {saving ? 'Saving…' : 'Save changes'}
          </Text>
        </Pressable>

        <Pressable
          className="border border-red-500 rounded-2xl py-4 items-center"
          onPress={onDelete}
        >
          <Text className="text-red-500 text-base font-semibold">Delete profile</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
