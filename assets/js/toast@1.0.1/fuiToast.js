!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.FuiToast = t())
    : (e.FuiToast = t());
})(this, function () {
  return (function () {
    /* ======================================== constant ======================================== */
    const TOAST_EXPIRE_DISMISS_DELAY = 450;
    /* ======================================== end constant ======================================== */

    /* ======================================== html template ======================================== */
    const toastHtml = ({ title, icon, isClose }) => `
  <div class="fui-toast-box${icon ? " iconCss" : ""}${
      !title && isClose ? " custom2" : ""
    }">
    ${
      isClose || title
        ? `<div class="fui-toast-head">
        ${title ? `<h3 class="fui-toast-title">${title}</h3>` : ""}
        ${
          isClose
            ? `<div class="fui-toast-close"><svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M393.4 41.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L269.3 256 438.6 425.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 301.3 54.6 470.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0L224 210.7 393.4 41.4z"/></svg></div>`
            : ""
        }
      </div>`
        : ""
    }
  
      ${icon ? `<div class="fui-toast-icon">${icon}</div>` : ""}
    <div class="fui-toast-body">
    </div>
  </div>
  `;

    /* ======================================== end html template ======================================== */

    /* ======================================== data template ======================================== */
    const toastStatus = {
      success: {
        className: "fui-toast-success",
        icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg>',
      },
      error: {
        className: "fui-toast-error",
        icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></svg>',
      },
      info: {
        className: "fui-toast-info",
        icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"></path></svg>',
      },
      warning: {
        className: "fui-toast-warning",
        icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm24-384v24V264v24H232V264 152 128h48zM232 368V320h48v48H232z"></path></svg>',
      },
      loading: {
        icon: `
          <div class="fui-loading-spinner"></div>
          `,
      },
    };
    /* ======================================== end data template ======================================== */

    /* ======================================== function ======================================== */
    function createId() {
      function S4() {
        return ((1 + Math.random()) * 0x10000 || 0).toString(16).substring(1);
      }
      return `${
        S4() + S4()
      }-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}${Date.now()}`;
    }

    const isElement = (value) =>
      Object.prototype.toString.call(value).includes("Element");

    const isFunction = (valOrFn) => typeof valOrFn === "function";

    const isHtmlString = (string) =>
      typeof string === "string" && /<\/?[a-z][\s\S]*>/i.test(string);

    const stringToHtml = (xmlString) => {
      const doc = new DOMParser().parseFromString(
        xmlString,
        "text/xml"
      ).firstElementChild;
      return doc;
    };

    const resolveValue = (valOrFn, arg) =>
      isFunction(valOrFn) ? valOrFn(arg) : valOrFn;

    /* ======================================== end function ======================================== */

    /* ======================================== toast classes ======================================== */
    class Toast {
      #mainEl;

      /* ************ Property ************ */

      #toasts = [];

      #pausedAt;

      #timeouts = [];

      #dismissTimeouts = new Map();

      #spacing = 16;

      #options = {
        duration: 3000,
      };

      /* ************ End Property ************ */

      /* ************ Setter ************ */

      set options(opts) {
        this.#options = {
          ...this.#options,
          ...opts,
        };
      }

      /* ************ End Setter ************ */

      /* ************ Method ************ */
      addToast(data) {
        const toastData = {
          ...this.#options,
          ...data,
        };

        this.#toasts.unshift(toastData);

        // get element toast trong DOM

        const toast = this.#createToast(toastData);

        if (!this.#mainEl) {
          this.#mainEl = document.getElementById("fui-toast");
          document.documentElement.style.setProperty(
            "--fui-toast-spacing",
            `${this.#spacing}px`
          );
        }

        // Thêm toast vào DOM
        this.#mainEl?.prepend(toast);

        this.#insertToast();

        this.#updateDuration();

        this.#toastsPause();

        return this;
      }

      /* **************************************************************************** */

      #createToast = (data) => {
        const toast = document.createElement("div");
        toast.className = `fui-toast top-eff-show ${data.className ?? ""}`;
        toast.dataset.id = data.id;

        toast.innerHTML = toastHtml({
          title: data.title,
          icon: data.icon,
          isClose: data.isClose,
        });

        // Set style config cho toast
        if (data.style) {
          const toastBox = toast.querySelector(".fui-toast-box");
          Object.assign(toastBox.style, data.style);
        }

        this.#renderMessage(data, toast);

        // Gán sự kiện click cho phần tử đóng
        if (data.isClose) {
          const btnClose = toast.querySelector(".fui-toast-close");

          btnClose.onclick = () => {
            this.closeToast(data.id);
          };
        }

        return toast;
      };

      #renderMessage = (data, el) => {
        // Render message
        const message =
          typeof data.message === "function"
            ? data.message(data)
            : data.message;

        if (message && el) {
          const bodyEl = el.querySelector(".fui-toast-body");

          // Xóa phần tử con nếu tồn tại
          if (bodyEl?.hasChildNodes()) {
            bodyEl.innerHTML = "";
          }

          if (isElement(message)) {
            bodyEl?.append(message);
          } else {
            bodyEl.innerHTML = message;
          }
        }

        return this;
      };

      /* **************************************************************************** */

      updateToast = (data) => {
        this.#toasts = this.#toasts.map((toast) =>
          toast.id === data.id
            ? {
                ...toast,
                ...data,
              }
            : toast
        );

        const toastEl = this.#getToast(data.id);

        toastEl.className = `fui-toast top-eff-show ${data.className ?? ""}`;

        // Update icon
        const iconEl = document.createElement("div");
        iconEl.className = `fui-toast-icon`;
        iconEl.style.animationDelay = "0s";
        let iconElRepl = data.icon;
        if (isHtmlString(iconElRepl)) {
          iconElRepl = stringToHtml(iconElRepl);
        }
        if (iconElRepl) {
          iconEl.append(iconElRepl);
        }

        toastEl?.querySelector(".fui-toast-icon")?.replaceWith(iconEl);
        // End update icon

        if (data.title) {
          toastEl.querySelector(".fui-toast-title").innerHTML = data.title;
        }

        this.#renderMessage(data, toastEl);

        this.#updateDuration();
      };

      /* **************************************************************************** */

      #getToast = (id) => {
        const toast = this.#mainEl?.querySelector(`[data-id="${id}"]`);
        return toast;
      };

      #insertToast = () => {
        let spacingTop = 0;
        this.#toasts.forEach((toast, i) => {
          const toastEl = this.#getToast(toast.id);
          toastEl?.setAttribute(
            "style",
            `transform: translateY(${i * this.#spacing + spacingTop}px)`
          );

          spacingTop += toastEl?.scrollHeight || 0;
        });
        return this;
      };

      /* **************************************************************************** */

      checkToastExists = (id) => this.#toasts.some((toast) => toast.id === id);

      /* **************************************************************************** */

      closeToast = (id) => {
        this.dismiss(id);
        this.#toasts = this.#toasts.filter((toast) => toast.id !== id);
        this.#insertToast();

        return this;
      };

      /* **************************************************************************** */

      #updateDuration = (pausedAt) => {
        // existTime kiểm tra nếu có timeout trong danh sách
        const existTime = this.#timeouts.length !== 0;

        if (existTime) {
          // Mỗi khi hàm updateDuration được gọi thì luôn cleartimeout
          this.#timeouts.forEach((timeout) => timeout && clearTimeout(timeout));
          this.#timeouts = [];
        }

        if (pausedAt) {
          // Trả luôn về this nếu bị dừng tạm thời, để logic tiếp theo ko hoạt động

          /* const { dismissTimeouts } = this;
        if (dismissTimeouts.size !== 0) {
          dismissTimeouts.forEach((value, key) => {
            this.clearFromRemoveQueue(key);
            return value;
          });
        } */

          return this;
        }

        // Logic dưới sẽ chạy nếu pauseAt không có giá trị
        const now = Date.now();

        const timeouts = this.#toasts.map((t) => {
          // Không set timout nếu duration toast là vô hạn.
          if (t.duration === Infinity) {
            return null;
          }

          // durationLeft là khoảng thời gian của toast được tính toán lại khi update settimeout mới (cộng dồn với cả thời gian dừng lại)
          const durationLeft =
            (t.duration || 0) + t.pauseDuration - (now - t.createdAt);

          if (durationLeft < 0) {
            this.dismiss(t.id);
            return null;
          }

          // Set khoảng thời gian chuẩn bị chạy hàm thủ tục để loại bỏ toast (dismiss)
          return setTimeout(() => this.dismiss(t.id), durationLeft);
        });

        this.#timeouts = timeouts;
        return this;
      };

      /* **************************************************************************** */

      #toastsPause = () => {
        // Thêm sự kiện pause duration cho toast

        this.#mainEl.onmouseenter = this.#startPause;
        this.#mainEl.onmouseleave = this.#endPause;
        // Thêm sự kiện pause duration cho toast

        return this;
      };

      #startPause = () => {
        const now = Date.now();
        this.#pausedAt = now;
        this.#updateDuration(this.#pausedAt);
        return this;
      };

      #endPause = () => {
        const now = Date.now();
        const diff = now - (this.#pausedAt || 0);

        this.#toasts = this.#toasts.map((toast) => ({
          ...toast,
          pauseDuration: toast.pauseDuration + diff,
        }));

        this.#pausedAt = undefined;

        this.#updateDuration(this.#pausedAt);
        return this;
      };

      /* **************************************************************************** */

      dismiss = (id) => {
        const toast = this.#getToast(id);

        if (toast) {
          toast.classList.add("top-eff-hidden");
          this.#addToRemoveQueue(id);
        }

        return this;
      };

      /* **************************************************************************** */

      #addToRemoveQueue = (id) => {
        if (this.#dismissTimeouts.has(id)) {
          return this;
        }

        const timeout = setTimeout(() => {
          this.#dismissTimeouts.delete(id);

          this.#removeToast(id);
        }, TOAST_EXPIRE_DISMISS_DELAY);

        this.#dismissTimeouts.set(id, timeout);

        return this;
      };

      /* **************************************************************************** */

      #clearFromRemoveQueue = (id) => {
        const timeout = this.#dismissTimeouts.get(id);
        if (timeout) {
          clearTimeout(timeout);
          this.#dismissTimeouts.delete(id);
        }
        return this;
      };

      /* **************************************************************************** */

      #removeToast = (id) => {
        const toastEl = this.#getToast(id);
        const toasts = this.#toasts;

        const toastRemaining = [];
        let isInsert = false;

        if (toastEl) {
          toasts.forEach((toast) => {
            if (toast.id !== id) {
              toastRemaining.push(toast);
            } else {
              isInsert = true;
            }
          });

          this.#toasts = toastRemaining;

          if (isInsert) {
            this.#insertToast();
          }

          this.#mainEl?.removeChild(toastEl);
        }

        return this;
      };
      /* ************ End Method ************ */
    }
    /* ======================================== end toast classes ======================================== */

    const toastBase = new Toast();
    // end create object toast

    // Tạo dữ liệu cho toast
    const createToast = (message, type, opts) => ({
      message,
      type,
      createdAt: Date.now(),
      pauseDuration: 0,
      ...opts,
      id: opts?.id || createId(),
    });
    // end Tạo dữ liệu cho toast

    const createHandler = (type) => (message, opts) => {
      let options = opts;

      const status = toastStatus[type];

      if (status) {
        options = {
          ...(opts || {}),
          icon: opts?.icon || status.icon,
          className: opts?.className || status.className,
        };
      }

      const toast = createToast(message, type, options);

      if (toastBase.checkToastExists(toast.id)) {
        toastBase.updateToast(toast);
      } else {
        toastBase.addToast(toast);
      }

      return toast.id;
    };

    const toast = (message, opts) => createHandler("blank")(message, opts);

    toast.success = createHandler("success");
    toast.error = createHandler("error");
    toast.info = createHandler("info");
    toast.warning = createHandler("warning");
    toast.loading = createHandler("loading");

    toast.close = (id) => toastBase.closeToast(id);

    toast.promise = (promise, msgs, opts) => {
      const id = toast.loading(msgs.loading, {
        duration: Infinity,
        ...opts,
        ...opts?.loading,
      });

      promise
        .then((p) => {
          toast.success(resolveValue(msgs.success, p), {
            id,
            duration: 3000,
            ...opts,
            ...opts?.success,
          });
          return p;
        })
        .catch((e) => {
          toast.error(resolveValue(msgs.error, e), {
            id,
            duration: 3000,
            ...opts,
            ...opts?.error,
          });
        });

      return promise;
    };

    toast.configs = (opts) => {
      toastBase.options = opts;
      return opts;
    };

    return toast;
  })();
});
