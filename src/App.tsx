import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeLiff } from './lib/liff';
import { Loading } from './components/common/Loading';
import { HomePage } from './features/home/HomePage';
import { ProfileEditPage } from './features/profile/ProfileEditPage';
import { PointHistoryPage } from './features/member/PointHistoryPage';
import { BookingPage } from './features/booking/BookingPage';
import { BookingCompletePage } from './features/booking/BookingCompletePage';
import { BookingListPage } from './features/booking/BookingListPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeLiff();
        setIsLiffReady(true);
      } catch (err) {
        console.error('LIFF initialization failed:', err);
        setError('LIFFの初期化に失敗しました');
        // 開発時はエラーでも続行
        if (import.meta.env.DEV) {
          setIsLiffReady(true);
        }
      }
    };
    init();
  }, []);

  if (error && !import.meta.env.DEV) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (!isLiffReady) {
    return <Loading fullScreen text="起動中..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/points" element={<PointHistoryPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking/complete" element={<BookingCompletePage />} />
          <Route path="/bookings" element={<BookingListPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
