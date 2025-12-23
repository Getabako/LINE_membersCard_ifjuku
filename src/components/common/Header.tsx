import { HiArrowLeft, HiCog6Tooth } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showSettings = false,
  onSettings,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="header">
      <div className="w-10">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 touch-feedback"
            aria-label="戻る"
          >
            <HiArrowLeft className="w-6 h-6" />
          </button>
        )}
      </div>

      <h1 className="header-title">{title}</h1>

      <div className="w-10">
        {showSettings && (
          <button
            onClick={onSettings}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 touch-feedback"
            aria-label="設定"
          >
            <HiCog6Tooth className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};
