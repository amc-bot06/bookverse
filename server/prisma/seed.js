"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const genres = [
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Romance', slug: 'romance' },
    { name: 'Mystery', slug: 'mystery' },
    { name: 'Thriller', slug: 'thriller' },
    { name: 'Science Fiction', slug: 'science-fiction' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Historical', slug: 'historical' },
    { name: 'Poetry', slug: 'poetry' },
    { name: 'Non-Fiction', slug: 'non-fiction' },
];
async function main() {
    console.log('Seeding database...');
    for (const genre of genres) {
        await prisma.genre.upsert({
            where: { slug: genre.slug },
            update: {},
            create: genre,
        });
    }
    console.log(`✅ ${genres.length} genres seeded`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
