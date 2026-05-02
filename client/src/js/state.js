export const state = {
  lang: localStorage.getItem('app_lang') || 'en',
  user: {
    name: localStorage.getItem('google_user_name') || '',
    email: localStorage.getItem('google_user_email') || '',
    picture: localStorage.getItem('google_user_picture') || '',
    isGuest: localStorage.getItem('is_guest') === 'true'
  },
  isBusy: false,
  historyLog: [],
  
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  },
  notify() {
    this.listeners.forEach(fn => fn(this));
  },
  
  setLang(l) {
    this.lang = l;
    localStorage.setItem('app_lang', l);
    this.notify();
  },
  setBusy(b) {
    this.isBusy = b;
    this.notify();
  },
  updateHistory(msg) {
    this.historyLog.push(msg);
  }
};
