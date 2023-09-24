import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const utcFormat = (date: string, format: string = 'YYYY-MM-DD') => {
  return dayjs.utc(date).format(format);
};
