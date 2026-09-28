export const taskPool = [
  { id: 't1',  text: 'Интервью с заказчиком',           stage: 'analysis',   days: 3 },
  { id: 't2',  text: 'Составить ТЗ',                     stage: 'analysis',   days: 5 },
  { id: 't3',  text: 'Согласовать ТЗ с заказчиком',      stage: 'analysis',   days: 2 },
  { id: 't4',  text: 'Спроектировать БД',                stage: 'design',     days: 4 },
  { id: 't5',  text: 'Нарисовать прототипы',             stage: 'design',     days: 5 },
  { id: 't6',  text: 'Согласовать UI с заказчиком',      stage: 'design',     days: 2 },
  { id: 't7',  text: 'Настроить репозиторий и CI',       stage: 'dev',        days: 2 },
  { id: 't8',  text: 'Разработать backend',              stage: 'dev',        days: 10 },
  { id: 't9',  text: 'Разработать frontend',             stage: 'dev',        days: 8 },
  { id: 't10', text: 'Интеграция frontend и backend',    stage: 'dev',        days: 3 },
  { id: 't11', text: 'Написать тест-кейсы',              stage: 'test',       days: 3 },
  { id: 't12', text: 'Провести функциональное тестирование', stage: 'test',   days: 5 },
  { id: 't13', text: 'Исправить найденные баги',         stage: 'test',       days: 4 },
  { id: 't14', text: 'Подготовить руководство пользователя', stage: 'deploy', days: 3 },
  { id: 't15', text: 'Развернуть на сервере и сдать',    stage: 'deploy',     days: 3 },
]

export const stages = [
  { id: 'analysis', title: 'Анализ',         emoji: '🔍' },
  { id: 'design',   title: 'Проектирование', emoji: '📐' },
  { id: 'dev',      title: 'Разработка',     emoji: '💻' },
  { id: 'test',     title: 'Тестирование',   emoji: '🧪' },
  { id: 'deploy',   title: 'Внедрение',      emoji: '🚀' },
]