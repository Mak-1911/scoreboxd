import { db } from '@/db';
import { reviews } from '@/db/schema';

async function main() {
    const sampleReviews = [
        {
            user_id: 1,
            event_id: 1,
            rating: 5,
            content: 'Amazing game! The atmosphere was electric and the finish was incredible. Both teams played their hearts out and gave us a thrilling match to remember.',
            spoiler: 0,
            created_at: new Date('2024-01-15T14:30:00').toISOString(),
        },
        {
            user_id: 2,
            event_id: 3,
            rating: 5,
            content: 'Best game of the season! The intensity never dropped and every possession mattered. Absolutely worth attending live.',
            spoiler: 0,
            created_at: new Date('2024-01-16T18:45:00').toISOString(),
        },
        {
            user_id: 3,
            event_id: 5,
            rating: 5,
            content: 'Spectacular performance from both sides. The crowd was on their feet the entire game. This is why we love sports!',
            spoiler: 1,
            created_at: new Date('2024-01-18T20:15:00').toISOString(),
        },
        {
            user_id: 4,
            event_id: 7,
            rating: 5,
            content: 'Unforgettable experience! The team chemistry was phenomenal and the execution was flawless. One for the history books.',
            spoiler: 0,
            created_at: new Date('2024-01-20T16:00:00').toISOString(),
        },
        {
            user_id: 5,
            event_id: 9,
            rating: 5,
            content: 'Absolutely thrilling from start to finish. Every moment kept you guessing. The fans got their money\'s worth and then some.',
            spoiler: 0,
            created_at: new Date('2024-01-22T19:30:00').toISOString(),
        },
        {
            user_id: 1,
            event_id: 2,
            rating: 4,
            content: 'Solid match overall but the ending was a bit anticlimactic. Still enjoyed watching the game and the teams showed great effort.',
            spoiler: 0,
            created_at: new Date('2024-01-17T15:20:00').toISOString(),
        },
        {
            user_id: 2,
            event_id: 4,
            rating: 4,
            content: 'Good game with some exciting moments. A few mistakes here and there but nothing major. Worth the ticket price.',
            spoiler: 0,
            created_at: new Date('2024-01-19T17:45:00').toISOString(),
        },
        {
            user_id: 3,
            event_id: 6,
            rating: 4,
            content: 'Pretty good performance despite some rough patches in the middle. The finish made up for the slower parts.',
            spoiler: 1,
            created_at: new Date('2024-01-21T14:10:00').toISOString(),
        },
        {
            user_id: 4,
            event_id: 8,
            rating: 4,
            content: 'Entertaining game with strong plays from both teams. Could have been better but still a fun night out.',
            spoiler: 0,
            created_at: new Date('2024-01-23T20:00:00').toISOString(),
        },
        {
            user_id: 5,
            event_id: 11,
            rating: 3,
            content: 'Decent game but expected more from these two teams. Some good moments but overall just average.',
            spoiler: 0,
            created_at: new Date('2024-01-24T16:30:00').toISOString(),
        },
        {
            user_id: 1,
            event_id: 13,
            rating: 3,
            content: 'Okay experience. Nothing particularly memorable but not terrible either. Middle of the road performance.',
            spoiler: 0,
            created_at: new Date('2024-01-25T18:15:00').toISOString(),
        },
        {
            user_id: 2,
            event_id: 15,
            rating: 3,
            content: 'Average game overall. Had its moments but lacked the excitement I was hoping for. Not bad, just not great.',
            spoiler: 0,
            created_at: new Date('2024-01-26T19:45:00').toISOString(),
        },
        {
            user_id: 3,
            event_id: 17,
            rating: 2,
            content: 'Disappointing performance from both sides. Expected much better given the hype leading up to this match.',
            spoiler: 0,
            created_at: new Date('2024-01-27T15:00:00').toISOString(),
        },
        {
            user_id: 4,
            event_id: 19,
            rating: 2,
            content: 'Below average game with too many mistakes. The teams seemed unprepared and it showed throughout.',
            spoiler: 0,
            created_at: new Date('2024-01-28T17:20:00').toISOString(),
        },
        {
            user_id: 5,
            event_id: 20,
            rating: 1,
            content: 'Terrible game. Both teams played poorly and there was zero entertainment value. Complete waste of time and money.',
            spoiler: 0,
            created_at: new Date('2024-01-29T20:30:00').toISOString(),
        },
    ];

    await db.insert(reviews).values(sampleReviews);
    
    console.log('✅ Reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});