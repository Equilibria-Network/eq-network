export default function PlayerIcon({ name }: { name: string }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="player-icon"
      src={`/img/icons/playground/${name}.svg`}
    />
  );
}
