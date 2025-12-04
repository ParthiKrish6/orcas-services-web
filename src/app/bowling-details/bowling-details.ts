import { PlayerDetails } from '../player-details/player-details';
import { MatchDetails } from '../match-details/match-details';

export class BowlingDetails {
    id: number;
    matchDetails: MatchDetails;
    playerDetails: PlayerDetails;
    overs: string;
    maidens: string;
    wickets: string;
    runs: string;
    fours: string;
    sixes: string;
    dots: string;
    wides: string;
    noballs: string;
    economy: string;
}