export const views = [
    { name: "1 час", interval: "1m", points: 60, dateFormat: "HH:mm" },

    // { name: "", interval: "3m", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "5m", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    { name: "6 часов", interval: "15m", points: 12, dateFormat: "HH:mm" },
    { name: "12 часов", interval: "30m", points: 24, dateFormat: "HH:mm" },

    { name: "1 день", interval: "1h", points: 24, dateFormat: "HH:mm" },
    // { name: "", interval: "2h", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "4h", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    { name: "3 дня", interval: "6h", points: 12, dateFormat: "dd MMMM HH:mm" },
    // { name: "", interval: "8h", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    { name: "5 дней", interval: "12h", points: 10, dateFormat: "dd MMMM HH:mm" },

    { name: "1 неделя", interval: "1d", points: 7, dateFormat: "dd MMMM" },
    { name: "1 месяц", interval: "3d", points: 10, dateFormat: "dd MMMM" },

    // { name: "1M", interval: "1w", points: 4, dateFormat: "yyyy-MM-dd hh:mm" },

    { name: "1 год", interval: "1M", points: 12, dateFormat: "MMMM yyyy" },
    { name: "3 года", interval: "1M", points: 12 * 3, dateFormat: "MMMM yyyy" },
    { name: "5 лет", interval: "1M", points: 12 * 5, dateFormat: "MMMM yyyy" },

    { name: "Все", interval: "1M", points: Infinity, dateFormat: "MMMM yyyy" },
];
