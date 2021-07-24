export class ReactivityJs {
    handlers = new Set();
    proxy;

    static bind(target, ...handlers) {
        const observer = new this(...handlers);
        observer.proxy = new Proxy(target, observer.proxyHandlers());
        return observer.proxy;
    }

    constructor(...handlers) {
        if (handlers.length > 0) {
            this.setControlFunctions(handlers[handlers.length - 1]);
            this.watch(...handlers);
        }
    }

    watch(...handlers) {
        handlers.forEach(handler => {
            if (typeof handler === 'function') {
                this.handlers.add(handler);
            }
        });
    }

    unwatch(...handlers) {
        handlers.forEach(handler => {
            this.handlers.delete(handler);
        });
    }

    stopWatch() {
        this.handlers = new Set();
    }

    setControlFunctions(controller) {
        if (controller == null) {
            return;
        }
        if (typeof controller === 'object' && Array.isArray(controller) === false) {
            controller.watch = this.watch.bind(this);
            controller.unwatch = this.unwatch.bind(this);
            controller.stopWatch = this.stopWatch.bind(this);
        }
    }

    proxyHandlers() {
        return {
            get: this.get.bind(this),
            set: this.set.bind(this),
            deleteProperty: this.delete.bind(this)
        };
    }

    get(target, prop) {
        return Reflect.get(...arguments);
    }

    set(target, prop, value) {
        return this.notify(Reflect.set(...arguments));
    }

    delete(target, prop) {
        return this.notify(Reflect.deleteProperty(...arguments));
    }

    notify(isUpdated) {
        if (isUpdated) {
            this.handlers.forEach(handler => {
                handler(this.proxy);
            });
        }
        return isUpdated;
    }
}