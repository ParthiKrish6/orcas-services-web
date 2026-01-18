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
import { Player } from './player';
import { StatsPopupComponent } from './stats-popup.component';
import { MatDialog } from '@angular/material';
import { BattingDetailsService } from '../../batting-details/batting-details.service';
import { BowlingDetailsService } from '../../bowling-details/bowling-details.service';
import { FieldingDetailsService } from '../../fielding-details/fielding-details.service';
import { MatchStats } from './match-stats';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

  @ViewChild('anniversary') anniversaryDropdownElement!: ElementRef;
  @ViewChild('team') teamDropdownElement!: ElementRef;
  @ViewChild('department') departmentDropdownElement!: ElementRef;
  @ViewChild('deptOptionsElement') deptOptionsDropdownElement!: ElementRef;

  anniversaryOptions: CalendarDetails[];
  teamOptions: TeamDetails[];
  minBalls: number = 50;
  minOvers: number = 10;
  numberOfPlayers: number = 30;
  typeSelected: string;
  startDate: Date;
  endDate: Date;
  players = [];
  deptOptions: string[];
  deptSelected: string;
  deptOptionSelected: string;
  deptOptionSelectedDisplay: string;
  battingDept: string[] = ['Runs', 'Batting Average', 'Batting SR', 'Batting Dots'];
  bowlingDept: string[] = ['Wickets', 'Bowling Average', 'Bowling SR', 'Economy', 'Extras']
  fieldingDept: string[] = ['Catches/RO', 'Drop Catches', 'Runs Saved', 'Runs Missed']
  showPopup = false;

  battingStatsRuns: BattingStats[];
  battingStatsAverage: BattingStats[];
  battingStatsStrikeRate: BattingStats[];
  battingStatsDots: BattingStats[];

  bowlingStatsWickets: BowlingStats[];
  bowlingStatsAverage: BowlingStats[];
  bowlingStatsStrikeRate: BowlingStats[];
  bowlingStatsEconomy: BowlingStats[];
  bowlingStatsExtras: BowlingStats[];

  fieldingStatsCatches: FieldingStats[];
  fieldingStatsRunsSaved: FieldingStats[];
  fieldingStatsDroppedCatches: FieldingStats[];
  fieldingStatsRunsMissed: FieldingStats[];

  constructor(
    private battingStatsService: BattingStatsService,
    private bowlingStatsService: BowlingStatsService,
    private fieldingStatsService: FieldingStatsService,
    private battingDetailsService: BattingDetailsService,
    private bowlingDetailsService: BowlingDetailsService,
    private fieldingDetailsService: FieldingDetailsService,
    private calendarDetailsService: CalendarDetailsService,
    private teamDetailsService: TeamDetailsService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.deptOptions = this.battingDept;
    this.deptSelected = "Batting";
    this.deptOptionSelected = "Runs";
    this.deptOptionSelectedDisplay = 'Runs';
    this.reloadData();
  }

  setDepartment() {
    this.deptSelected = this.departmentDropdownElement.nativeElement.value;
    if ('Batting' == this.deptSelected) {
      this.deptOptions = this.battingDept;
      this.deptOptionSelected = "Runs";
      this.setBattingLeaderBoardContent();
    } else if ('Bowling' == this.deptSelected) {
      this.deptOptions = this.bowlingDept;
      this.deptOptionSelected = "Wickets";
      this.setBowlingLeaderBoardContent();
    } else if ('Fielding' == this.deptSelected) {
      this.deptOptions = this.fieldingDept;
      this.deptOptionSelected = "Catches/RO";
      this.setFieldingLeaderBoardContent();
    }
    this.deptOptionSelectedDisplay = this.deptOptionSelected.replace('Batting ','').replace('Bowling ','');
    if('SR'==this.deptOptionSelectedDisplay) {
      this.deptOptionSelectedDisplay = 'Strike Rate';
    } else if('Dots'==this.deptOptionSelectedDisplay || 'Extras'==this.deptOptionSelectedDisplay) {
      this.deptOptionSelectedDisplay = this.deptOptionSelectedDisplay + ' %';
    }
  }

  setDeptOptions() {
    this.deptOptionSelected = this.deptOptionsDropdownElement.nativeElement.value;
    if ('Batting' == this.deptSelected) {
      this.setBattingLeaderBoardContent();
    } else if ('Bowling' == this.deptSelected) {
      this.setBowlingLeaderBoardContent();
    } else if ('Fielding' == this.deptSelected) {
      this.setFieldingLeaderBoardContent();
    }
    this.deptOptionSelectedDisplay = this.deptOptionSelected.replace('Batting ','').replace('Bowling ','');
    if('SR'==this.deptOptionSelectedDisplay) {
      this.deptOptionSelectedDisplay = 'Strike Rate';
    } else if('Dots'==this.deptOptionSelectedDisplay || 'Extras'==this.deptOptionSelectedDisplay) {
      this.deptOptionSelectedDisplay = this.deptOptionSelectedDisplay + ' %';
    }
  }

  reloadData() {
    this.spinnerService.show();
    this.teamDetailsService.getTeamDetailsList().subscribe(data => {
      this.teamOptions = data;
      this.calendarDetailsService.getCalendarDetailsList().subscribe(data => {
        this.anniversaryOptions = data;
        this.anniversaryOptions.sort((a, b) => b.anniversary - a.anniversary);
        if(this.anniversaryOptions.length> 0) {
          this.startDate = this.anniversaryOptions[this.anniversaryOptions.length - 1].startDate;
          this.endDate = this.anniversaryOptions[0].endDate;
  
          this.fieldingStatsService.getFieldingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setFieldingStats(data, false);
          });
  
          this.bowlingStatsService.getBowlingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setBowlingStats(data, false);
          });
  
          this.battingStatsService.getBattingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setBattingStats(data, true);
            this.spinnerService.hide();
          });
        } else {
          this.spinnerService.hide();
        }
        }, error => {
          console.log(error);
          this.router.navigate(['/login'], {
            skipLocationChange: true,
            queryParams: { errMsg: error.error.message }
          });
        });
    }, error => {
      console.log(error);
      this.router.navigate(['/login'], {
        skipLocationChange: true,
        queryParams: { errMsg: error.error.message }
      });
    });
  }

  filterStats(teamId) {
    this.spinnerService.show();
    if (teamId != "0") {
      if('Batting' == this.deptSelected) {
        this.battingStatsService.getBattingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
          this.setBattingStats(data, true);
          this.spinnerService.hide();
          this.bowlingStatsService.getBowlingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setBowlingStats(data, false);
          });
          this.fieldingStatsService.getFieldingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setFieldingStats(data, false);
          });
        }, error => {
          console.log(error);
          this.router.navigate(['/login'], {
            skipLocationChange: true,
            queryParams: { errMsg: error.error.message }
          });
        });
      } else if('Bowling' == this.deptSelected) {
        this.bowlingStatsService.getBowlingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
          this.setBowlingStats(data, true);
          this.spinnerService.hide();
          this.battingStatsService.getBattingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setBattingStats(data, false);
          });
          this.fieldingStatsService.getFieldingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setFieldingStats(data, false);
          });

        }, error => {
          console.log(error);
          this.router.navigate(['/login'], {
            skipLocationChange: true,
            queryParams: { errMsg: error.error.message }
          });
        });
      } else if('Fielding' == this.deptSelected) {
        this.fieldingStatsService.getFieldingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
          this.setFieldingStats(data, true);
          this.spinnerService.hide();
          this.battingStatsService.getBattingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setBattingStats(data, false);
          });
          this.bowlingStatsService.getBowlingStatsBetweenDatesForTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), teamId).subscribe(data => {
            this.setBowlingStats(data, false);
          });

        }, error => {
          console.log(error);
          this.router.navigate(['/login'], {
            skipLocationChange: true,
            queryParams: { errMsg: error.error.message }
          });
        });
      }
    } else {
      if('Batting' == this.deptSelected) {
        this.battingStatsService.getBattingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
          this.setBattingStats(data,true);
          this.spinnerService.hide();

          this.bowlingStatsService.getBowlingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setBowlingStats(data, false);
          });
          this.fieldingStatsService.getFieldingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setFieldingStats(data, false);
          });
        }, error => {
          console.log(error);
          this.router.navigate(['/login'], {
            skipLocationChange: true,
            queryParams: { errMsg: error.error.message }
          });
        });
      } else if('Bowling' == this.deptSelected) {
        this.bowlingStatsService.getBowlingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
          this.setBowlingStats(data, true);
          this.spinnerService.hide();

          this.battingStatsService.getBattingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setBattingStats(data, false);
          });
          this.fieldingStatsService.getFieldingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setFieldingStats(data, false);
          });
        }, error => {
          console.log(error);
          this.router.navigate(['/login'], {
            skipLocationChange: true,
            queryParams: { errMsg: error.error.message }
          });
        });
      } else if('Fielding' == this.deptSelected) {
        this.fieldingStatsService.getFieldingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
          this.setFieldingStats(data, true);
          this.spinnerService.hide();

          this.battingStatsService.getBattingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setBattingStats(data, false);
          });
          this.bowlingStatsService.getBowlingStatsBetweenDates(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD')).subscribe(data => {
            this.setBowlingStats(data, false);
          });

        }, error => {
          console.log(error);
          this.router.navigate(['/login'], {
            skipLocationChange: true,
            queryParams: { errMsg: error.error.message }
          });
        });
      }
    }
  }

  filterAnniversaryStats(anniversary) {
    if (anniversary == "0") {
      this.startDate = this.anniversaryOptions[this.anniversaryOptions.length-1].startDate;
      this.endDate = this.anniversaryOptions[0].endDate;
    } else {
      this.startDate = this.anniversaryOptions.filter((obj) => (obj.anniversary) == anniversary)[0].startDate;
      this.endDate = this.anniversaryOptions.filter((obj) => (obj.anniversary) == anniversary)[0].endDate;
    }
    this.filterStats(this.teamDropdownElement.nativeElement.value);
  }

  filterTeamStats(id) {
    this.filterStats(id);
  }

  filterRecords() {
    this.filterStats(this.teamDropdownElement.nativeElement.value);
  }

  setBattingStats(data, isRefresh) {
    this.battingStatsRuns = data;
    this.battingStatsRuns.sort((a, b) => {
      if (parseInt(b.runs) !== parseInt(a.runs)) return parseInt(b.runs) - parseInt(a.runs);
      if (parseInt(b.innings) !== parseInt(a.innings)) return parseInt(a.innings) - parseInt(b.innings);
    });
    this.battingStatsRuns = this.battingStatsRuns.slice(0, this.numberOfPlayers);

    this.battingStatsAverage = data;
    this.battingStatsAverage = this.battingStatsAverage.filter((obj) => parseInt(obj.balls) >= this.minBalls);
    this.battingStatsAverage.sort((a, b) => {
      if (parseFloat(b.average) !== parseFloat(a.average)) return parseFloat(b.average) - parseFloat(a.average);
      if (parseInt(b.runs) !== parseInt(a.runs)) return parseInt(b.runs) - parseInt(a.runs);
    });
    this.battingStatsAverage = this.battingStatsAverage.slice(0, this.numberOfPlayers);

    this.battingStatsStrikeRate = data;
    this.battingStatsStrikeRate = this.battingStatsStrikeRate.filter((obj) => parseInt(obj.balls) >= this.minBalls);
    this.battingStatsStrikeRate.sort((a, b) => {
      if (parseFloat(b.strikeRate) !== parseFloat(a.strikeRate)) return parseFloat(b.strikeRate) - parseFloat(a.strikeRate);
      if (parseInt(b.runs) !== parseInt(a.runs)) return parseInt(b.runs) - parseInt(a.runs);
    });
    this.battingStatsStrikeRate = this.battingStatsStrikeRate.slice(0, this.numberOfPlayers);

    this.battingStatsDots = data;
    this.battingStatsDots = this.battingStatsDots.filter((obj) => parseInt(obj.balls) >= this.minBalls);
    this.battingStatsDots.forEach(item => {
      item.dotsPercentage = item.balls != undefined && item.balls != 'DNB' && item.balls != '' && item.dots != undefined && item.dots != 'DNB' && item.dots != ''
        ? +((parseInt(item.dots) / parseInt(item.balls)) * 100).toFixed(2)
        : 0;
    });

    this.battingStatsDots.sort((a, b) => {
      if (a.dotsPercentage !== b.dotsPercentage) return a.dotsPercentage - b.dotsPercentage;
      if (parseInt(b.balls) !== parseInt(a.balls)) return parseInt(a.balls) - parseInt(b.balls);
    });
    this.battingStatsDots = this.battingStatsDots.slice(0, this.numberOfPlayers);

    if(isRefresh) {
      this.setBattingLeaderBoardContent();
    } 
  }

  setBowlingStats(data, isRefresh) {
    this.bowlingStatsWickets = data;
    this.bowlingStatsWickets.sort((a, b) => {
      if (parseInt(b.wickets) !== parseInt(a.wickets)) return parseInt(b.wickets) - parseInt(a.wickets);
      if (parseInt(b.innings) !== parseInt(a.innings)) return parseInt(a.innings) - parseInt(b.innings);
    });
    this.bowlingStatsWickets = this.bowlingStatsWickets.slice(0, this.numberOfPlayers);

    this.bowlingStatsAverage = data;
    this.bowlingStatsAverage = this.bowlingStatsAverage.filter((obj) => parseFloat(obj.overs) >= this.minOvers);
    this.bowlingStatsAverage.sort((a, b) => {
      if (parseFloat(b.average) !== parseFloat(a.average)) return parseFloat(a.average) - parseFloat(b.average);
      if (parseInt(b.wickets) !== parseInt(a.wickets)) return parseInt(b.wickets) - parseInt(a.wickets);
    });
    this.bowlingStatsAverage = this.bowlingStatsAverage.slice(0, this.numberOfPlayers);

    this.bowlingStatsStrikeRate = data;
    this.bowlingStatsStrikeRate = this.bowlingStatsStrikeRate.filter((obj) => parseFloat(obj.overs) >= this.minOvers);
    this.bowlingStatsStrikeRate.sort((a, b) => {
      if (parseFloat(b.strikeRate) !== parseFloat(a.strikeRate)) return parseFloat(a.strikeRate) - parseFloat(b.strikeRate);
      if (parseInt(b.wickets) !== parseInt(a.wickets)) return parseInt(b.wickets) - parseInt(a.wickets);
    });
    this.bowlingStatsStrikeRate = this.bowlingStatsStrikeRate.slice(0, this.numberOfPlayers);

    this.bowlingStatsEconomy = data;
    this.bowlingStatsEconomy = this.bowlingStatsEconomy.filter((obj) => parseFloat(obj.overs) >= this.minOvers);
    this.bowlingStatsEconomy.sort((a, b) => {
      if (parseFloat(b.economy) !== parseFloat(a.economy)) return parseFloat(a.economy) - parseFloat(b.economy);
      if (parseInt(b.wickets) !== parseInt(a.wickets)) return parseInt(b.wickets) - parseInt(a.wickets);
    });
    this.bowlingStatsEconomy = this.bowlingStatsEconomy.slice(0, this.numberOfPlayers);

    this.bowlingStatsExtras = data;
    this.bowlingStatsExtras = this.bowlingStatsExtras.filter((obj) => parseFloat(obj.overs) >= this.minOvers);
    this.bowlingStatsExtras.forEach(item => {
      let extras = parseInt(item.wides)+parseInt(item.noBalls);
      const wholeOvers = Math.floor(parseInt(item.overs));
      const balls = Math.round((parseInt(item.overs) - wholeOvers) * 10); // decimal part = balls
      const noOfBalls = (wholeOvers * 6) + balls;
      item.balls = noOfBalls;
      item.extrasPercentage = extras
        ? +(extras / noOfBalls * 100).toFixed(2)
        : 0;
    });
    this.bowlingStatsExtras.sort((a, b) => {
      if (a.extrasPercentage !== b.extrasPercentage) return (a.extrasPercentage - b.extrasPercentage);
      if (parseInt(b.overs) !== parseInt(a.overs)) return parseInt(a.overs) - parseInt(b.overs);
    });
    this.bowlingStatsExtras = this.bowlingStatsExtras.slice(0, this.numberOfPlayers);
   if(isRefresh) {
    this.setBowlingLeaderBoardContent();
   } 
  }

  setFieldingStats(data, isRefresh) {
    this.fieldingStatsCatches = data;
    this.fieldingStatsCatches.sort((a, b) => {
      if (parseInt(b.catches)+parseInt(b.runOuts) !== parseInt(a.catches)+parseInt(a.runOuts)) return (parseInt(b.catches)+parseInt(b.runOuts)) - (parseInt(a.catches)+parseInt(a.runOuts));
      if (parseInt(b.innings) !== parseInt(a.innings)) return parseInt(a.innings) - parseInt(b.innings);
    });
    this.fieldingStatsCatches = this.fieldingStatsCatches.slice(0, this.numberOfPlayers);

    this.fieldingStatsRunsSaved = data;
    this.fieldingStatsRunsSaved.sort((a, b) => {
      if (parseInt(b.saved) !== parseInt(a.saved)) return parseInt(b.saved) - parseInt(a.saved);
      if (parseInt(b.innings) !== parseInt(a.innings)) return parseInt(a.innings) - parseInt(b.innings);
    });
    this.fieldingStatsRunsSaved = this.fieldingStatsRunsSaved.slice(0, this.numberOfPlayers);

    this.fieldingStatsDroppedCatches = data;
    this.fieldingStatsDroppedCatches.sort((a, b) => {
      if (parseInt(b.dropped) !== parseInt(a.dropped)) return parseInt(a.dropped) - parseInt(b.dropped);
      if (parseInt(b.innings) !== parseInt(a.innings)) return parseInt(b.innings) - parseInt(a.innings);
    });
    this.fieldingStatsDroppedCatches = this.fieldingStatsDroppedCatches.slice(0, this.numberOfPlayers);

    this.fieldingStatsRunsMissed = data;
    this.fieldingStatsRunsMissed.sort((a, b) => {
      if (parseInt(b.missed) !== parseInt(a.missed)) return parseInt(a.missed) - parseInt(b.missed);
      if (parseInt(b.innings) !== parseInt(a.innings)) return parseInt(b.innings) - parseInt(a.innings);
    });
    this.fieldingStatsRunsMissed = this.fieldingStatsRunsMissed.slice(0, this.numberOfPlayers);
    if(isRefresh) {
      this.setFieldingLeaderBoardContent();
    }
    

  }

  setBattingLeaderBoardContent() {
    this.players = [];
    if(this.deptOptionSelected == "Runs") {
      for (let i = 0; i < this.battingStatsRuns.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.battingStatsRuns[i].player;
        player.id = this.battingStatsRuns[i].playerId;
        player.value = this.battingStatsRuns[i].runs;
        player.valueLabel = "("+this.battingStatsRuns[i].balls+")";
        player.extraValue = "Matches : "+this.battingStatsRuns[i].matches +" | Inns :  "+this.battingStatsRuns[i].innings;
        player.img = "assets/player_images/"+this.battingStatsRuns[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Batting SR") {
      for (let i = 0; i < this.battingStatsStrikeRate.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.battingStatsStrikeRate[i].player;
        player.id = this.battingStatsStrikeRate[i].playerId;
        player.value = parseFloat(this.battingStatsStrikeRate[i].strikeRate).toFixed(2);
        player.extraValue = "Inns :  "+this.battingStatsStrikeRate[i].innings +" | Runs : "+this.battingStatsStrikeRate[i].runs;
        player.img = "assets/player_images/"+this.battingStatsStrikeRate[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Batting Average") {
      for (let i = 0; i < this.battingStatsAverage.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.battingStatsAverage[i].player;
        player.id = this.battingStatsAverage[i].playerId;
        player.value = parseFloat(this.battingStatsAverage[i].average).toFixed(2);
        player.extraValue = "Inns :  "+this.battingStatsAverage[i].innings +" | Runs : "+this.battingStatsAverage[i].runs;
        player.img = "assets/player_images/"+this.battingStatsAverage[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Batting Dots") {
      for (let i = 0; i < this.battingStatsDots.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.battingStatsDots[i].player;
        player.id = this.battingStatsDots[i].playerId;
        player.value = this.battingStatsDots[i].dotsPercentage+"%";
        player.extraValue = "Balls : "+this.battingStatsDots[i].balls +" | Dots :  "+this.battingStatsDots[i].dots;
        player.img = "assets/player_images/"+this.battingStatsDots[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    }
  }


  setBowlingLeaderBoardContent() {
    this.players = [];
    if(this.deptOptionSelected == "Wickets") {
      for (let i = 0; i < this.bowlingStatsWickets.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.bowlingStatsWickets[i].player;
        player.id = this.bowlingStatsWickets[i].playerId;
        player.value = this.bowlingStatsWickets[i].wickets;
        player.valueLabel = "("+this.bowlingStatsWickets[i].overs+")";
        player.extraValue = "Matches : "+this.bowlingStatsWickets[i].matches +" | Inns :  "+this.bowlingStatsWickets[i].innings;
        player.img = "assets/player_images/"+this.bowlingStatsWickets[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Bowling SR") {
      for (let i = 0; i < this.bowlingStatsStrikeRate.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.bowlingStatsStrikeRate[i].player;
        player.id = this.bowlingStatsStrikeRate[i].playerId;
        player.value = parseFloat(this.bowlingStatsStrikeRate[i].strikeRate).toFixed(2);
        player.extraValue = "Overs : "+this.bowlingStatsStrikeRate[i].overs +" | Wkts : "+this.bowlingStatsStrikeRate[i].wickets;
        player.img = "assets/player_images/"+this.bowlingStatsStrikeRate[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Bowling Average") {
      for (let i = 0; i < this.bowlingStatsAverage.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.bowlingStatsAverage[i].player;
        player.id = this.bowlingStatsAverage[i].playerId;
        player.value = parseFloat(this.bowlingStatsAverage[i].average).toFixed(2);
        player.extraValue = "Overs : "+this.bowlingStatsAverage[i].overs +" | Wkts : "+this.bowlingStatsAverage[i].wickets;
        player.img = "assets/player_images/"+this.bowlingStatsAverage[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Economy") {
      for (let i = 0; i < this.bowlingStatsEconomy.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.bowlingStatsEconomy[i].player;
        player.id = this.bowlingStatsEconomy[i].playerId;
        player.value = parseFloat(this.bowlingStatsEconomy[i].economy).toFixed(2);
        player.extraValue = "Overs : "+this.bowlingStatsEconomy[i].overs +" | Wkts : "+this.bowlingStatsEconomy[i].wickets;
        player.img = "assets/player_images/"+this.bowlingStatsEconomy[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Extras") {
      for (let i = 0; i < this.bowlingStatsExtras.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.bowlingStatsExtras[i].player;
        player.id = this.bowlingStatsExtras[i].playerId;
        player.value = this.bowlingStatsExtras[i].extrasPercentage +"%";
        player.extraValue = "Balls : "+this.bowlingStatsExtras[i].balls +" | Wds : "+this.bowlingStatsExtras[i].wides+" | NBs : "+this.bowlingStatsExtras[i].noBalls;
        player.img = "assets/player_images/"+this.bowlingStatsExtras[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    }
  }

  setFieldingLeaderBoardContent() {
    this.players = [];
    if(this.deptOptionSelected == "Catches/RO") {
      for (let i = 0; i < this.fieldingStatsCatches.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.fieldingStatsCatches[i].player;
        player.id = this.fieldingStatsCatches[i].playerId;
        player.value = this.fieldingStatsCatches[i].catches +"/"+this.fieldingStatsCatches[i].runOuts;
        player.valueLabel = "Catches/RO";
        player.extraValue = "Matches : "+this.fieldingStatsCatches[i].innings;
        player.img = "assets/player_images/"+this.fieldingStatsCatches[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Drop Catches") {
      for (let i = 0; i < this.fieldingStatsDroppedCatches.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.fieldingStatsDroppedCatches[i].player;
        player.id = this.fieldingStatsDroppedCatches[i].playerId;
        player.value = this.fieldingStatsDroppedCatches[i].dropped;
        player.extraValue = "Matches : "+this.fieldingStatsDroppedCatches[i].innings;
        player.img = "assets/player_images/"+this.fieldingStatsDroppedCatches[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Runs Saved") {
      for (let i = 0; i < this.fieldingStatsRunsSaved.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.fieldingStatsRunsSaved[i].player;
        player.id = this.fieldingStatsRunsSaved[i].playerId;
        player.value = this.fieldingStatsRunsSaved[i].saved;
        player.extraValue = "Matches : "+this.fieldingStatsRunsSaved[i].innings;
        player.img = "assets/player_images/"+this.fieldingStatsRunsSaved[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    } else if(this.deptOptionSelected == "Runs Missed") {
      for (let i = 0; i < this.fieldingStatsRunsMissed.length; i++) {
        let player = new Player(); 
        player.rank = i+1;
        player.name = this.fieldingStatsRunsMissed[i].player;
        player.id = this.fieldingStatsRunsMissed[i].playerId;
        player.value = this.fieldingStatsRunsMissed[i].missed;
        player.extraValue = "Matches : "+this.fieldingStatsRunsMissed[i].innings;
        player.img = "assets/player_images/"+this.fieldingStatsRunsMissed[i].playerId+".png";
        if(player.rank == 1) {
          player.medal = "assets/images/gold-medal.png";
        } else if(player.rank == 2) {
          player.medal = "assets/images/silver-medal.png";
        } else if(player.rank == 3) {
          player.medal = "assets/images/bronze-medal.png";
        }
        this.players.push(player);
      }
    }
  }

  openPopup(player: Player) {
    this.spinnerService.show();
    const id: number = Number(player.id);
    let team = "All Teams";
    if(this.teamOptions.find(t => t.teamId+'' === this.teamDropdownElement.nativeElement.value+'')) {
        team = this.teamOptions.find(t => t.teamId+'' === this.teamDropdownElement.nativeElement.value+'').teamName;
    }
    let matchStats : MatchStats[];
    if(team == 'All Teams') {
      if ('Batting' == this.deptSelected) {
       this.battingDetailsService.getBattingDetailsForPlayer(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'),id).subscribe(data =>{  
        matchStats = data.map(m => ({
          column1: m.matchDetails.matchDate,
          column2: m.runs !== 'DNB' ? (m.runs + (m.notOut === 'Y' ? "*": "") + '('+m.balls+')') : '-',
          column3: m.runs !== 'DNB' ? (m.strikeRate) : '-',
          column4: m.runs !== 'DNB' ? m.fours+'/'+m.sixes : '-',
          column5: m.runs !== 'DNB' ? m.dots : '-'
        }));
        this.openPopUp(matchStats, team, player, 'Date', 'Score', 'SR', '4s/6s','Dots');
      });
      } else if ('Bowling' == this.deptSelected) {
        this.bowlingDetailsService.getBowlingDetailsForPlayer(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'),id).subscribe(data =>{  
          matchStats = data.map(m => ({
            column1: m.matchDetails.matchDate,
            column2: m.overs !== 'DNB' ?  (m.overs+'-'+m.maidens+'-'+m.runs+'-'+m.wickets) : '-',
            column3: m.overs !== 'DNB' ? (m.economy) : '-',
            column4: m.overs !== 'DNB' ? (m.dots) : '-',
            column5: m.overs !== 'DNB' ? (m.wides+'/'+ m.noballs) : '-'
          }));
          this.openPopUp(matchStats, team, player, 'Date', 'O-M-R-W', 'Eco', 'Dots', 'Wd/Nb');
        });
      } else if ('Fielding' == this.deptSelected) {
        this.fieldingDetailsService.getFieldingDetailsForPlayer(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'),id).subscribe(data =>{  
          matchStats = data.map(m => ({
            column1: m.matchDetails.matchDate,
            column2: m.catches +'/'+m.runOuts,
            column3: m.runsSaved,
            column4: m.catchesDropped,
            column5: m.runsMissed,
          }));
          this.openPopUp(matchStats, team, player, 'Date', 'C/RO', 'Saved', 'Dropped', 'Missed');
        });
      }
    } else {
      if ('Batting' == this.deptSelected) {
        this.battingDetailsService.getBattingDetailsForPlayerTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'),id, this.teamDropdownElement.nativeElement.value).subscribe(data =>{  
          matchStats = data.map(m => ({
            column1: m.matchDetails.matchDate,
            column2: m.runs !== 'DNB' ? (m.runs + (m.notOut === 'Y' ? "*": "") + '('+m.balls+')') : '-',
            column3: m.runs !== 'DNB' ? (m.strikeRate) : '-',
            column4: m.runs !== 'DNB' ? m.fours+'/'+m.sixes : '-',
            column5: m.runs !== 'DNB' ? m.dots : '-'
          }));
          this.openPopUp(matchStats, team, player, 'Date', 'Score', 'SR', '4s/6s', 'Dots');
        });
       } else if ('Bowling' == this.deptSelected) {
        this.bowlingDetailsService.getBowlingDetailsForPlayerTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'),id,this.teamDropdownElement.nativeElement.value).subscribe(data =>{  
          matchStats = data.map(m => ({
            column1: m.matchDetails.matchDate,
            column2: m.overs !== 'DNB' ?  (m.overs+'-'+m.maidens+'-'+m.runs+'-'+m.wickets) : '-',
            column3: m.overs !== 'DNB' ? (m.economy) : '-',
            column4: m.overs !== 'DNB' ? (m.dots) : '-',
            column5: m.overs !== 'DNB' ? (m.wides+'/'+ m.noballs) : '-'
          }));
          this.openPopUp(matchStats, team, player, 'Date', 'O-M-R-W', 'Eco', 'Dots', 'Wd/Nb');
        });
       } else if ('Fielding' == this.deptSelected) {
        this.fieldingDetailsService.getFieldingDetailsForPlayerTeam(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'),id,this.teamDropdownElement.nativeElement.value).subscribe(data =>{  
          matchStats = data.map(m => ({
            column1: m.matchDetails.matchDate,
            column2: m.catches +'/'+m.runOuts,
            column3: m.runsSaved,
            column4: m.catchesDropped,
            column5: m.runsMissed,
          }));
          this.openPopUp(matchStats, team, player, 'Date', 'C/RO', 'Saved', 'Dropped', 'Missed');
        });
       }
    }
  }

  openPopUp(matchStats, team, player,header1,header2,header3,header4, header5) {
    matchStats.sort((a, b) => {
      const dateA = new Date(a.column1).getTime();
      const dateB = new Date(b.column1).getTime();
      return dateB - dateA;
    })
    const dialogRef = this.dialog.open(StatsPopupComponent, {
      width: '950px',
      maxWidth: '95vw',
      position: { top: '70px' },
      data: {
        matchStats : matchStats,
        header1: header1,
        header2: header2,
        header3: header3,
        header4: header4,
        header5: header5,
        team: team,
        from: this.startDate,
        to: this.endDate,
        playerimage: player.img,
        playerName: player.name
      },
    });

    this.spinnerService.hide();
  }
}