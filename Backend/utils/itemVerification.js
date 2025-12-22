// Item verification utility for detailed matching
class ItemVerification {
  
  // Extract detailed features from item description
  static extractItemDetails(description) {
    const text = description.toLowerCase();
    
    return {
      colors: this.extractColors(text),
      condition: this.extractCondition(text),
      accessories: this.extractAccessories(text),
      marks: this.extractMarks(text),
      size: this.extractSize(text)
    };
  }
  
  static extractColors(text) {
    const colors = ['black', 'white', 'blue', 'red', 'green', 'pink', 'purple', 'gold', 'silver', 'gray', 'grey', 'brown', 'yellow', 'orange'];
    return colors.filter(color => text.includes(color));
  }
  
  static extractCondition(text) {
    if (text.includes('cracked') || text.includes('broken') || text.includes('damaged') || text.includes('scratched')) {
      return 'damaged';
    }
    if (text.includes('perfect') || text.includes('new') || text.includes('excellent') || text.includes('mint')) {
      return 'excellent';
    }
    if (text.includes('good') || text.includes('fine') || text.includes('working')) {
      return 'good';
    }
    return 'normal';
  }
  
  static extractAccessories(text) {
    const accessories = ['case', 'cover', 'sticker', 'charm', 'strap', 'keychain', 'pouch', 'bag', 'charger', 'cable'];
    return accessories.filter(acc => text.includes(acc));
  }
  
  static extractMarks(text) {
    const markKeywords = ['sticker', 'scratch', 'dent', 'mark', 'logo', 'engraving', 'writing', 'drawing'];
    const marks = [];
    
    markKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b\\w*${keyword}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) marks.push(...matches);
    });
    
    return marks;
  }
  
  static extractSize(text) {
    if (text.includes('small') || text.includes('mini')) return 'small';
    if (text.includes('large') || text.includes('big')) return 'large';
    if (text.includes('medium')) return 'medium';
    return null;
  }
  
  // Compare colors with conflict detection
  static compareColors(lostColors, foundColors) {
    if (lostColors.length === 0 && foundColors.length === 0) return 50;
    if (lostColors.length === 0 || foundColors.length === 0) return 30;
    
    const hasMatch = lostColors.some(color => foundColors.includes(color));
    const hasConflict = lostColors.some(color => 
      foundColors.some(fColor => this.areConflictingColors(color, fColor))
    );
    
    if (hasMatch && !hasConflict) return 100;
    if (hasMatch && hasConflict) return 60;
    if (hasConflict) return 0;
    return 40;
  }
  
  static areConflictingColors(color1, color2) {
    const conflicts = {
      'black': ['white', 'silver'],
      'white': ['black'],
      'blue': ['red', 'green'],
      'red': ['blue', 'green'],
      'green': ['red', 'blue']
    };
    return conflicts[color1]?.includes(color2) || conflicts[color2]?.includes(color1);
  }
  
  // Compare conditions
  static compareCondition(lostCondition, foundCondition) {
    if (!lostCondition || !foundCondition) return 50;
    if (lostCondition === foundCondition) return 100;
    
    // Condition conflicts
    const conflicts = {
      'damaged': ['excellent', 'perfect'],
      'excellent': ['damaged'],
      'good': ['damaged']
    };
    
    if (conflicts[lostCondition]?.includes(foundCondition)) return 0;
    return 60; // Similar but not exact
  }
  
  // Compare accessories
  static compareAccessories(lostAcc, foundAcc) {
    if (lostAcc.length === 0 && foundAcc.length === 0) return 50;
    
    const matches = lostAcc.filter(acc => foundAcc.includes(acc));
    const conflicts = lostAcc.length > 0 && foundAcc.length > 0 && matches.length === 0;
    
    if (matches.length > 0) return 100;
    if (conflicts) return 20;
    return 50;
  }
  
  // Compare distinguishing marks
  static compareMarks(lostMarks, foundMarks) {
    if (lostMarks.length === 0 && foundMarks.length === 0) return 50;
    
    const matches = lostMarks.filter(mark => 
      foundMarks.some(fMark => 
        mark.toLowerCase().includes(fMark.toLowerCase()) || 
        fMark.toLowerCase().includes(mark.toLowerCase())
      )
    );
    
    if (matches.length > 0) return 100;
    if (lostMarks.length > 0 && foundMarks.length > 0) return 20;
    return 50;
  }
  
  // String similarity using Levenshtein distance
  static calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return ((longer.length - editDistance) / longer.length) * 100;
  }
  
  static levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  // Main verification function
  static verifyItemMatch(lostItem, foundItem) {
    // Basic name check
    const lostName = lostItem.itemName.toLowerCase();
    const foundName = foundItem.itemName.toLowerCase();
    
    // Check if items are same category
    const nameWords = lostName.split(' ');
    const foundWords = foundName.split(' ');
    const hasCommonWord = nameWords.some(word => foundWords.includes(word) && word.length > 2);
    
    if (!hasCommonWord) {
      return {
        isMatch: false,
        score: 0,
        reason: "Completely different item types",
        breakdown: {},
        conflicts: ["Different item categories"]
      };
    }
    
    // Detailed analysis
    const lostDetails = this.extractItemDetails(lostItem.description);
    const foundDetails = this.extractItemDetails(foundItem.description);
    
    // Calculate weighted scores
    const scores = {
      color: this.compareColors(lostDetails.colors, foundDetails.colors) * 0.25,
      condition: this.compareCondition(lostDetails.condition, foundDetails.condition) * 0.20,
      accessories: this.compareAccessories(lostDetails.accessories, foundDetails.accessories) * 0.15,
      marks: this.compareMarks(lostDetails.marks, foundDetails.marks) * 0.25,
      description: this.calculateStringSimilarity(lostItem.description, foundItem.description) * 0.15
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    // Generate conflicts list
    const conflicts = [];
    if (scores.color < 30) conflicts.push(`Color mismatch: ${lostDetails.colors.join(', ') || 'unspecified'} vs ${foundDetails.colors.join(', ') || 'unspecified'}`);
    if (scores.condition < 30) conflicts.push(`Condition mismatch: ${lostDetails.condition} vs ${foundDetails.condition}`);
    if (scores.accessories < 30 && (lostDetails.accessories.length > 0 || foundDetails.accessories.length > 0)) {
      conflicts.push(`Accessory mismatch: ${lostDetails.accessories.join(', ') || 'none'} vs ${foundDetails.accessories.join(', ') || 'none'}`);
    }
    if (scores.marks < 30 && (lostDetails.marks.length > 0 || foundDetails.marks.length > 0)) {
      conflicts.push(`Distinguishing marks mismatch: ${lostDetails.marks.join(', ') || 'none'} vs ${foundDetails.marks.join(', ') || 'none'}`);
    }
    
    return {
      isMatch: totalScore >= 60,
      score: Math.round(totalScore),
      breakdown: {
        color: Math.round(scores.color),
        condition: Math.round(scores.condition),
        accessories: Math.round(scores.accessories),
        marks: Math.round(scores.marks),
        description: Math.round(scores.description)
      },
      conflicts: conflicts,
      reason: totalScore >= 60 ? "Items likely match based on detailed analysis" : "Items don't appear to be the same",
      lostDetails,
      foundDetails
    };
  }
}

module.exports = ItemVerification;