import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            email: 'john.smith@example.com',
            username: 'sportsf4n',
            password: '$2a$10$rXQvMQZ4kEp9wKX7jYjGXuPxV8yN3H7aM5tF2qR9sL6nK8oD4vB1m',
            name: 'John Smith',
            bio: 'Lakers fan since 2010. Love watching NBA playoffs and following Lebron.',
            avatar: 'https://i.pravatar.cc/150?img=1',
            location: 'Los Angeles, CA',
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            email: 'sarah.jones@gmail.com',
            username: 'hoopsdreams',
            password: '$2a$10$rXQvMQZ4kEp9wKX7jYjGXuPxV8yN3H7aM5tF2qR9sL6nK8oD4vB1m',
            name: 'Sarah Jones',
            bio: 'Love watching EPL matches every weekend. Arsenal till I die!',
            avatar: 'https://i.pravatar.cc/150?img=2',
            location: 'London, UK',
            createdAt: new Date('2024-01-12').toISOString(),
        },
        {
            email: 'michael.chen@outlook.com',
            username: 'soccerlover',
            password: '$2a$10$rXQvMQZ4kEp9wKX7jYjGXuPxV8yN3H7aM5tF2qR9sL6nK8oD4vB1m',
            name: 'Michael Chen',
            bio: 'Baseball enthusiast and stats nerd. Red Sox nation forever.',
            avatar: 'https://i.pravatar.cc/150?img=3',
            location: 'Boston, MA',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            email: 'emma.wilson@yahoo.com',
            username: 'courtqueen',
            password: '$2a$10$rXQvMQZ4kEp9wKX7jYjGXuPxV8yN3H7aM5tF2qR9sL6nK8oD4vB1m',
            name: 'Emma Wilson',
            bio: 'Tennis fanatic. Never miss a Grand Slam match. Serena Williams is my idol.',
            avatar: 'https://i.pravatar.cc/150?img=4',
            location: 'New York, NY',
            createdAt: new Date('2024-01-18').toISOString(),
        },
        {
            email: 'alex.rodriguez@proton.me',
            username: 'gridironguru',
            password: '$2a$10$rXQvMQZ4kEp9wKX7jYjGXuPxV8yN3H7aM5tF2qR9sL6nK8oD4vB1m',
            name: 'Alex Rodriguez',
            bio: 'NFL fanatic. Bears fan living through the pain. Fantasy football champion 2023.',
            avatar: 'https://i.pravatar.cc/150?img=5',
            location: 'Chicago, IL',
            createdAt: new Date('2024-01-20').toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});