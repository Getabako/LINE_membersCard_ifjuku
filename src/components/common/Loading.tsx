import { clsx } from 'clsx';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  text = '読み込み中...',
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-4',
        fullScreen && 'fixed inset-0 bg-line-light z-50'
      )}
    >
      <div className="loading-spinner" />
      {text && <p className="text-body text-gray-500">{text}</p>}
    </div>
  );
};
