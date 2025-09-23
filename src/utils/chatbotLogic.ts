import { Scheme, Village } from '../types/chatbot';

interface QueryResponse {
  type: 'bot' | 'suggestion';
  content: string;
  schemes?: Scheme[];
}

// Keywords for different query types
const schemeKeywords = ['scheme', 'yojana', 'program', 'benefit', 'help', 'support', 'assistance'];
const villageKeywords = ['village', 'gaon', 'area', 'place', 'location', 'info', 'information'];
const recommendationKeywords = ['recommend', 'suggest', 'best', 'good', 'suitable', 'top', 'which'];

export const processQuery = (
  query: string, 
  schemes: Scheme[], 
  villages: Village[], 
  selectedVillage?: string
): QueryResponse => {
  const lowerQuery = query.toLowerCase();

  // Check for specific scheme queries
  const schemeMatch = findSchemeByQuery(lowerQuery, schemes);
  if (schemeMatch) {
    return {
      type: 'bot',
      content: `📋 Here's information about ${schemeMatch.name}:`,
      schemes: [schemeMatch]
    };
  }

  // Check for village queries
  const villageMatch = findVillageByQuery(lowerQuery, villages);
  if (villageMatch) {
    const recommendations = getVillageRecommendations(villageMatch, schemes);
    return {
      type: 'suggestion',
      content: `🌿 ${villageMatch.name} information and recommended schemes:`,
      schemes: recommendations
    };
  }

  // Check for recommendation queries
  if (recommendationKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return handleRecommendationQuery(lowerQuery, schemes, villages, selectedVillage);
  }

  // Check for category-specific queries
  const categorySchemes = findSchemesByCategory(lowerQuery, schemes);
  if (categorySchemes.length > 0) {
    return {
      type: 'suggestion',
      content: `💡 Here are schemes related to your query:`,
      schemes: categorySchemes.slice(0, 5)
    };
  }

  // Check for occupation-based queries
  const occupationSchemes = findSchemesByOccupation(lowerQuery, schemes);
  if (occupationSchemes.length > 0) {
    return {
      type: 'suggestion',
      content: `💼 Based on your occupation, here are relevant schemes:`,
      schemes: occupationSchemes.slice(0, 4)
    };
  }

  // Default fallback - top schemes
  const topSchemes = getTopRecommendations(schemes);
  return {
    type: 'bot',
    content: `🤔 I'm not sure about that specific query. Here are some popular government schemes you might find helpful:`,
    schemes: topSchemes
  };
};

const findSchemeByQuery = (query: string, schemes: Scheme[]): Scheme | null => {
  // Direct name match
  let match = schemes.find(scheme => 
    query.includes(scheme.name.toLowerCase()) ||
    query.includes(scheme.id) ||
    scheme.keywords.some(keyword => query.includes(keyword))
  );

  if (!match) {
    // Fuzzy matching for common scheme names
    const fuzzyMatches: Record<string, string> = {
      'kisan': 'pm-kisan',
      'mudra': 'pm-mudra',
      'awas': 'pmay-gramin',
      'ayushman': 'ayushman-bharat',
      'ujjwala': 'pm-ujjwala',
      'fasal': 'pm-fasal-bima',
      'nrega': 'mgnrega',
      'mgnrega': 'mgnrega',
      'employment': 'mgnrega',
      'health insurance': 'ayushman-bharat',
      'housing': 'pmay-gramin',
      'forest rights': 'forest-rights-act'
    };

    for (const [key, schemeId] of Object.entries(fuzzyMatches)) {
      if (query.includes(key)) {
        match = schemes.find(s => s.id === schemeId);
        break;
      }
    }
  }

  return match || null;
};

const findVillageByQuery = (query: string, villages: Village[]): Village | null => {
  return villages.find(village => 
    query.includes(village.name.toLowerCase()) ||
    query.includes(village.id)
  ) || null;
};

const findSchemesByCategory = (query: string, schemes: Scheme[]): Scheme[] => {
  const categoryKeywords: Record<string, string[]> = {
    agriculture: ['farm', 'agriculture', 'crop', 'farming', 'kisan', 'farmer'],
    health: ['health', 'medical', 'hospital', 'treatment', 'insurance'],
    employment: ['job', 'work', 'employment', 'income', 'business', 'loan'],
    housing: ['house', 'home', 'housing', 'shelter', 'construction'],
    education: ['education', 'school', 'study', 'learning', 'student'],
    forest: ['forest', 'tree', 'tribal', 'jungle', 'wood'],
    energy: ['energy', 'gas', 'fuel', 'cooking', 'lpg'],
    water: ['water', 'jal', 'tap', 'pipeline']
  };

  const matchedCategories: string[] = [];
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      matchedCategories.push(category);
    }
  }

  if (matchedCategories.length === 0) return [];

  return schemes.filter(scheme => 
    matchedCategories.includes(scheme.category)
  );
};

const findSchemesByOccupation = (query: string, schemes: Scheme[]): Scheme[] => {
  const occupationKeywords: Record<string, string[]> = {
    farmer: ['pm-kisan', 'pm-fasal-bima', 'kisan-credit-card', 'pm-kisan-fpo'],
    business: ['pm-mudra', 'stand-up-india'],
    worker: ['mgnrega', 'pension-scheme'],
    tribal: ['forest-rights-act', 'van-dhan-yojana', 'eklavya-model-schools'],
    women: ['pm-ujjwala', 'stand-up-india']
  };

  const matchedOccupations: string[] = [];
  
  for (const [occupation, schemeIds] of Object.entries(occupationKeywords)) {
    if (query.includes(occupation)) {
      return schemes.filter(scheme => schemeIds.includes(scheme.id));
    }
  }

  return [];
};

const handleRecommendationQuery = (
  query: string, 
  schemes: Scheme[], 
  villages: Village[], 
  selectedVillage?: string
): QueryResponse => {
  // Village-specific recommendations
  if (selectedVillage) {
    const village = villages.find(v => v.id === selectedVillage);
    if (village) {
      const recommendations = getVillageRecommendations(village, schemes);
      return {
        type: 'suggestion',
        content: `💡 Based on ${village.name}'s profile, here are the top recommendations:`,
        schemes: recommendations.slice(0, 3)
      };
    }
  }

  // Forest-dependent communities
  if (query.includes('forest')) {
    const forestSchemes = schemes.filter(s => 
      s.category === 'forest' || 
      s.targetAudience.includes('tribal') ||
      s.keywords.includes('forest')
    );
    return {
      type: 'suggestion',
      content: `🌲 Top schemes for forest-dependent communities:`,
      schemes: forestSchemes.slice(0, 3)
    };
  }

  // General top recommendations
  const topSchemes = getTopRecommendations(schemes);
  return {
    type: 'suggestion',
    content: `💡 Here are the top 3 recommended government schemes:`,
    schemes: topSchemes
  };
};

export const getVillageRecommendations = (village: Village, schemes: Scheme[]): Scheme[] => {
  // Get schemes recommended for this village
  const recommendedSchemes = schemes.filter(scheme => 
    village.recommendedSchemes.includes(scheme.id)
  );

  // Add additional schemes based on village characteristics
  const additionalSchemes: Scheme[] = [];

  // High forest dependency
  if (village.forestDependency >= 70) {
    const forestSchemes = schemes.filter(s => 
      s.category === 'forest' && 
      !recommendedSchemes.some(rs => rs.id === s.id)
    );
    additionalSchemes.push(...forestSchemes);
  }

  // Low literacy rate
  if (village.literacyRate < 60) {
    const educationSchemes = schemes.filter(s => 
      s.category === 'education' && 
      !recommendedSchemes.some(rs => rs.id === s.id)
    );
    additionalSchemes.push(...educationSchemes);
  }

  // Poor water infrastructure
  if (village.infrastructure.water < 60) {
    const waterSchemes = schemes.filter(s => 
      s.keywords.includes('water') || s.keywords.includes('jal') &&
      !recommendedSchemes.some(rs => rs.id === s.id)
    );
    additionalSchemes.push(...waterSchemes);
  }

  // Agriculture-based occupation
  if (village.mainOccupation.includes('farming') || village.mainOccupation.includes('agriculture')) {
    const agriSchemes = schemes.filter(s => 
      s.category === 'agriculture' && 
      !recommendedSchemes.some(rs => rs.id === s.id)
    );
    additionalSchemes.push(...agriSchemes.slice(0, 2));
  }

  return [...recommendedSchemes, ...additionalSchemes.slice(0, 3)];
};

const getTopRecommendations = (schemes: Scheme[]): Scheme[] => {
  // Popular schemes that apply to most communities
  const topSchemeIds = ['pm-kisan', 'ayushman-bharat', 'mgnrega'];
  return schemes.filter(scheme => topSchemeIds.includes(scheme.id));
};