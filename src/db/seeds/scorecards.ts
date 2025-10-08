import { db } from '@/db';
import { scorecards } from '@/db/schema';

async function main() {
    const sampleScorecards = [
        // Cricket scorecards (Event IDs 1, 2, 3)
        {
            eventId: 1,
            sport: 'Cricket',
            finalScore: 'India 571 & 152/3, Australia 487 & 234/6d',
            additionalData: {
                venue: 'Melbourne Cricket Ground',
                attendance: 85247,
                weather: 'Sunny, 28°C',
                duration: '5 days',
                matchType: 'Test Match',
                result: 'India won by 7 wickets',
                toss: 'Australia won toss and elected to bat',
                umpires: ['Simon Taufel', 'Aleem Dar']
            },
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            eventId: 2,
            sport: 'Cricket',
            finalScore: 'England 286/9 (50 overs), Pakistan 283 all out (49.3 overs)',
            additionalData: {
                venue: 'Lords Cricket Ground',
                attendance: 28000,
                weather: 'Overcast, 18°C',
                duration: '7 hours 42 minutes',
                matchType: 'ODI',
                result: 'England won by 3 runs',
                toss: 'Pakistan won toss and elected to field',
                playerOfMatch: 'Joe Root - 89 runs, 2 wickets'
            },
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            eventId: 3,
            sport: 'Cricket',
            finalScore: 'South Africa 198/5 (20 overs), West Indies 195/8 (20 overs)',
            additionalData: {
                venue: 'Wanderers Stadium',
                attendance: 24500,
                weather: 'Clear, 25°C',
                duration: '3 hours 28 minutes',
                matchType: 'T20',
                result: 'South Africa won by 3 runs',
                toss: 'West Indies won toss and elected to bowl',
                playerOfMatch: 'Quinton de Kock - 78 runs off 42 balls'
            },
            createdAt: new Date('2024-01-20').toISOString(),
        },
        // F1 scorecards (Event IDs 9, 10, 11)
        {
            eventId: 9,
            sport: 'F1',
            finalScore: '1st: Verstappen 1:28:56.431, 2nd: Hamilton +3.164s, 3rd: Norris +8.245s',
            additionalData: {
                circuit: 'Albert Park Circuit',
                attendance: 110000,
                weather: 'Clear, 24°C',
                laps: 58,
                fastestLap: 'Verstappen - 1:22.456 (Lap 42)',
                polePosition: 'Verstappen - 1:16.732',
                retirements: 2,
                safetyCarPeriods: 1
            },
            createdAt: new Date('2024-01-25').toISOString(),
        },
        {
            eventId: 10,
            sport: 'F1',
            finalScore: '1st: Leclerc 1:32:45.678, 2nd: Sainz +2.891s, 3rd: Russell +12.456s',
            additionalData: {
                circuit: 'Monaco Circuit',
                attendance: 95000,
                weather: 'Sunny, 27°C',
                laps: 78,
                fastestLap: 'Leclerc - 1:12.345 (Lap 56)',
                polePosition: 'Leclerc - 1:10.921',
                retirements: 3,
                safetyCarPeriods: 2
            },
            createdAt: new Date('2024-01-28').toISOString(),
        },
        {
            eventId: 11,
            sport: 'F1',
            finalScore: '1st: Hamilton 1:25:34.123, 2nd: Verstappen +1.234s, 3rd: Perez +18.567s',
            additionalData: {
                circuit: 'Silverstone Circuit',
                attendance: 142000,
                weather: 'Partly cloudy, 21°C',
                laps: 52,
                fastestLap: 'Hamilton - 1:27.097 (Lap 48)',
                polePosition: 'Hamilton - 1:24.303',
                retirements: 1,
                safetyCarPeriods: 0
            },
            createdAt: new Date('2024-02-01').toISOString(),
        },
        // Basketball scorecards
        {
            eventId: 17,
            sport: 'Basketball',
            finalScore: 'Lakers 108 - 102 Warriors',
            additionalData: {
                venue: 'Crypto.com Arena',
                attendance: 18997,
                weather: 'Indoor',
                quarter1: '28-26 Lakers',
                quarter2: '24-28 Warriors',
                quarter3: '30-22 Lakers',
                quarter4: '26-26 Tie',
                topScorer: 'LeBron James - 32 points',
                rebounds: 'Anthony Davis - 14 rebounds',
                assists: 'D\'Angelo Russell - 9 assists'
            },
            createdAt: new Date('2024-02-05').toISOString(),
        },
        {
            eventId: 18,
            sport: 'Basketball',
            finalScore: 'Celtics 115 - 110 Heat (OT)',
            additionalData: {
                venue: 'TD Garden',
                attendance: 19156,
                weather: 'Indoor',
                quarter1: '27-29 Heat',
                quarter2: '26-24 Celtics',
                quarter3: '28-28 Tie',
                quarter4: '26-26 Tie',
                overtime: '8-3 Celtics',
                topScorer: 'Jayson Tatum - 38 points',
                rebounds: 'Bam Adebayo - 15 rebounds',
                assists: 'Marcus Smart - 11 assists'
            },
            createdAt: new Date('2024-02-08').toISOString(),
        },
        {
            eventId: 19,
            sport: 'Basketball',
            finalScore: 'Bucks 122 - 118 Suns',
            additionalData: {
                venue: 'Fiserv Forum',
                attendance: 17341,
                weather: 'Indoor',
                quarter1: '32-30 Bucks',
                quarter2: '28-31 Suns',
                quarter3: '34-28 Bucks',
                quarter4: '28-29 Suns',
                topScorer: 'Giannis Antetokounmpo - 41 points',
                rebounds: 'Giannis Antetokounmpo - 17 rebounds',
                assists: 'Damian Lillard - 10 assists'
            },
            createdAt: new Date('2024-02-10').toISOString(),
        },
        // Soccer scorecards
        {
            eventId: 20,
            sport: 'Soccer',
            finalScore: 'Manchester United 3 - 1 Arsenal',
            additionalData: {
                venue: 'Old Trafford',
                attendance: 74310,
                weather: 'Rainy, 12°C',
                possession: '52% - 48%',
                shots: '15 - 12',
                shotsOnTarget: '8 - 6',
                corners: '7 - 9',
                fouls: '11 - 14',
                yellowCards: '2 - 3',
                redCards: '0 - 0',
                goalScorers: 'Rashford 23\', 67\', Fernandes 45+2\' / Saka 78\''
            },
            createdAt: new Date('2024-02-12').toISOString(),
        },
        {
            eventId: 21,
            sport: 'Soccer',
            finalScore: 'Barcelona 4 - 2 Real Madrid',
            additionalData: {
                venue: 'Camp Nou',
                attendance: 99354,
                weather: 'Clear, 22°C',
                possession: '58% - 42%',
                shots: '18 - 11',
                shotsOnTarget: '10 - 7',
                corners: '9 - 5',
                fouls: '13 - 17',
                yellowCards: '3 - 4',
                redCards: '0 - 1',
                goalScorers: 'Lewandowski 12\', 34\', Gavi 56\', Raphinha 82\' / Benzema 29\', Vinicius 71\''
            },
            createdAt: new Date('2024-02-15').toISOString(),
        },
        {
            eventId: 22,
            sport: 'Soccer',
            finalScore: 'Liverpool 2 - 2 Chelsea',
            additionalData: {
                venue: 'Anfield',
                attendance: 53394,
                weather: 'Cloudy, 15°C',
                possession: '54% - 46%',
                shots: '14 - 13',
                shotsOnTarget: '7 - 7',
                corners: '8 - 6',
                fouls: '12 - 15',
                yellowCards: '2 - 2',
                redCards: '0 - 0',
                goalScorers: 'Salah 18\', Diaz 63\' / Sterling 41\', Jackson 77\''
            },
            createdAt: new Date('2024-02-18').toISOString(),
        },
        // Baseball scorecards
        {
            eventId: 23,
            sport: 'Baseball',
            finalScore: 'Red Sox 7 - 5 Yankees (11 innings)',
            additionalData: {
                venue: 'Fenway Park',
                attendance: 37731,
                weather: 'Partly cloudy, 72°F',
                innings: 11,
                hits: '12 - 10',
                errors: '1 - 2',
                homeRuns: '2 - 1',
                strikeouts: '14 - 11',
                walks: '6 - 5',
                winningPitcher: 'John Schreiber',
                losingPitcher: 'Clay Holmes',
                save: 'None'
            },
            createdAt: new Date('2024-02-20').toISOString(),
        },
        {
            eventId: 24,
            sport: 'Baseball',
            finalScore: 'Dodgers 8 - 3 Giants',
            additionalData: {
                venue: 'Dodger Stadium',
                attendance: 52048,
                weather: 'Clear, 78°F',
                innings: 9,
                hits: '14 - 7',
                errors: '0 - 1',
                homeRuns: '3 - 1',
                strikeouts: '12 - 8',
                walks: '4 - 6',
                winningPitcher: 'Clayton Kershaw',
                losingPitcher: 'Logan Webb',
                save: 'Evan Phillips'
            },
            createdAt: new Date('2024-02-22').toISOString(),
        },
        // Football scorecards
        {
            eventId: 25,
            sport: 'Football',
            finalScore: 'Chiefs 31 - 28 Bills',
            additionalData: {
                venue: 'Arrowhead Stadium',
                attendance: 76416,
                weather: 'Cold, 28°F',
                totalYards: '425 - 398',
                passingYards: '342 - 301',
                rushingYards: '83 - 97',
                turnovers: '1 - 2',
                sacks: '3 - 2',
                thirdDownConversions: '8/14 - 7/13',
                timeOfPossession: '31:24 - 28:36',
                mvp: 'Patrick Mahomes - 4 TD passes'
            },
            createdAt: new Date('2024-02-24').toISOString(),
        },
        {
            eventId: 26,
            sport: 'Football',
            finalScore: 'Cowboys 35 - 21 Eagles',
            additionalData: {
                venue: 'AT&T Stadium',
                attendance: 93594,
                weather: 'Indoor dome',
                totalYards: '456 - 367',
                passingYards: '328 - 289',
                rushingYards: '128 - 78',
                turnovers: '0 - 3',
                sacks: '4 - 1',
                thirdDownConversions: '9/15 - 5/12',
                timeOfPossession: '33:12 - 26:48',
                mvp: 'Dak Prescott - 3 TD passes, 0 INT'
            },
            createdAt: new Date('2024-02-26').toISOString(),
        },
        // Hockey scorecards
        {
            eventId: 27,
            sport: 'Hockey',
            finalScore: 'Maple Leafs 4 - 3 Bruins (OT)',
            additionalData: {
                venue: 'Scotiabank Arena',
                attendance: 18819,
                weather: 'Indoor',
                periods: '1-1, 1-1, 1-1, 1-0',
                shots: '32 - 28',
                powerPlays: '1/3 - 2/4',
                penalties: '6 minutes - 8 minutes',
                faceoffWins: '31 - 28',
                hits: '24 - 29',
                blockedShots: '15 - 18',
                goalScorers: 'Matthews 2, Marner, Nylander / Pastrnak 2, Marchand',
                gameWinner: 'Auston Matthews (OT)'
            },
            createdAt: new Date('2024-02-28').toISOString(),
        },
        {
            eventId: 28,
            sport: 'Hockey',
            finalScore: 'Avalanche 5 - 2 Lightning',
            additionalData: {
                venue: 'Ball Arena',
                attendance: 18086,
                weather: 'Indoor',
                periods: '2-0, 2-1, 1-1',
                shots: '38 - 26',
                powerPlays: '2/5 - 1/3',
                penalties: '10 minutes - 6 minutes',
                faceoffWins: '34 - 25',
                hits: '28 - 22',
                blockedShots: '12 - 19',
                goalScorers: 'MacKinnon 2, Rantanen, Makar, Nichushkin / Kucherov, Stamkos',
                gameWinner: 'Nathan MacKinnon'
            },
            createdAt: new Date('2024-03-01').toISOString(),
        },
        // Tennis scorecards
        {
            eventId: 29,
            sport: 'Tennis',
            finalScore: 'Djokovic def. Nadal 6-4, 3-6, 7-6(5), 6-2',
            additionalData: {
                venue: 'Rod Laver Arena',
                attendance: 15000,
                weather: 'Clear, 26°C',
                duration: '3h 42m',
                aces: '18 - 12',
                doubleFaults: '3 - 5',
                firstServePercentage: '68% - 64%',
                breakPointsWon: '6/12 - 4/9',
                totalPoints: '142 - 128',
                winners: '52 - 41',
                unforcedErrors: '28 - 35',
                tournament: 'Australian Open',
                round: 'Final'
            },
            createdAt: new Date('2024-03-03').toISOString(),
        },
        {
            eventId: 30,
            sport: 'Tennis',
            finalScore: 'Swiatek def. Sabalenka 6-3, 6-4',
            additionalData: {
                venue: 'Court Philippe-Chatrier',
                attendance: 15000,
                weather: 'Sunny, 24°C',
                duration: '1h 48m',
                aces: '5 - 8',
                doubleFaults: '2 - 4',
                firstServePercentage: '71% - 63%',
                breakPointsWon: '5/8 - 2/6',
                totalPoints: '88 - 72',
                winners: '28 - 24',
                unforcedErrors: '15 - 22',
                tournament: 'French Open',
                round: 'Final'
            },
            createdAt: new Date('2024-03-05').toISOString(),
        },
    ];

    await db.insert(scorecards).values(sampleScorecards);
    
    console.log('✅ Scorecards seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});