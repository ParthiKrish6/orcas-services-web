import { TeamDetails } from '../team-details/team-details';

export class MatchDetails {
    matchDate: Date;
    matchId: number;
    teamDetails: TeamDetails;
    opponent: string;
    teamScore: string;
    opponentScore: string;
    matchResult: string;
    margin: string;
    batFirst: string;
    captain: string;
    viceCaptain: string;
    winColor: string;
}