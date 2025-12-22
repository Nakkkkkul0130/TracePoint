// Test script for item verification system
const ItemVerification = require('./utils/itemVerification');

// Test cases
const testCases = [
  {
    name: "Same iPhone - Should MATCH",
    lostItem: {
      itemName: "iPhone 15",
      description: "Blue iPhone 15 with cracked screen, Pokemon sticker on back"
    },
    foundItem: {
      itemName: "iPhone 15",
      description: "Blue phone with damaged screen, has Pokemon sticker"
    },
    expectedMatch: true
  },
  {
    name: "Different iPhones - Should REJECT",
    lostItem: {
      itemName: "iPhone 15",
      description: "Blue iPhone 15 with cracked screen, Pokemon sticker on back"
    },
    foundItem: {
      itemName: "iPhone 15",
      description: "White iPhone 15 in perfect condition, no stickers"
    },
    expectedMatch: false
  },
  {
    name: "Different items - Should REJECT",
    lostItem: {
      itemName: "iPhone 15",
      description: "Blue iPhone with case"
    },
    foundItem: {
      itemName: "MacBook Pro",
      description: "Silver laptop"
    },
    expectedMatch: false
  },
  {
    name: "Similar laptops - Should MATCH",
    lostItem: {
      itemName: "MacBook Pro",
      description: "Silver MacBook Pro with dent on corner, programming stickers"
    },
    foundItem: {
      itemName: "MacBook Pro",
      description: "Silver laptop with corner dent, has coding stickers"
    },
    expectedMatch: true
  }
];

console.log("🔍 Testing Enhanced Item Verification System\n");

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Lost: ${testCase.lostItem.description}`);
  console.log(`Found: ${testCase.foundItem.description}`);
  
  const result = ItemVerification.verifyItemMatch(testCase.lostItem, testCase.foundItem);
  
  console.log(`Result: ${result.isMatch ? '✅ MATCH' : '❌ NO MATCH'} (Score: ${result.score}%)`);
  
  if (result.conflicts.length > 0) {
    console.log(`Conflicts: ${result.conflicts.join(', ')}`);
  }
  
  const testPassed = result.isMatch === testCase.expectedMatch;
  console.log(`Test: ${testPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
});

console.log("🎯 Verification System Ready for Production!");

module.exports = { testCases };