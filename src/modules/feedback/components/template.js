export const navbar = ['Ambience', 'Service', 'Attitude', 'Experience', 'Feeling', 'Food', 'Dine', 'Pickup', 'Reception', 'Portion', 'Pricing']
export const getData = (type, setFeelBad, setFeelGood, setFeelExcellent) => {
    if(type === 'ambience') {
        setFeelBad(['Mediocre', 'Overcrowded', 'Noisy', 'Uncomfortable', 'Shabby'])
        setFeelGood(['Modest', 'Well-maintained', 'Cozy', 'Casual', 'Simple', 'Clean'])
        setFeelExcellent(['Insta-Worthy', 'Luxurious', 'Chic', 'Elegant', 'Lively'])  
    }
    else if (type === 'service') {
        setFeelBad(['Mediocre', 'Inconsistent', 'Inefficient', 'Unprofessional', 'Disorganized', 'Understaffed', 'Slow'])
        setFeelGood(['Timely', 'Efficient', 'Mindful', 'Professional', 'Accommodating'])
        setFeelExcellent(['Fabulous', 'Seamless', 'Personalized', 'Flawless', 'Holistic', 'Proactive', 'Committed', 'Intelligent'])
    }
    else if (type === 'attitude') {
        setFeelBad(['Hostile', 'Discriminating', 'Casual', 'Careless', 'Pompous'])
        setFeelGood(['Hospitable', 'Polite', 'Accommodating', 'Sensible', 'Candid'])
        setFeelExcellent(['Graceful', 'Enthusiastic', 'Amicable', 'Empathetic', 'Approach'])
    }
    else if (type === 'experience') {
        setFeelBad(['Awkward', 'Disappointing', 'Misleading', 'Incomplete', 'Never Going Back'])
        setFeelGood(['Pleasent', 'Comforting', 'Convenient', 'Standard', 'Acceptable'])
        setFeelExcellent(['Spectacular', 'Memorable', 'Wholesome', 'Themed', 'Fascinating', 'Profound', 'Exclusive', 'Immersive', 'Novel', 'Fine'])
    }
    else if (type === 'feeling') {
        setFeelBad(['Still Hungry', 'Bloated', 'Uneasy', 'Sick', 'Dissatisfied', 'Regretful', 'Meh'])
        setFeelGood(['Healthy', 'Pleasent', 'Satisfied', 'Full', 'WIP'])
        setFeelExcellent(['Mind-blown', 'Special / Valued', 'Comforted', 'Nostalgic', 'Refreshed', 'Relaxed'])
    }
}

export const getSingleData = (type, setTags) => {
    if(type === 'dine') 
        setTags(['Long', 'Acceptable', 'Zero'])
    else if(type === 'pickup')
        setTags(['Delayed', 'On-time', 'Before Time'])
    else if(type === 'reception')
        setTags(['Indifferent', 'Courteous', 'Warm'])
    else if(type === 'pricing')
        setTags(['OverPriced', 'Reasonable', 'Value For Money'])
    else if(type === 'portion')
        setTags(['Delayed', 'On-time', 'Before Time'])
}