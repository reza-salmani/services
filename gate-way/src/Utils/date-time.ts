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
};
