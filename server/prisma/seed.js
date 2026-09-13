const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const problems = [
  {
    title: "Parking Lot",
    slug: "parking-lot",
    difficulty: "Medium",
    description:
      "Design a parking lot system that can manage different types of vehicles, parking spots, tickets, and payments.",
    requirements: `
1. The parking lot has multiple floors.
2. Each floor has different types of parking spots.
3. The system should support motorcycles, cars, and trucks.
4. A vehicle should be assigned an appropriate available spot.
5. The system should generate a parking ticket.
6. A vehicle should be able to exit and calculate the parking fee.
7. The design should be extensible for adding new vehicle or spot types.
8. Consider what happens when the parking lot is full.
    `.trim(),
  },

  {
    title: "Elevator System",
    slug: "elevator-system",
    difficulty: "Medium",
    description:
      "Design an elevator system that manages multiple elevators, floor requests, elevator movement, and request assignment.",
    requirements: `
1. The building has multiple floors.
2. The system can have multiple elevators.
3. Users can request an elevator from a floor.
4. Users inside an elevator can select a destination floor.
5. The system should decide which elevator handles a request.
6. An elevator should maintain its current state and direction.
7. Consider idle, moving, and maintenance states.
8. The design should allow different elevator selection strategies.
    `.trim(),
  },

  {
    title: "Library Management System",
    slug: "library-management",
    difficulty: "Easy",
    description:
      "Design a library management system that manages books, members, borrowing, returning, and availability.",
    requirements: `
1. The library contains multiple books.
2. Books can have multiple copies.
3. Members can borrow available books.
4. A borrowed book can be returned.
5. The system should track due dates.
6. The system should prevent unavailable copies from being borrowed.
7. Consider overdue books and fines.
8. The design should allow new types of library items in the future.
    `.trim(),
  },

  {
    title: "Food Delivery System",
    slug: "food-delivery",
    difficulty: "Hard",
    description:
      "Design a food delivery system connecting customers, restaurants, orders, payments, and delivery partners.",
    requirements: `
1. Customers can browse restaurants and menus.
2. Customers can add items to a cart and place an order.
3. Restaurants can accept or reject orders.
4. Customers should be able to make payments.
5. Delivery partners can accept delivery requests.
6. The system should track order and delivery status.
7. Consider cancellation and payment failure.
8. The design should support multiple payment methods and delivery strategies.
    `.trim(),
  },
];

async function main() {
  console.log("Seeding database...");

  for (const problem of problems) {
    await prisma.problem.upsert({
      where: {
        slug: problem.slug,
      },
      update: problem,
      create: problem,
    });
  }

  console.log(`Seeded ${problems.length} problems.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });