interface Stats {
    total: number;
    today: number;
    successCount: number;
    failureCount: number;
}

export class StatsManager {
    private static instance: StatsManager;
    private stats: Stats;
    private lastReset: Date;

    private constructor() {
        this.stats = {
            total: 0,
            today: 0,
            successCount: 0,
            failureCount: 0
        };
        this.lastReset = new Date();
    }

    static getInstance(): StatsManager {
        if (!StatsManager.instance) {
            StatsManager.instance = new StatsManager();
        }
        return StatsManager.instance;
    }

    recordRequest(success: boolean) {
        this.checkAndResetDaily();
        this.stats.total++;
        this.stats.today++;
        if (success) {
            this.stats.successCount++;
        } else {
            this.stats.failureCount++;
        }
    }

    private checkAndResetDaily() {
        const now = new Date();
        if (now.getDate() !== this.lastReset.getDate()) {
            this.stats.today = 0;
            this.lastReset = now;
        }
    }

    getStats() {
        const successRate = this.stats.total > 0 
            ? Math.round((this.stats.successCount / this.stats.total) * 100) 
            : 0;

        return {
            total: this.stats.total,
            today: this.stats.today,
            successRate: successRate
        };
    }
} 