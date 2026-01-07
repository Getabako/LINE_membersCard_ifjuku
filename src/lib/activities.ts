// 好きな活動の定義
export const FAVORITE_ACTIVITIES = [
  { id: 'programming', name: 'プログラミング', description: 'コードを書くのが好き' },
  { id: 'gaming', name: 'ゲーム', description: 'ゲームで遊ぶのが好き' },
  { id: 'sports', name: 'スポーツ', description: '体を動かすのが好き' },
  { id: 'reading', name: '読書', description: '本を読むのが好き' },
  { id: 'music', name: '音楽', description: '音楽を聴く・演奏するのが好き' },
  { id: 'art', name: 'アート・絵', description: '絵を描くのが好き' },
  { id: 'video', name: '動画制作', description: '動画を作るのが好き' },
  { id: 'science', name: '科学・実験', description: '実験や科学が好き' },
] as const;

export type FavoriteActivityId = typeof FAVORITE_ACTIVITIES[number]['id'];

// 将来やりたいことの定義
export const FUTURE_GOALS = [
  { id: 'engineer', name: 'エンジニア', description: 'プログラムを作る仕事' },
  { id: 'game_creator', name: 'ゲームクリエイター', description: 'ゲームを作る仕事' },
  { id: 'youtuber', name: 'YouTuber', description: '動画配信をする仕事' },
  { id: 'designer', name: 'デザイナー', description: 'デザインをする仕事' },
  { id: 'scientist', name: '科学者・研究者', description: '研究をする仕事' },
  { id: 'teacher', name: '先生', description: '教える仕事' },
  { id: 'athlete', name: 'スポーツ選手', description: 'スポーツをする仕事' },
  { id: 'doctor', name: '医師', description: '人を治す仕事' },
  { id: 'investor', name: '投資家', description: 'お金を運用する仕事' },
  { id: 'entrepreneur', name: '起業家', description: '会社を作る仕事' },
  { id: 'other', name: 'その他・まだ考え中', description: 'これから見つける' },
] as const;

export type FutureGoalId = typeof FUTURE_GOALS[number]['id'];

// IDから名前を取得するヘルパー関数
export const getActivityNameById = (id: string): string | undefined => {
  return FAVORITE_ACTIVITIES.find(a => a.id === id)?.name;
};

export const getGoalNameById = (id: string): string | undefined => {
  return FUTURE_GOALS.find(g => g.id === id)?.name;
};
