import PlayerIcon from '../components/PlayerIcon';

interface Props {
  disabled: boolean;
  playing: boolean;
  tick: number;
  maxTick: number;
  nextDisabled?: boolean;
  hideNext?: boolean;
  onTogglePlay: () => void;
  onScrub: (tick: number) => void;
  onNext?: () => void;
}

/** Watch-only transport: play, scrub, next. Reuses the workbench's
    .transport styling; the grid override lives in showcase.css. */
export default function ShowcaseTransport({
  disabled,
  playing,
  tick,
  maxTick,
  nextDisabled = false,
  hideNext = false,
  onTogglePlay,
  onScrub,
  onNext,
}: Props) {
  return (
    <div className="transport showcase-transport">
      <button
        aria-label={playing ? 'Pause the run' : 'Play the run'}
        className="transport-button"
        disabled={disabled}
        onClick={onTogglePlay}
        type="button"
      >
        <PlayerIcon name={playing ? 'pause' : 'play'} />
      </button>
      <input
        aria-label="Simulation tick"
        disabled={disabled}
        max={maxTick}
        min="0"
        onChange={(event) => onScrub(Number(event.target.value))}
        type="range"
        value={tick}
      />
      <output className="tick-readout">t = {tick.toString().padStart(3, '0')}</output>
      {!hideNext && (
        <button className="showcase-next" disabled={nextDisabled} onClick={onNext} type="button">
          Next
        </button>
      )}
    </div>
  );
}
