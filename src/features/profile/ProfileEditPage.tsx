import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import { useUserStore } from '../../stores/userStore';
import { COURSES, ALL_AREAS_BY_DAY, getDeliveryDayByArea, getDayFullName, type DeliveryDay } from '../../lib/deliveryAreas';

export const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, saveUserProfile } = useUserStore();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setSelectedCourses(user.courses || []);
      setSelectedArea(user.area || '');
    }
  }, [user]);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(c => c !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = async () => {
    if (selectedCourses.length === 0) {
      setSaveError('コースを1つ以上選択してください');
      return;
    }
    if (!selectedArea) {
      setSaveError('地域を選択してください');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await saveUserProfile({
        courses: selectedCourses,
        area: selectedArea,
      });
      navigate('/');
    } catch {
      setSaveError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  const deliveryDay = selectedArea ? getDeliveryDayByArea(selectedArea) : null;

  if (isLoading || !user) {
    return <Loading fullScreen text="読み込み中..." />;
  }

  return (
    <div className="min-h-screen bg-line-light">
      <Header title="会員情報登録" showBack />

      <main className="p-4 pb-8 space-y-6">
        {/* コース選択 */}
        <Card>
          <h2 className="text-section mb-4">コースを選択（複数可）</h2>
          <div className="space-y-3">
            {COURSES.map((course) => (
              <label
                key={course.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedCourses.includes(course.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleCourseToggle(course.id)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{course.name}</p>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* 地域選択 */}
        <Card>
          <h2 className="text-section mb-4">お届け地域を選択</h2>
          <p className="text-sm text-gray-500 mb-4">
            お住まいの地域を選択すると、お届け曜日が自動で設定されます
          </p>

          <div className="space-y-4">
            {ALL_AREAS_BY_DAY.map(({ day, areas }) => (
              <div key={day} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold">
                    {day}
                  </span>
                  <span className="text-sm text-gray-600">{getDayFullName(day as DeliveryDay)}配達</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-10">
                  {areas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setSelectedArea(area)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedArea === area
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedArea && deliveryDay && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">
                <span className="font-bold">{selectedArea}</span>は
                <span className="font-bold text-lg"> {getDayFullName(deliveryDay)} </span>
                にお届けします
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
          className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? '保存中...' : '登録する'}
        </button>
      </main>
    </div>
  );
};
