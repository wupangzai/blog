// 统一维护事件名，业务侧只从这里取值，避免字符串散落在各处。
export const EVENT_NAMES = Object.freeze({
  APP_MESSAGE: 'app:message',
  APP_ONCE_MESSAGE: 'app:once-message',
});

const allowedEventNames = new Set(Object.values(EVENT_NAMES));

// 使用一个不带原型的对象存储事件，避免和原型链上的属性冲突。
const events = Object.create(null);

const isValidEventName = (eventName) => allowedEventNames.has(eventName);

const warnInvalidEventName = (action, eventName) => {
  console.warn(
    `[event-bus] ${action} 失败，事件 "${eventName}" 不在 EVENT_NAMES 配置中。`,
  );
};

const eventBus = {
  // 订阅事件，返回取消订阅函数，方便在组件卸载时清理监听。
  on(eventName, handler) {
    if (!isValidEventName(eventName)) {
      warnInvalidEventName('on', eventName);
      return () => {};
    }

    if (typeof handler !== 'function') return () => {};

    if (!events[eventName]) {
      events[eventName] = [];
    }

    events[eventName].push(handler);

    return () => this.off(eventName, handler);
  },

  // 只监听一次：触发后会自动移除当前回调。
  once(eventName, handler) {
    if (!isValidEventName(eventName)) {
      warnInvalidEventName('once', eventName);
      return () => {};
    }

    if (typeof handler !== 'function') return () => {};

    const wrappedHandler = (payload) => {
      this.off(eventName, wrappedHandler);
      handler(payload);
    };

    return this.on(eventName, wrappedHandler);
  },

  // 发布事件，把参数传给当前事件名下的所有订阅者。
  emit(eventName, payload) {
    if (!isValidEventName(eventName)) {
      warnInvalidEventName('emit', eventName);
      return;
    }

    const handlers = events[eventName];

    if (!handlers || !handlers.length) return;

    // 复制一份数组再遍历，避免执行回调时修改原数组带来影响。
    handlers.slice().forEach((handler) => {
      handler(payload);
    });
  },

  // 取消订阅：传 handler 删除单个监听，不传则清空当前事件全部监听。
  off(eventName, handler) {
    if (!isValidEventName(eventName)) {
      warnInvalidEventName('off', eventName);
      return;
    }

    const handlers = events[eventName];

    if (!handlers || !handlers.length) return;

    if (!handler) {
      delete events[eventName];
      return;
    }

    events[eventName] = handlers.filter((item) => item !== handler);

    if (!events[eventName].length) {
      delete events[eventName];
    }
  },
};

export default eventBus;
