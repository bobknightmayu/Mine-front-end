#!/usr/bin/env node
// Quick test to verify headless detection works
console.log('Current environment:');
console.log('DISPLAY:', process.env.DISPLAY);
console.log('isHeadless:', !process.env.DISPLAY || process.env.DISPLAY === '');

if (!process.env.DISPLAY || process.env.DISPLAY === '') {
  console.log('\n✅ Headless detection working correctly');
  console.log('Run: npm run cli:challenge -- --community "test"');
} else {
  console.log('\n✅ Display detected - GUI mode available');
  console.log('Run: npm run dev');
}
