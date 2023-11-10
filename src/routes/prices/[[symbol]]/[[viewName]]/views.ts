export const views: {
    name: string,
    interval: string,
    points: number,
    timeUnit: "minute" | "hour" | "day" | "month" | "quarter" | "year" | "millisecond" | "second" | "week"
}[] = [
        { name: "1 час", interval: "1m", points: 60, timeUnit: "minute" },

        // { name: "", interval: "3m", points: 12, timeUnit: "" },
        // { name: "", interval: "5m", points: 12, timeUnit: "" },
        { name: "6 часов", interval: "15m", points: 24, timeUnit: "hour" },
        { name: "12 часов", interval: "30m", points: 24, timeUnit: "hour" },

        { name: "1 день", interval: "1h", points: 24, timeUnit: "hour" },
        // { name: "", interval: "2h", points: 12, timeUnit: "" },
        // { name: "", interval: "4h", points: 12, timeUnit: "" },
        { name: "3 дня", interval: "6h", points: 12, timeUnit: "hour" },
        // { name: "", interval: "8h", points: 12, timeUnit: "" },
        { name: "5 дней", interval: "12h", points: 10, timeUnit: "hour" },

        { name: "1 неделя", interval: "1d", points: 7, timeUnit: "day" },
        { name: "1 месяц", interval: "3d", points: 10, timeUnit: "day" },

        // { name: "1M", interval: "1w", points: 4, timeUnit: "" },

        { name: "1 год", interval: "1M", points: 12, timeUnit: "month" },
        { name: "3 года", interval: "1M", points: 12 * 3, timeUnit: "quarter" },
        { name: "5 лет", interval: "1M", points: 12 * 5, timeUnit: "quarter" },

        { name: "Все", interval: "1M", points: Infinity, timeUnit: "year" },
    ];
