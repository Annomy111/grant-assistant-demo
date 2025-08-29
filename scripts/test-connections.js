const { PrismaClient } = require('@prisma/client');

async function testConnections() {
  console.log('🔍 Testing Connections...\n');
  
  // Test Database Connection
  console.log('📊 Testing Neon Database...');
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Count tables
    const organizationCount = await prisma.organization.count();
    const userCount = await prisma.user.count();
    const applicationCount = await prisma.application.count();
    
    console.log(`   - Organizations: ${organizationCount}`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Applications: ${applicationCount}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
  
  // Test DeepSeek API
  console.log('\n🤖 Testing DeepSeek API...');
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
  
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY not found in environment');
  } else {
    try {
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a test bot.' },
            { role: 'user', content: 'Reply with OK if you receive this.' }
          ],
          max_tokens: 10,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ DeepSeek API connected successfully!');
        console.log(`   - Response: ${data.choices[0].message.content}`);
      } else {
        console.error('❌ DeepSeek API error:', response.statusText);
      }
    } catch (error) {
      console.error('❌ DeepSeek API connection failed:', error.message);
    }
  }
  
  console.log('\n📝 Configuration Summary:');
  console.log(`   - App URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`);
  console.log(`   - Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`   - DeepSeek: ${process.env.DEEPSEEK_API_KEY ? 'Configured' : 'Not configured'}`);
  
  console.log('\n✨ Test complete!');
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testConnections().catch(console.error);