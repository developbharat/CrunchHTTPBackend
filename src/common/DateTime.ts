export class DateTime extends Date {
  constructor() {
    super();
  }

  subtractYears(years: number): DateTime {
    this.setFullYear(this.getFullYear() - years);
    return this;
  }

  subtractMinutes(minutes: number): DateTime {
    this.setMinutes(this.getMinutes() - minutes);
    return this;
  }

  addMinutes(minutes: number): DateTime {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
  }

  addHours(hours: number): DateTime {
    this.setHours(this.getHours() + hours);
    return this;
  }

  addMonths(months: number): DateTime {
    this.setMonth(this.getMonth() + months);
    return this;
  }

  isMoreThan(date: Date | DateTime): boolean {
    return this.getTime() > date.getTime();
  }

  isLessThan(date: Date | DateTime): boolean {
    return this.getTime() < date.getTime();
  }
}
