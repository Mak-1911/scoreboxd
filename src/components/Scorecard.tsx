"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Timer, Target } from "lucide-react";

interface PlayerStat {
  id: number;
  scorecardId: number;
  playerName: string;
  teamName: string | null;
  position: number | null;
  stats: any;
  createdAt: string;
}

interface ScorecardData {
  id: number;
  eventId: number;
  sport: string;
  finalScore: string;
  additionalData: any;
  createdAt: string;
  playerStats: PlayerStat[];
}

interface ScorecardProps {
  scorecard: ScorecardData;
}

export default function Scorecard({ scorecard }: ScorecardProps) {
  const { sport, finalScore, additionalData, playerStats } = scorecard;

  // Group players by team for team sports
  const teams = playerStats.reduce((acc, player) => {
    const team = player.teamName || "Individual";
    if (!acc[team]) acc[team] = [];
    acc[team].push(player);
    return acc;
  }, {} as Record<string, PlayerStat[]>);

  // Sort players by position
  Object.keys(teams).forEach(team => {
    teams[team].sort((a, b) => {
      if (a.position === null) return 1;
      if (b.position === null) return -1;
      return a.position - b.position;
    });
  });

  return (
    <div className="space-y-6">
      {/* Final Score Card */}
      <Card className="border-2 border-border bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange" />
            <CardTitle className="text-xl">Final Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold bg-gradient-to-r from-orange via-green to-blue bg-clip-text text-transparent">
            {finalScore}
          </p>
          {additionalData && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {additionalData.venue && (
                <div>
                  <p className="text-muted-foreground">Venue</p>
                  <p className="font-semibold">{additionalData.venue}</p>
                </div>
              )}
              {additionalData.attendance && (
                <div>
                  <p className="text-muted-foreground">Attendance</p>
                  <p className="font-semibold">{additionalData.attendance.toLocaleString()}</p>
                </div>
              )}
              {additionalData.weather && (
                <div>
                  <p className="text-muted-foreground">Weather</p>
                  <p className="font-semibold">{additionalData.weather}</p>
                </div>
              )}
              {additionalData.duration && (
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-semibold">{additionalData.duration}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Stats */}
      {sport === "Cricket" && <CricketScorecard teams={teams} />}
      {sport === "F1" && <F1Scorecard playerStats={playerStats} />}
      {sport === "Basketball" && <BasketballScorecard teams={teams} />}
      {sport === "Soccer" && <SoccerScorecard teams={teams} />}
      {sport === "Baseball" && <BaseballScorecard teams={teams} />}
      {sport === "Football" && <FootballScorecard teams={teams} />}
      {sport === "Hockey" && <HockeyScorecard teams={teams} />}
      {sport === "Tennis" && <TennisScorecard playerStats={playerStats} />}
    </div>
  );
}

// Cricket Scorecard Component
function CricketScorecard({ teams }: { teams: Record<string, PlayerStat[]> }) {
  return (
    <div className="space-y-6">
      {Object.entries(teams).map(([teamName, players]) => (
        <Card key={teamName} className="border-2 border-border bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green" />
                <CardTitle className="text-lg">{teamName}</CardTitle>
              </div>
              <Badge variant="secondary">{players.length} Players</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-sm">Pos</th>
                    <th className="text-left p-3 font-semibold text-sm">Player</th>
                    <th className="text-left p-3 font-semibold text-sm">Role</th>
                    <th className="text-right p-3 font-semibold text-sm">Runs</th>
                    <th className="text-right p-3 font-semibold text-sm">Balls</th>
                    <th className="text-right p-3 font-semibold text-sm">4s</th>
                    <th className="text-right p-3 font-semibold text-sm">6s</th>
                    <th className="text-right p-3 font-semibold text-sm">Wkts</th>
                    <th className="text-right p-3 font-semibold text-sm">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, idx) => (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 text-sm text-muted-foreground">{player.position || idx + 1}</td>
                      <td className="p-3 font-medium">{player.playerName}</td>
                      <td className="p-3 text-sm text-muted-foreground">{player.stats.role}</td>
                      <td className="p-3 text-right font-semibold">{player.stats.runsScored}</td>
                      <td className="p-3 text-right text-muted-foreground text-sm">{player.stats.ballsFaced}</td>
                      <td className="p-3 text-right text-sm">{player.stats.fours}</td>
                      <td className="p-3 text-right text-sm">{player.stats.sixes}</td>
                      <td className="p-3 text-right text-sm">{player.stats.wicketsTaken}</td>
                      <td className="p-3 text-right text-sm">{player.stats.economy?.toFixed(2) || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// F1 Scorecard Component
function F1Scorecard({ playerStats }: { playerStats: PlayerStat[] }) {
  const sortedDrivers = [...playerStats].sort((a, b) => {
    if (a.position === null) return 1;
    if (b.position === null) return -1;
    return a.position - b.position;
  });

  return (
    <Card className="border-2 border-border bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue" />
          <CardTitle className="text-lg">Race Results - {sortedDrivers.length} Drivers</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold text-sm">Pos</th>
                <th className="text-left p-3 font-semibold text-sm">Driver</th>
                <th className="text-left p-3 font-semibold text-sm">Team</th>
                <th className="text-right p-3 font-semibold text-sm">Time</th>
                <th className="text-right p-3 font-semibold text-sm">Points</th>
                <th className="text-right p-3 font-semibold text-sm">Laps</th>
                <th className="text-left p-3 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedDrivers.map((driver) => {
                const isPodium = driver.position && driver.position <= 3;
                const positionColor = 
                  driver.position === 1 ? "text-yellow-500" :
                  driver.position === 2 ? "text-gray-400" :
                  driver.position === 3 ? "text-orange-600" : "";
                
                return (
                  <tr key={driver.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${isPodium ? 'bg-muted/10' : ''}`}>
                    <td className={`p-3 font-bold ${positionColor}`}>{driver.position || "-"}</td>
                    <td className="p-3 font-medium">{driver.playerName}</td>
                    <td className="p-3 text-sm text-muted-foreground">{driver.stats.team}</td>
                    <td className="p-3 text-right font-mono text-sm">{driver.stats.time}</td>
                    <td className="p-3 text-right font-semibold">{driver.stats.points}</td>
                    <td className="p-3 text-right text-sm text-muted-foreground">{driver.stats.lapsCompleted}</td>
                    <td className="p-3 text-sm">
                      <Badge variant={driver.stats.status === "Finished" ? "secondary" : "destructive"} className="text-xs">
                        {driver.stats.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Basketball Scorecard Component
function BasketballScorecard({ teams }: { teams: Record<string, PlayerStat[]> }) {
  return (
    <div className="space-y-6">
      {Object.entries(teams).map(([teamName, players]) => (
        <Card key={teamName} className="border-2 border-border bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange" />
              <CardTitle className="text-lg">{teamName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-sm">Player</th>
                    <th className="text-right p-3 font-semibold text-sm">PTS</th>
                    <th className="text-right p-3 font-semibold text-sm">REB</th>
                    <th className="text-right p-3 font-semibold text-sm">AST</th>
                    <th className="text-right p-3 font-semibold text-sm">STL</th>
                    <th className="text-right p-3 font-semibold text-sm">BLK</th>
                    <th className="text-right p-3 font-semibold text-sm">MIN</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{player.playerName}</td>
                      <td className="p-3 text-right font-bold">{player.stats.points}</td>
                      <td className="p-3 text-right">{player.stats.rebounds}</td>
                      <td className="p-3 text-right">{player.stats.assists}</td>
                      <td className="p-3 text-right text-sm">{player.stats.steals}</td>
                      <td className="p-3 text-right text-sm">{player.stats.blocks}</td>
                      <td className="p-3 text-right text-sm text-muted-foreground">{player.stats.minutes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Soccer Scorecard Component
function SoccerScorecard({ teams }: { teams: Record<string, PlayerStat[]> }) {
  return (
    <div className="space-y-6">
      {Object.entries(teams).map(([teamName, players]) => (
        <Card key={teamName} className="border-2 border-border bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green" />
              <CardTitle className="text-lg">{teamName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-sm">Player</th>
                    <th className="text-left p-3 font-semibold text-sm">Pos</th>
                    <th className="text-right p-3 font-semibold text-sm">Goals</th>
                    <th className="text-right p-3 font-semibold text-sm">Assists</th>
                    <th className="text-right p-3 font-semibold text-sm">Shots</th>
                    <th className="text-right p-3 font-semibold text-sm">Passes</th>
                    <th className="text-right p-3 font-semibold text-sm">Tackles</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{player.playerName}</td>
                      <td className="p-3 text-sm text-muted-foreground">{player.stats.position}</td>
                      <td className="p-3 text-right font-bold">{player.stats.goals}</td>
                      <td className="p-3 text-right">{player.stats.assists}</td>
                      <td className="p-3 text-right text-sm">{player.stats.shots}</td>
                      <td className="p-3 text-right text-sm">{player.stats.passes}</td>
                      <td className="p-3 text-right text-sm">{player.stats.tackles}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Baseball Scorecard Component
function BaseballScorecard({ teams }: { teams: Record<string, PlayerStat[]> }) {
  return (
    <div className="space-y-6">
      {Object.entries(teams).map(([teamName, players]) => (
        <Card key={teamName} className="border-2 border-border bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue" />
              <CardTitle className="text-lg">{teamName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-sm">Player</th>
                    <th className="text-left p-3 font-semibold text-sm">Pos</th>
                    <th className="text-right p-3 font-semibold text-sm">AB</th>
                    <th className="text-right p-3 font-semibold text-sm">H</th>
                    <th className="text-right p-3 font-semibold text-sm">R</th>
                    <th className="text-right p-3 font-semibold text-sm">RBI</th>
                    <th className="text-right p-3 font-semibold text-sm">HR</th>
                    <th className="text-right p-3 font-semibold text-sm">AVG</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{player.playerName}</td>
                      <td className="p-3 text-sm text-muted-foreground">{player.stats.position}</td>
                      <td className="p-3 text-right">{player.stats.atBats}</td>
                      <td className="p-3 text-right font-semibold">{player.stats.hits}</td>
                      <td className="p-3 text-right">{player.stats.runs}</td>
                      <td className="p-3 text-right">{player.stats.rbis}</td>
                      <td className="p-3 text-right font-bold">{player.stats.homeRuns}</td>
                      <td className="p-3 text-right text-sm">{player.stats.battingAvg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Football Scorecard Component
function FootballScorecard({ teams }: { teams: Record<string, PlayerStat[]> }) {
  return (
    <div className="space-y-6">
      {Object.entries(teams).map(([teamName, players]) => (
        <Card key={teamName} className="border-2 border-border bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange" />
              <CardTitle className="text-lg">{teamName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-sm">Player</th>
                    <th className="text-left p-3 font-semibold text-sm">Pos</th>
                    <th className="text-right p-3 font-semibold text-sm">Pass Yds</th>
                    <th className="text-right p-3 font-semibold text-sm">Rush Yds</th>
                    <th className="text-right p-3 font-semibold text-sm">Rec Yds</th>
                    <th className="text-right p-3 font-semibold text-sm">TDs</th>
                    <th className="text-right p-3 font-semibold text-sm">Tackles</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{player.playerName}</td>
                      <td className="p-3 text-sm text-muted-foreground">{player.stats.position}</td>
                      <td className="p-3 text-right">{player.stats.passingYards || "-"}</td>
                      <td className="p-3 text-right">{player.stats.rushingYards || "-"}</td>
                      <td className="p-3 text-right">{player.stats.receivingYards || "-"}</td>
                      <td className="p-3 text-right font-bold">{player.stats.touchdowns || "-"}</td>
                      <td className="p-3 text-right text-sm">{player.stats.tackles || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Hockey Scorecard Component
function HockeyScorecard({ teams }: { teams: Record<string, PlayerStat[]> }) {
  return (
    <div className="space-y-6">
      {Object.entries(teams).map(([teamName, players]) => (
        <Card key={teamName} className="border-2 border-border bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue" />
              <CardTitle className="text-lg">{teamName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-sm">Player</th>
                    <th className="text-left p-3 font-semibold text-sm">Pos</th>
                    <th className="text-right p-3 font-semibold text-sm">G</th>
                    <th className="text-right p-3 font-semibold text-sm">A</th>
                    <th className="text-right p-3 font-semibold text-sm">Pts</th>
                    <th className="text-right p-3 font-semibold text-sm">+/-</th>
                    <th className="text-right p-3 font-semibold text-sm">Shots</th>
                    <th className="text-right p-3 font-semibold text-sm">PIM</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{player.playerName}</td>
                      <td className="p-3 text-sm text-muted-foreground">{player.stats.position}</td>
                      <td className="p-3 text-right font-bold">{player.stats.goals}</td>
                      <td className="p-3 text-right">{player.stats.assists}</td>
                      <td className="p-3 text-right font-semibold">{(player.stats.goals || 0) + (player.stats.assists || 0)}</td>
                      <td className="p-3 text-right text-sm">{player.stats.plusMinus}</td>
                      <td className="p-3 text-right text-sm">{player.stats.shots}</td>
                      <td className="p-3 text-right text-sm">{player.stats.penaltyMinutes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Tennis Scorecard Component
function TennisScorecard({ playerStats }: { playerStats: PlayerStat[] }) {
  return (
    <Card className="border-2 border-border bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-green" />
          <CardTitle className="text-lg">Match Statistics</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold text-sm">Player</th>
                <th className="text-right p-3 font-semibold text-sm">Aces</th>
                <th className="text-right p-3 font-semibold text-sm">D.Faults</th>
                <th className="text-right p-3 font-semibold text-sm">1st Serve %</th>
                <th className="text-right p-3 font-semibold text-sm">Winners</th>
                <th className="text-right p-3 font-semibold text-sm">Errors</th>
                <th className="text-right p-3 font-semibold text-sm">Total Pts</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.map((player) => (
                <tr key={player.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-medium">{player.playerName}</td>
                  <td className="p-3 text-right font-semibold">{player.stats.aces}</td>
                  <td className="p-3 text-right">{player.stats.doubleFaults}</td>
                  <td className="p-3 text-right text-sm">{player.stats.firstServePercentage}</td>
                  <td className="p-3 text-right">{player.stats.winners}</td>
                  <td className="p-3 text-right text-sm text-muted-foreground">{player.stats.unforcedErrors}</td>
                  <td className="p-3 text-right font-bold">{player.stats.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}