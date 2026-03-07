import { BadRequestException } from '@nestjs/common';


export class EventHelper {


  static validatePastDate(date: Date) {
    if (date < new Date()) {
      throw new BadRequestException(
        'Event date cannot be in the past',
      );
    }
  }

  static combineDateTime(date: string, time: string): Date {
     const normalizedTime = time.trim().toUpperCase();

  const dateTime = new Date(`${date} ${normalizedTime}`);

    if (isNaN(dateTime.getTime())) {
      throw new BadRequestException(
        'Invalid date or time format',
      );
    }

    return dateTime;
  }



  static getPopulateQuery() {
    return [
      { path: 'client', select: 'fullName phone' },
      { path: 'assignedTo', select: 'fullName' },
    ];
  }

    // -------- Response Helpers --------

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  static formatEvent(event: any) {
    return {
      ...event,
      date: this.formatDate(event.date),
      time: this.formatTime(event.date),
    };
  }
}