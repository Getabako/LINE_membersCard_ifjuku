import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import { useUserStore } from '../../stores/userStore';
import { FAVORITE_ACTIVITIES, FUTURE_GOALS } from '../../lib/activities';

export const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, saveUserProfile } = useUserStore();

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setSelectedActivities(user.favoriteActivities || []);
      setSelectedGoal(user.futureGoal || '');
    }
  }, [user]);

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(a => a !== activityId)
        : [...prev, activityId]
    );
  };

  const handleSave = async () => {
    if (selectedActivities.length === 0) {
      setSaveError('好きな活動を1つ以上選択してください');
      return;
    }
    if (!selectedGoal) {
      setSaveError('将来やりたいことを選択してください');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await saveUserProfile({
        favoriteActivities: selectedActivities,
        futureGoal: selectedGoal,
      });
      navigate('/');
    } catch {
      setSaveError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return <Loading fullScreen text="読み込み中..." />;
  }

  return (
    <div className="min-h-screen bg-if-light">
      <Header title="会員情報登録" showBack />

      <main className="p-4 pb-8 space-y-6">
        {/* 好きな活動選択 */}
        <Card>
          <h2 className="text-section mb-4">好きな活動を選択（複数可）</h2>
          <div className="space-y-3">
            {FAVORITE_ACTIVITIES.map((activity) => (
              <label
                key={activity.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedActivities.includes(activity.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity.id)}
                  onChange={() => handleActivityToggle(activity.id)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* 将来やりたいこと選択 */}
        <Card>
          <h2 className="text-section mb-4">将来やりたいことを選択</h2>
          <p className="text-sm text-gray-500 mb-4">
            今の夢を教えてね！変わってもOKだよ
          </p>

          <div className="space-y-3">
            {FUTURE_GOALS.map((goal) => (
              <label
                key={goal.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedGoal === goal.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="futureGoal"
                  checked={selectedGoal === goal.id}
                  onChange={() => setSelectedGoal(goal.id)}
                  className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{goal.name}</p>
                  <p className="text-sm text-gray-500">{goal.description}</p>
                </div>
              </label>
            ))}
          </div>

          {selectedGoal && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-800">
                将来の夢は
                <span className="font-bold text-lg"> {FUTURE_GOALS.find(g => g.id === selectedGoal)?.name} </span>
                だね！
              </p>
            </div>
          )}
        </Card>

        {/* エラー表示 */}
        {saveError && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">{saveError}</p>
          </div>
        )}

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-shadow"
        >
          {isSaving ? '保存中...' : '登録する'}
        </button>
      </main>
    </div>
  );
};
