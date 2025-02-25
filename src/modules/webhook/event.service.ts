import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  on(eventName: string, callback: (data: any) => void): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);

    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (listener) => listener !== callback,
      );
    };
  }

  emit(eventName: string, data: any) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((callback) => callback(data));
    }
  }
}
