export const PROFILE_ENUMS = {
  role: [
    { value: 'student', label: 'Student' },
    { value: 'early_career', label: 'Early Career' },
    { value: 'family', label: 'Family' },
    { value: 'professional', label: 'Professional' }
  ],
  gender: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non_binary', label: 'Non-binary' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ],
  education: [
    { value: 'high_school', label: 'High School' },
    { value: 'bachelors', label: 'Bachelor\'s Degree' },
    { value: 'masters', label: 'Master\'s Degree' },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ],
  experience: [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ],
  savings: [
    { value: 'no_savings', label: 'No Savings' },
    { value: 'occasional', label: 'Occasional' },
    { value: 'consistent', label: 'Consistent' },
    { value: 'high', label: 'High' }
  ],
  situation: [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'okay', label: 'Okay' },
    { value: 'need_improvement', label: 'Needs Improvement' },
    { value: 'struggling', label: 'Struggling' }
  ]
};

export const MOTIVATIONS = [
    { value: 'track', label: 'Track spending', icon: 'account-balance-wallet' },
    { value: 'budget', label: 'Create a budget', icon: 'pie-chart' },
    { value: 'save', label: 'Save for specific goals', icon: 'savings' },
    { value: 'rewards', label: 'Redeem rewards and deals', icon: 'card-giftcard' },
    { value: 'advice', label: 'Get financial advice', icon: 'trending-up' },
    { value: 'other', label: 'Other', icon: 'more-horiz' }
];

export const GOALS = [
    { value: 'house', label: 'Buying a house', icon: 'home' },
    { value: 'debt', label: 'Paying off debt', icon: 'money-off' },
    { value: 'retirement', label: 'Saving for retirement', icon: 'beach-access' },
    { value: 'travel', label: 'Travel', icon: 'flight' },
    { value: 'investing', label: 'Investing', icon: 'show-chart' },
    { value: 'other', label: 'Other', icon: 'more-horiz' }
];

export const DEBT_TYPES = [
    { value: 'no_debt', label: 'No Debt', icon: 'check-circle' },
    { value: 'credit_cards', label: 'Credit Cards', icon: 'credit-card' },
    { value: 'loans', label: 'Personal Loans', icon: 'account-balance' },
    { value: 'mortgage', label: 'Mortgage', icon: 'home' },
    { value: 'student', label: 'Student Loans', icon: 'school' },
    { value: 'other', label: 'Other', icon: 'more-horiz' }
];
