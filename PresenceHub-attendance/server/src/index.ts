// ============================================
// Server Entry Point
// ============================================

import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(env.PORT, () => {
      console.log(`\n🚀 College ERP Server running on http://localhost:${env.PORT}`);
      console.log(`📊 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Client URL: ${env.CLIENT_URL}`);
      console.log(`❤️  Health: http://localhost:${env.PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

main();
