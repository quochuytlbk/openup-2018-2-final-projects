const APP_ROUTES = {
  AUTH: {
    STATE_NAME: 'auth',
    URL: '/auth',
    CHILDREN: {
      LOGIN: { STATE_NAME: 'auth.login', URL: '/login', FULL_URL: '/auth/login' },
      REGISTER: { STATE_NAME: 'auth.register', URL: '/register', FULL_URL: '/auth/register' }
    }
  },
  MAIN: {
    STATE_NAME: 'main',
    URL: '/main',
    CHILDREN: {
      ADD: { STATE_NAME: 'main.add', URL: '/to-dos/add', FULL_URL: '/main/to-dos/add' },
      FOCUS: { STATE_NAME: 'main.focus', URL: '/to-dos/focus', FULL_URL: '/main/to-dos/focus' },
      ORGANIZE: { STATE_NAME: 'main.organize', URL: '/to-dos', FULL_URL: '/main/to-dos' },
      TRACK: { STATE_NAME: 'main.track', URL: '/objectives', FULL_URL: '/main/objectives' }
    }
  }
};

export { APP_ROUTES };
