declare module '@/utils/event-bus' {
  export const EVENT_NAMES: {
    readonly APP_MESSAGE: 'app:message';
    readonly APP_ONCE_MESSAGE: 'app:once-message';
  };

  type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];

  interface EventBus {
    on(eventName: EventName, handler: (payload?: any) => void): () => void;
    once(eventName: EventName, handler: (payload?: any) => void): () => void;
    emit(eventName: EventName, payload?: any): void;
    off(eventName: EventName, handler?: (payload?: any) => void): void;
  }

  const eventBus: EventBus;

  export default eventBus;
}
