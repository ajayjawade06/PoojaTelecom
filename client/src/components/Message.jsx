const variants = {
  red: {
    bg: 'bg-rose-50 border-rose-200 text-rose-800',
    icon: '❌',
  },
  green: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: '✅',
  },
  blue: {
    bg: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'ℹ️',
  },
  yellow: {
    bg: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: '⚠️',
  },
};

const Message = ({ variant = 'blue', children }) => {
  const { bg, icon } = variants[variant] || variants.blue;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border font-medium text-sm ${bg}`}>
      <span className="text-base flex-shrink-0">{icon}</span>
      <div>{children}</div>
    </div>
  );
};
export default Message;
