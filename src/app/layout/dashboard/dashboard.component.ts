import {
    Component,
    OnInit,
    ElementRef,
    ViewChild
} from '@angular/core';
import {
    routerTransition
} from '../../router.animations';

import * as moment from 'moment';
import { BattingStats } from '../../batting-stats/batting-stats';
import { BattingStatsService } from '../../batting-stats/batting-stats.service';
import { CalendarDetailsService } from '../../calendar-details/calendar-details.service';
import { TeamDetailsService } from '../../team-details/team-details.service';
import { TeamDetails } from '../../team-details/team-details';
import { CalendarDetails } from '../../calendar-details/calendar-details';
import { BowlingStats } from '../../bowling-stats/bowling-stats';
import { BowlingStatsService } from '../../bowling-stats/bowling-stats.service';
import { FieldingStats } from '../../fielding-stats/fielding-stats';
import { FieldingStatsService } from '../../fielding-stats/fielding-stats.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    @ViewChild('anniversary') anniversaryDropdownElement!: ElementRef;
    @ViewChild('team') teamDropdownElement!: ElementRef;

    anniversaryOptions: CalendarDetails[];
    teamOptions: TeamDetails[];
    minBalls: number = 50;
    minOvers: number = 5;
    numberOfPlayers: number = 30;
    typeSelected: string;
    startDate: Date;
    endDate: Date;

    battingStatsRuns: BattingStats[];
    battingStatsAverage: BattingStats[];
    battingStatsStrikeRate: BattingStats[];

    bowlingStatsWickets: BowlingStats[];
    bowlingStatsAverage: BowlingStats[];
    bowlingStatsStrikeRate: BowlingStats[];
    bowlingStatsEconomy: BowlingStats[];

    fieldingStatsCatches: FieldingStats[];
    fieldingStatsRunsSaved: FieldingStats[];
    fieldingStatsDroppedCatches: FieldingStats[];
    fieldingStatsRunsMissed: FieldingStats[];

    constructor(
        private battingStatsService: BattingStatsService,
        private bowlingStatsService: BowlingStatsService,
        private fieldingStatsService: FieldingStatsService,
        private calendarDetailsService: CalendarDetailsService,
        private teamDetailsService: TeamDetailsService,
        private spinnerService: NgxSpinnerService,
        private router: Router) {
    }

    ngOnInit(): void {
      this.reloadData();
    }

    reloadData() {
      this.spinnerService.show();
        this.teamDetailsService.getTeamDetailsList().subscribe(data => {
            this.teamOptions = data;
            this.calendarDetailsService.getCalendarDetailsList().subscribe(data => {
                this.anniversaryOptions = data;
                this.anniversaryOptions.sort((a, b) => b.anniversary - a.anniversary);
                this.startDate = this.anniversaryOptions[this.anniversaryOptions.length-1].startDate;
                this.endDate = this.anniversaryOptions[0].endDate;
                this.battingStatsService.getBattingStatsList().subscribe(data => {
                    this.setBattingStats(data);
                });
                this.bowlingStatsService.getBowlingStatsList().subscribe(data => {
                  this.setBowlingStats(data);
                });
                this.fieldingStatsService.getFieldingStatsList().subscribe(data => {
                  this.setFieldingStats(data);
                  this.spinnerService.hide();
                });
                
            });
        },error => {
          console.log(error);
          this.router.navigate(['/login'], {
            queryParams: { errMsg: error.error.message }
          });
        });
    }

    filterStats(anniversary, teamId) {
      this.spinnerService.show();
        if(anniversary == "0" && teamId == "0") {
          this.reloadData();
        } else if(anniversary != "0" && teamId == "0") {
          this.battingStatsService.getBattingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setBattingStats(data);
          });
          this.bowlingStatsService.getBowlingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setBowlingStats(data);
          });
          this.fieldingStatsService.getFieldingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setFieldingStats(data);
            this.spinnerService.hide();
          });
        } else if(anniversary == "0" && teamId != "0") {
          this.battingStatsService.getBattingStatsForTeam(teamId).subscribe(data => {
            this.setBattingStats(data);
          });
          this.bowlingStatsService.getBowlingStatsForTeam(teamId).subscribe(data => {
            this.setBowlingStats(data);
          });
          this.fieldingStatsService.getFieldingStatsForTeam(teamId).subscribe(data => {
            this.setFieldingStats(data);
            this.spinnerService.hide();
          });
        } else if(anniversary != "0" && teamId != "0") {
          this.battingStatsService.getBattingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setBattingStats(data);
          });
          this.bowlingStatsService.getBowlingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setBowlingStats(data);
          });
          this.fieldingStatsService.getFieldingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setFieldingStats(data);
            this.spinnerService.hide();
          });
        }
      }
    
      filterAnniversaryStats(anniversary) {
        this.startDate = this.anniversaryOptions.filter((obj) => (obj.anniversary) == anniversary)[0].startDate;
        this.endDate = this.anniversaryOptions.filter((obj) => (obj.anniversary) == anniversary)[0].endDate;
        this.filterStats(anniversary, this.teamDropdownElement.nativeElement.value);
      }
    
      filterTeamStats(id) {
        this.filterStats(this.anniversaryDropdownElement.nativeElement.value, id);
      }

      filterRecords() {
        this.filterStats(this.anniversaryDropdownElement.nativeElement.value, this.teamDropdownElement.nativeElement.value);
      }

    setBattingStats(data) {
        this.battingStatsRuns = data;
        this.battingStatsRuns.sort((a, b) => parseInt(b.runs) - parseInt(a.runs));
        this.battingStatsRuns = this.battingStatsRuns.slice(0, this.numberOfPlayers);

        this.battingStatsAverage = data;
        this.battingStatsAverage = this.battingStatsAverage.filter((obj) => parseInt(obj.balls) >= this.minBalls);
        this.battingStatsAverage.sort((a, b) => parseFloat(b.average) - parseFloat(a.average));
        this.battingStatsAverage = this.battingStatsAverage.slice(0, this.numberOfPlayers);

        this.battingStatsStrikeRate = data;
        this.battingStatsStrikeRate = this.battingStatsStrikeRate.filter((obj) => parseInt(obj.balls) >= this.minBalls);
        this.battingStatsStrikeRate.sort((a, b) => parseFloat(b.strikeRate) - parseFloat(a.strikeRate));
        this.battingStatsStrikeRate = this.battingStatsStrikeRate.slice(0, this.numberOfPlayers);
    }

    setBowlingStats(data) {
      this.bowlingStatsWickets = data;
      this.bowlingStatsWickets.sort((a, b) => parseInt(b.wickets) - parseInt(a.wickets));
      this.bowlingStatsWickets = this.bowlingStatsWickets.slice(0, this.numberOfPlayers);

      this.bowlingStatsAverage = data;
      this.bowlingStatsAverage = this.bowlingStatsAverage.filter((obj) => parseFloat(obj.overs) >= this.minOvers);
      this.bowlingStatsAverage.sort((a, b) => parseFloat(a.average) - parseFloat(b.average));
      this.bowlingStatsAverage = this.bowlingStatsAverage.slice(0, this.numberOfPlayers);

      this.bowlingStatsStrikeRate = data;
      this.bowlingStatsStrikeRate = this.bowlingStatsStrikeRate.filter((obj) => parseFloat(obj.overs) >= this.minOvers);
      this.bowlingStatsStrikeRate.sort((a, b) => parseFloat(a.strikeRate) - parseFloat(b.strikeRate));
      this.bowlingStatsStrikeRate = this.bowlingStatsStrikeRate.slice(0, this.numberOfPlayers);

      this.bowlingStatsEconomy = data;
      this.bowlingStatsEconomy = this.bowlingStatsEconomy.filter((obj) => parseFloat(obj.overs) >= this.minOvers);
      this.bowlingStatsEconomy.sort((a, b) => parseFloat(a.economy) - parseFloat(b.economy));
      this.bowlingStatsEconomy = this.bowlingStatsEconomy.slice(0, this.numberOfPlayers);
  }

  setFieldingStats(data) {
    this.fieldingStatsCatches = data;
    this.fieldingStatsCatches.sort((a, b) => parseInt(b.catches) - parseInt(a.catches));
    this.fieldingStatsCatches = this.fieldingStatsCatches.slice(0, this.numberOfPlayers);

    this.fieldingStatsRunsSaved = data;
    this.fieldingStatsRunsSaved.sort((a, b) => parseInt(b.saved) - parseInt(a.saved));
    this.fieldingStatsRunsSaved = this.fieldingStatsRunsSaved.slice(0, this.numberOfPlayers);

    this.fieldingStatsDroppedCatches = data;
    this.fieldingStatsDroppedCatches.sort((a, b) => parseInt(b.dropped) - parseInt(a.dropped));
    this.fieldingStatsDroppedCatches = this.fieldingStatsDroppedCatches.slice(0, this.numberOfPlayers);

    this.fieldingStatsRunsMissed = data;
    this.fieldingStatsRunsMissed.sort((a, b) => parseInt(b.missed) - parseInt(a.missed));
    this.fieldingStatsRunsMissed = this.fieldingStatsRunsMissed.slice(0, this.numberOfPlayers);
}


}