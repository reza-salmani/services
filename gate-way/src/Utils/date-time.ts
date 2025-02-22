export let DateTime = {
  IncrementDecrement: (
    date: Date | string,
    num: number,
    type: 'y' | 'mo' | 'h' | 'mi' | 'd',
  ) => {
    let newDate = new Date(date);
    switch (type) {
      case 'y':
        return new Date(date).setFullYear(newDate.getFullYear() + num);
      case 'mo':
        return new Date(date).setMonth(newDate.getMonth() + num);
      case 'd':
        return new Date(date).setDate(newDate.getDate() + num);
      case 'h':
        return new Date(date).setHours(newDate.getHours() + num);
      case 'mi':
        return new Date(date).setMinutes(newDate.getMinutes() + num);
    }
  },
  getDiffTime: (date_1: Date | string, date_2: Date | string) => {
    let dateItem_1 = new Date(date_1).getUTCMinutes();
    let dateItem_2 = new Date(date_2).getUTCMinutes();
    return Math.abs(dateItem_2 - dateItem_1);
  },
};
