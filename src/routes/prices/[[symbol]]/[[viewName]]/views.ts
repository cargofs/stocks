export const views = [
    { name: "1h", interval: "1m", points: 60, dateFormat: "yyyy-MM-dd hh:mm" },

    // { name: "", interval: "3m", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "5m", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "15m", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    { name: "12h", interval: "30m", points: 24, dateFormat: "yyyy-MM-dd hh:mm" },

    { name: "1d", interval: "1h", points: 24, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "2h", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "4h", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "6h", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "8h", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    // { name: "", interval: "12h", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },

    { name: "1w", interval: "1d", points: 7, dateFormat: "yyyy-MM-dd hh:mm" },
    { name: "1M", interval: "3d", points: 10, dateFormat: "yyyy-MM-dd hh:mm" },

    // { name: "1M", interval: "1w", points: 4, dateFormat: "yyyy-MM-dd hh:mm" },

    { name: "1Y", interval: "1M", points: 12, dateFormat: "yyyy-MM-dd hh:mm" },
    { name: "3Y", interval: "1M", points: 12 * 3, dateFormat: "yyyy-MM-dd hh:mm" },
    { name: "5Y", interval: "1M", points: 12 * 5, dateFormat: "yyyy-MM-dd hh:mm" },

    { name: "ALL", interval: "1M", points: Infinity, dateFormat: "yyyy-MM-dd hh:mm" },
];
