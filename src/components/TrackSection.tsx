import React from 'react';
import { Team, TrackInfo, VoteRank, VoteSelection } from '../types';
import { TrackHeader } from './TrackHeader';
import { PresentationCard } from './PresentationCard';

interface TrackSectionProps {
  track: TrackInfo;
  teams: Team[];
  selection: VoteSelection;
  onSelectRank: (team: Team, rank: VoteRank) => void;
  onClearRank: (rank: VoteRank) => void;
}

export function TrackSection({
  track,
  teams,
  selection,
  onSelectRank,
  onClearRank,
}: TrackSectionProps) {
  if (teams.length === 0) {
    return null;
  }

  return (
    <section id={`track-section-${track.id}`} className="mb-10 scroll-mt-28">
      {/* Track Header */}
      <TrackHeader track={track} teamCount={teams.length} />

      {/* Cards in this track */}
      <div className="space-y-3">
        {teams.map((team) => (
          <PresentationCard
            key={team.id}
            team={team}
            selection={selection}
            onSelectRank={onSelectRank}
            onClearRank={onClearRank}
          />
        ))}
      </div>
    </section>
  );
}
