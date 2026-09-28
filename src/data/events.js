// trigger: 'any' | 'analysis' | 'dev' | 'test' | 'deploy'
// weight: шанс выпадения
export const events = [
  {
    id: 'e1', emoji: '🤒', trigger: 'any', weight: 3,
    title: 'Разработчик заболел',
    text: '{member} слёг с температурой. Пропустит 2 дня.',
    effects: [{ type: 'pauseMember', days: 2 }],
  },
  {
    id: 'e2', emoji: '📞', trigger: 'any', weight: 3,
    title: 'Заказчик звонит',
    text: '«А можно добавить кнопку? Ну и вообще переделать?»',
    choices: [
      { text: 'Согласовать через change request', effect: { budget: -15000, morale: -5 } },
      { text: 'Отказать с обоснованием',         effect: { morale: -10, risk: 'customer_angry' } },
      { text: 'Сказать «да» и работать ночью',   effect: { budget: -30000, morale: -20 } },
    ],
  },
  {
    id: 'e3', emoji: '🐞', trigger: 'test', weight: 4,
    title: 'Тестировщик нашёл 15 багов',
    text: 'Из них 3 — критические. Что делаем?',
    choices: [
      { text: 'Задержать релиз и починить всё', effect: { delay: 3, morale: -5 } },
      { text: 'Выпустить MVP, баги потом',       effect: { morale: -15, risk: 'user_complaints' } },
    ],
  },
  {
    id: 'e4', emoji: '☕', trigger: 'any', weight: 2,
    title: 'Кофе закончился',
    text: 'Команда в панике. Кто-то уже пишет на Python на салфетке.',
    effects: [{ type: 'morale', value: -5 }],
  },
  {
    id: 'e5', emoji: '🎉', trigger: 'any', weight: 2,
    title: 'День рождения коллеги',
    text: 'Тортик, шарики, 20 минут продуктивности потеряно, зато мораль вверх.',
    effects: [{ type: 'morale', value: +10 }],
  },
  {
    id: 'e6', emoji: '💰', trigger: 'any', weight: 2,
    title: 'Сервер подорожал',
    text: 'Хостинг поднял цены на 20%.',
    effects: [{ type: 'budget', value: -20000 }],
  },
  {
    id: 'e7', emoji: '🚪', trigger: 'any', weight: 1,
    title: 'Сеньор уходит',
    text: '{member} получил оффер в Яндексе. Осталось 2 дня на передачу дел.',
    choices: [
      { text: 'Отпустить с миром', effect: { budget: -10000, morale: -15 } },
      { text: 'Уговорить остаться (повышение)', effect: { budget: -50000, morale: +5 } },
    ],
  },
  {
    id: 'e8', emoji: '🐛', trigger: 'dev', weight: 2,
    title: 'Прод упал ночью',
    text: 'Пользователи пишут в поддержку, босс звонит.',
    effects: [{ type: 'morale', value: -10 }, { type: 'delay', value: 1 }],
  },
  // ... минимум 30 событий
]