type CommentAvatarProps = {
  nickname: string;
  depth: number;
};

export default function CommentAvatar({ nickname, depth }: CommentAvatarProps) {
  const sizeClassName = depth === 0 ? "h-10 w-10" : depth === 1 ? "h-9 w-9" : "h-8 w-8";
  const textClassName = depth >= 2 ? "text-xs" : "text-sm";

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface text-primary ${sizeClassName}`}
    >
      <span className={`font-semibold ${textClassName}`}>{nickname.slice(0, 1)}</span>
    </div>
  );
}
