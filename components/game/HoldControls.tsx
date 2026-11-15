"use client";

export function HoldControls({
  paused,
  onToggle,
  onMenu,
}: {
  paused: boolean;
  onToggle: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="hold-controls">
      <button type="button" data-testid="pause" onClick={onToggle}>
        {paused ? "Resume" : "Pause"}
      </button>
      <button type="button" data-testid="menu" onClick={onMenu}>
        Menu
      </button>
      {paused && (
        <div className="pause-backdrop" role="dialog" aria-modal="true" aria-labelledby="pause-title">
          <div className="pause-card">
            <p className="eyebrow">Held</p>
            <h2 id="pause-title">The corridor waits.</h2>
            <p>Timers, aliens, and the dodge ring stay where they are.</p>
            <div className="row">
              <button type="button" className="primary" onClick={onToggle}>Resume</button>
              <button type="button" onClick={onMenu}>Back to the menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
