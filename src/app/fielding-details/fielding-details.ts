import { PlayerDetails } from '../player-details/player-details';
import { MatchDetails } from '../match-details/match-details';

export class FieldingDetails {
    id: number;
    matchDetails: MatchDetails;
    playerDetails: PlayerDetails;
    catches: string;
    catchesDropped: string;
    runOuts: string;
    runsSaved: string;
    runsMissed: string;
}