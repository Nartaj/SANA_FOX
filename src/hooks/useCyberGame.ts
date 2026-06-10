// Пример упрощенной логики
const playTurn = (playerCardId, enemyCardId) => {
    const playerCard = findCard(playerCardId);
    const enemyCard = findCard(enemyCardId);

    if (playerCard.beats === enemyCardId) {
        return "Победа! Атака отражена. +10 к знаниям";
    } else {
        return "Система взломана! Нужно изучить тему: " + enemyCard.title;
    }
};