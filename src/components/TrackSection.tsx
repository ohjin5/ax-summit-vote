import React from 'react';
import { Team, TrackInfo, VoteRank, VoteSelection } from '../types';
import { TrackHeader } from './TrackHeader';
import { PresentationCard } from './PresentationCard';

interface TrackSectionProps {
  track: TrackInfo;
  teams: Team[];
  currentStep: VoteRank;
  selection: VoteSelection;
  onSelectTeam: (team: Team) => void;
  onUnselectRank: (rank: VoteRank) => void;
}

export function TrackSection({
  track,
  teams,
  currentStep,
  selection,
  onSelectTeam,
  onUnselectRank,
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
        {teams.map((team) => {
          let assignedRank: VoteRank | null = null;
          if (selection[1] === team.id) assignedRank = 1;
          else if (selection[2] === team.id) assignedRank = 2;
          else if (selection[3] === team.id) assignedRank = 3;

          const isSelectedInCurrentStep = assignedRank === currentStep;

          return (
            <PresentationCard
              key={team.id}
              team={team}
              currentStep={currentStep}
              assignedRank={assignedRank}
              isSelectedInCurrentStep={isSelectedInCurrentStep}
              onSelect={onSelectTeam}
              onUnselect={onUnselectRank}
            />
          );
        })}
      </div>
    </section>
  );
}
