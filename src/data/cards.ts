export const CYBER_CARDS = [
    {
        id: 'brute_force',
        title: 'Brute Force Attack',
        fact: 'Странный факт: Простой пароль из 8 символов взламывается за 1 секунду.',
        type: 'ATTACK',
        rarity: 'Common',
        damage: 20
    },
    {
        id: 'mfa_shield',
        title: 'Multi-Factor Auth',
        fact: '2FA отсекает 99% автоматизированных атак.',
        type: 'DEFENSE',
        beats: 'brute_force', // Эта карта бьет Брутфорс
        shield: 20
    }
];