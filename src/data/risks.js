// вероятность 1..3, влияние 1..3
// correct = { prob, impact } — правильная позиция
export const riskPool = [
  {
    id: 'r1',
    text: 'Уход ключевого разработчика',
    correct: { prob: 2, impact: 3 },
    advice: 'Держи bus-factor ≥ 2, документируй код, плати вовремя.',
  },
  {
    id: 'r2',
    text: 'Заказчик меняет требования в середине проекта',
    correct: { prob: 3, impact: 2 },
    advice: 'Фиксируй scope в ТЗ и используй change request.',
  },
  {
    id: 'r3',
    text: 'Сервер упал ночью перед демо',
    correct: { prob: 2, impact: 3 },
    advice: 'Резервные копии, staging-окружение, мониторинг.',
  },
  {
    id: 'r4',
    text: 'Забыли купить лицензию на Figma',
    correct: { prob: 2, impact: 1 },
    advice: 'Чек-лист инфраструктуры до старта.',
  },
  {
    id: 'r5',
    text: 'Тестировщик нашёл 100 багов за день до сдачи',
    correct: { prob: 3, impact: 3 },
    advice: 'Тестируй итеративно, не откладывай на последний день.',
  },
  {
    id: 'r6',
    text: 'Интернет в офисе отключили на 3 дня',
    correct: { prob: 1, impact: 2 },
    advice: 'Мобильный резерв, офлайн-копии задач.',
  },
  {
    id: 'r7',
    text: 'Стажёр случайно удалил ветку main',
    correct: { prob: 2, impact: 2 },
    advice: 'Защита веток, код-ревью, права доступа.',
  },
  {
    id: 'r8',
    text: 'Бюджет урезали на 30% в середине проекта',
    correct: { prob: 2, impact: 3 },
    advice: 'MVP-scope, приоритеты по MoSCoW.',
  },
]