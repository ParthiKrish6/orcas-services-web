import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'bar-chart',
                loadChildren: () => import('./bar-chart/bar-chart.module').then((m) => m.BarChartModule)
            },
            {
                path: 'upload-scorecard',
                loadChildren: () => import('./../upload-scorecard/upload-scorecard.module').then((m) => m.UploadScoreCardModule)
            },
            {
                path: 'calendar-details',
                loadChildren: () => import('./../calendar-details/calendar-details.module').then((m) => m.CalendarDetailsModule)
            },
            {
                path: 'team-details',
                loadChildren: () => import('./../team-details/team-details.module').then((m) => m.TeamDetailsModule)
            },
            {
                path: 'player-details',
                loadChildren: () => import('./../player-details/player-details.module').then((m) => m.PlayerDetailsModule)
            },
            {
                path: 'match-details',
                loadChildren: () => import('./../match-details/match-details.module').then((m) => m.MatchDetailsModule)
            },
            {
                path: 'batting-details',
                loadChildren: () => import('./../batting-details/batting-details.module').then((m) => m.BattingDetailsModule)
            },
            {
                path: 'bowling-details',
                loadChildren: () => import('./../bowling-details/bowling-details.module').then((m) => m.BowlingDetailsModule)
            },
            {
                path: 'fielding-details',
                loadChildren: () => import('./../fielding-details/fielding-details.module').then((m) => m.FieldingDetailsModule)
            },
            {
                path: 'batting-stats',
                loadChildren: () => import('./../batting-stats/batting-stats.module').then((m) => m.BattingStatsModule)
            },
            {
                path: 'bowling-stats',
                loadChildren: () => import('./../bowling-stats/bowling-stats.module').then((m) => m.BowlingStatsModule)
            },
            {
                path: 'fielding-stats',
                loadChildren: () => import('./../fielding-stats/fielding-stats.module').then((m) => m.FieldingStatsModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
