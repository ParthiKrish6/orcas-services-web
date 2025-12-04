import { PlayerDetails } from '../player-details/player-details';
import { MatchDetails } from '../match-details/match-details';

export class BattingDetails {
    id: number;
    matchDetails: MatchDetails;
    playerDetails: PlayerDetails;
    runs: string;
    balls: string;
    timeSpent: string;
    fours: string;
    sixes: string;
    strikeRate: string;
    notOut: string;
}