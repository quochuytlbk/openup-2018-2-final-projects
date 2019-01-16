
(() => {
  const socket = io();
  const games = io('/games');
  function winRate(win, draw, lose) {
    if(win === 0 && draw === 0 && lose === 0)
      return 0
    return win / (win + draw + lose) * 100
  }
  function calcLevel(exp) {
    if(exp < 100) return 1;
    if(exp < 200) return 2;
    if(exp < 400) return 3;
    if(exp < 700) return 4;
    if(exp < 1100) return 5;
    if(exp < 1600) return 6;
    if(exp < 2200) return 7;
    if(exp < 2800) return 8;
  }
  let user = {};
  const app = angular.module('index', []);
  app.controller('IndexController', ['$http', '$scope', function($http, $scope) {
    $http.get('/users')
      .then((res) => {
        $scope.user = res.data;
        user = $scope.user;
        user.winRate = winRate(user.userStats.win, user.userStats.draw, user.userStats.lose);
        user.calcLevel = calcLevel(user.userStats.exp);
        $scope.user.winRate = user.winRate;
        $scope.user.level = user.calcLevel;
        games.emit('connectUser', user._id)
      }, (res) => {
        console.log(res.data);
      });
  }]) 

  app.controller('ProfileController', ['$http', '$window', function($http, $window) {
    
  }])

  app.controller('SocialController', ['$scope', function($scope) {
    this.chatMessages = [];
    
    this.sidebar = true
    this.showSideBar = function() {
      this.sidebar = true
    }
    this.hideSideBar = function() {
      this.sidebar = false
    }

    this.chat = function() {
      this.username = user.username;
      const data = {
        username: this.username,
        message: this.message
      }
      socket.emit('chat message', data)
      this.message = '';
      return false;
    }

    socket.on('chat message', (dataChat) => {
      this.chatMessages.push(dataChat)
      $scope.$apply()
    })
  }])

  app.controller('GameController', ['$http', '$scope', function($http, $scope) {
    this.isDisplayHostBtn = true; // original: true
    this.isDisplayHost = false;
    this.isDisplayJoinZone = true; // original: true
    this.isDisplayGamePlay = false; // original: false
    this.isDisplayChatSamples = false;
    this.gamesId = null;
    this.caroRooms = [];
    this.drawCount = 3;
    this.openChatSamples = () => {
      this.isDisplayChatSamples = true;
    }
    this.closeChatSamples = () => {
      this.isDisplayChatSamples = false;
    }
    this.quickChat = (id) => {
      const data = {
        room: this.room,
        msg: this.chatSamples[id].message
      }
      games.emit('chatSample', data)
      this.isDisplayChatSamples = false;
      if (this.role === 'o') {
        this.hostChat = this.chatSamples[id].message;
        const element = document.querySelector('.hostChat');
        element.classList.add('boxChatSample');

        setTimeout(() => {
          element.classList.remove('boxChatSample');
          this.hostChat = null;
          $scope.$apply();
        }, 5000);
      }
      if (this.role === 'x') {
        this.joinChat = this.chatSamples[id].message;
        const element = document.querySelector('.joinChat');
        element.classList.add('boxChatSample');

        setTimeout(() => {
          element.classList.remove('boxChatSample');
          this.joinChat = null;
          $scope.$apply();
        }, 5000);
      }
    }

    games.on('chatSample', msg => {
      if (this.role === 'o') {
        this.joinChat = msg;
        const element = document.querySelector('.joinChat');
        element.classList.add('boxChatSample');
        $scope.$apply();
        setTimeout(() => {
          element.classList.remove('boxChatSample');
          this.joinChat = null;
          $scope.$apply();
        }, 5000);
      }
      if (this.role === 'x') {
        this.hostChat = msg;
        const element = document.querySelector('.hostChat');
        element.classList.add('boxChatSample');
        $scope.$apply();
        setTimeout(() => {
          element.classList.remove('boxChatSample');
          this.hostChat = null;
          $scope.$apply();
        }, 5000);
      }
    })

    this.chatSamples = [
      {
        id: 0,
        message: 'Chịu thua đi cưng',
      },
      {
        id: 1,
        message: 'Lie back and lose!',
      },
      {
        id: 2,
        message: 'Coi chừng trúng thính',
      },
      {
        id: 3,
        message: 'I never accept defeat',
      },
      {
        id: 4,
        message: 'Chiếm lấy em đi',
      },
      {
        id: 5,
        message: 'OK! You got me',
      },
      {
        id: 6,
        message: 'Đánh nghiêm túc đi',
      },
      {
        id: 7,
        message: 'Don\'t put your luck',
      },
      {
        id: 8,
        message: 'Tha em đi anh',
      },
      {
        id: 9,
        message: 'Spare no one'
      }
    ]

    this.isDisplayCfmSubmission = false;
    this.submission = () => {
      this.isDisplayCfmSubmission = true;

      setTimeout(() => {
        this.isDisplayCfmSubmission = false;
        $scope.$apply();
      }, 10000);
    }
    this.acceptedLose = () => {
      this.lose();
      games.emit('submission', this.room)
    }

    this.unacceptedLose = () => {
      this.isDisplayCfmSubmission = false;
      $scope.$apply();
    }

    games.on('submission', () => {
      this.win();
    })

    this.drawGame = () => {
      games.emit('drawGame', this.room);
      this.drawCount--
      if(this.drawCount === 0) {
        element = document.querySelector('.drawGame');
        element.classList.add('disabled')
      }
    }

    games.on('drawGame', () => {
      const element = document.querySelector('.notiDraw');
      element.classList.add('notiDrawShow');

      setTimeout(() => {
        element.classList.remove('notiDrawShow');
      }, 10000);
    })
    this.acceptedDraw  = () => {
      const element = document.querySelector('.notiDraw');
      element.classList.remove('notiDrawShow');
      games.emit('acceptedDraw', this.room)
      this.draw();
    }
    this.unacceptedDraw = () => {
      const element = document.querySelector('.notiDraw');
      element.classList.remove('notiDrawShow');
    }
    games.on('acceptedDraw', () => {
      this.draw();
    })

    games.on('connect', () => {
      this.gamesId = games.id;
    });

    this.host = () => {
      games.emit('hostRoom', user._id)
    }
    games.on('hostRoom', () => {
      this.isDisplayHost = true;
      this.isDisplayHostBtn = false;
      this.isDisplayJoinZone = false;
      $scope.$apply();
    })
    this.leave = () => {
      games.emit('leaveRoom', user._id)
    }
    games.on('leaveRoom', () => {
      this.isDisplayHostBtn = true;
      this.isDisplayHost = false;
      this.isDisplayJoinZone = true;
      $scope.$apply();
    })

    games.on('newRoom', (caroRooms) => {
      const rooms = []
      for (let id of caroRooms) {
        $http.get(`/users/${id}`)
          .then((res) => {
            res.data.level = calcLevel(res.data.userStats.exp);
            rooms.push(res.data)
          })
      }
      this.caroRooms.length = 0;
      this.caroRooms = rooms
      
      $scope.$apply(); 
    })

    this.join = (roomId) => {
      const data = {
        roomId: roomId,
        joinId: user._id
      }
      games.emit('joinRoom', data)
    }
    this.room = null
    games.on('startGame', gameData => {
      this.opponentId = (gameData.hostId === user._id)? gameData.joinId : gameData.hostId;
      this.room = gameData.hostId; //need to back null when end game
      this.isDisplayHostBtn = false;
      this.isDisplayHost = false;
      this.isDisplayJoinZone = false;
      this.isDisplayGamePlay = true;
      
      $http.get(`/users/${gameData.hostId}`)
        .then((res) => {
          this.host = res.data
          this.host.level = calcLevel(res.data.userStats.exp)
          this.host.winRate = winRate(res.data.userStats.win,res.data.userStats.draw,res.data.userStats.lose)
        })
      $http.get(`/users/${gameData.joinId}`)
        .then((res) => {
          this.join = res.data
          this.join.level = calcLevel(res.data.userStats.exp)
          this.join.winRate = winRate(res.data.userStats.win,res.data.userStats.draw,res.data.userStats.lose)
        })  
      $scope.$apply();
    })
    
    this.turn = null;//need to back null when end game
    this.role = null;//need to back null when end game
    this.opponentRole = null //need to back null when end game
    this.caroArray = new Array(15)
    for (let i = 0; i < 15; i++)
      this.caroArray[i] = new Array(15)
    this.timer = 30;
    games.on('yourTurn', data => {
      this.turn = data.turn;
      this.role = data.role;
      this.opponentRole = (this.role === 'x')? 'o':'x';
      const hoverElements = document.querySelectorAll('.box');
      for (let element of hoverElements)
        element.classList.add(`${this.role}Sign`)
    })

    games.on('opponentTurn', data => {
      this.turn = data.turn;
      this.role = data.role;
      this.opponentRole = (this.role === 'x')? 'o':'x';
      const hoverElements = document.querySelectorAll('.box');
      for (let element of hoverElements)
        element.classList.add(`${this.role}Sign`)
      const elements = document.querySelectorAll('.box');
      for (let element of elements)
        element.classList.add('disabled')
    })

    this.choose = (x, y) => {
      const elements = document.querySelectorAll(`div[x="${x}"]`)
      const element = elements[y];
      element.classList.add(this.role);
      element.setAttribute("value", "1")
      const disabledElements = document.querySelectorAll('.box');
      for (let element of disabledElements)
        element.classList.add('disabled')
      this.turn = false;
      this.caroArray[x][y] = 1;
      this.checkYourTurn(x,y)
      games.emit('nextTurn', {x : x, y: y, room: this.room})
    }
  
    games.on('nextTurn', data => {
      this.turn = true;
      this.caroArray[data.x][data.y] = -1;
      const opponentElements = document.querySelectorAll(`div[x="${data.x}"]`)
      const element = opponentElements[data.y];
      element.classList.add(this.opponentRole);
      element.setAttribute("value", "-1");
      this.checkOpponentTurn(data.x, data.y)
      const elements = document.querySelectorAll(`.box[value="0"]`);
      for (let element of elements)
        element.classList.remove('disabled')
    })

    this.win = () => {
      games.emit('leaveGame', this.room);
      $http.get(`/users/win/${user._id}`)
        .then((res) => {
          const notiCongrats = document.querySelector('.notiGame');
          notiCongrats.classList.add('notiCongrats');
          setTimeout(() => {
            window.location.href = res.data.redirect;
          }, 3000);
        })
    }

    this.lose = () => {
      games.emit('leaveGame', this.room);
      $http.get(`/users/lose/${user._id}`)
        .then((res) => {
          const notiLose = document.querySelector('.notiGame');;
          notiLose.classList.add('notiLose')
          setTimeout(() => {
            window.location.href = res.data.redirect;
          }, 3000);
        })
    }
    this.draw = () => {
      games.emit('leaveGame', this.room);
      $http.get(`/users/draw/${user._id}`)
        .then((res) => {
          const notiLose = document.querySelector('.notiGame');;
          notiLose.classList.add('notiDrawGame')
          setTimeout(() => {
            window.location.href = res.data.redirect;
          }, 3000);
        })
    }
    this.checkOpponentTurn = (x, y) => {
      const a = this.caroArray;
      
      try {
        // Round 1
        if(a[x-4][y-4] + a[x-3][y-3] + a[x-2][y-2] + a[x-1][y-1] + a[x][y] === -5) {
          if(x + 1 > 14 || x - 5 < 0 || y + 1 > 14 || y - 5 < 0)
            this.lose();
          if(a[x-5][y-5] === undefined || a[x+1][y+1] === undefined)
            this.lose();
        }

        if(a[x-4][y] + a[x-3][y] + a[x-2][y] + a[x-1][y] + a[x][y] === -5) {
          if(x + 1 > 14 || x - 5 < 0)
            this.lose();
          if(a[x-5][y] === undefined || a[x+1][y] === undefined)
            this.lose();  
        }

        if(a[x-4][y+4] + a[x-3][y+3] + a[x-2][y+2] + a[x-1][y+1] + a[x][y] === -5) {
          if(x - 5 < 0 || y + 5 > 14 || x + 1 > 14 || y - 1 < 0)
            this.lose();
          if(a[x-5][y+5] === undefined || a[x+1][y-1] === undefined)
            this.lose();  
        }

        if(a[x][y+4] + a[x][y+3] + a[x][y+2] + a[x][y+1] + a[x][y] === -5) {
          if(y + 5 > 14 || y - 1 < 0)
            this.lose();
          if(a[x][y+5] === undefined || a[x][y-1] === undefined)
            this.lose();
        }

        if(a[x+4][y+4] + a[x+3][y+3] + a[x+2][y+2] + a[x+1][y+1] + a[x][y] === -5) {
          if(x + 5 > 14 || y + 5 > 14 || x - 1 < 0 || y - 1 < 0)
            this.lose();
          if(a[x+5][y+5] === undefined || a[x-1][y-1] === undefined)
            this.lose();
        }

        if(a[x+4][y] + a[x+3][y] + a[x+2][y] + a[x+1][y] + a[x][y] === -5) {
          if(x + 5 > 14 || x - 1 < 0)
            this.lose();
          if(a[x+5][y] === undefined || a[x-1][y] === undefined)
            this.lose();
        }
        if(a[x+4][y-4] + a[x+3][y-3] + a[x+2][y-2] + a[x+1][y-1] + a[x][y] === -5) {
          if(x + 5 > 14 || y - 5 < 0 || x - 1 < 0 || y + 1 > 14)
            this.lose();
          if(a[x+5][y-5] === undefined || a[x-1][y+1] === undefined)
            this.lose();
        }

        if(a[x][y-4] + a[x][y-3] + a[x][y-2] + a[x][y-1] + a[x][y] === -5) {
          if(y - 5 < 0 || y + 1 > 14)
            this.lose();
          if(a[x][y-5] === undefined || a[x][y+1] === undefined)
            this.lose();
        }
        // Round 2
        if(a[x-3][y-3] + a[x-2][y-2] + a[x-1][y-1] + a[x][y] + a[x+1][y+1] === -5) {
          if(x + 2 > 14 || x - 4 < 0 || y + 2 > 14 || y - 4 < 0)
            this.lose();
          if(a[x-4][y-4] === undefined || a[x+2][y+2] === undefined)
            this.lose();
        }
        if(a[x-3][y] + a[x-2][y] + a[x-1][y] + a[x][y] + a[x+1][y] === -5) {
          if(x + 2 > 14 || x - 4 < 0)
            this.lose();
          if(a[x-4][y] === undefined || a[x+2][y] === undefined)
            this.lose();
        }
        if(a[x-3][y+3] + a[x-2][y+2] + a[x-1][y+1] + a[x][y] + a[x+1][y-1] === -5) {
          if(x - 4 < 0 || y + 4 > 14 || x + 2 > 14 || y - 2 < 0)
            this.lose();
          if(a[x-4][y+4] === undefined || a[x+2][y-2] === undefined)
            this.lose();
        }
        if(a[x][y+3] + a[x][y+2] + a[x][y+1] + a[x][y] + a[x][y-1] === -5) {
          if(y + 4 > 14 || y - 2 < 0)
            this.lose();
          if(a[x][y+4] === undefined || a[x][y-2] === undefined)
            this.lose();
        }

        if(a[x+3][y+3] + a[x+2][y+2] + a[x+1][y+1] + a[x][y] + a[x-1][y-1] === -5) {
          if(x + 4 > 14 || y + 4 > 14 || x - 2 < 0 || y - 2 < 0)
            this.lose();
          if(a[x+4][y+4] === undefined || a[x-2][y-2] === undefined)
            this.lose();
        }
        if(a[x+3][y] + a[x+2][y] + a[x+1][y] + a[x][y] + a[x-1][y] === -5) {
          if(x + 4 > 14 || x - 2 < 0)
            this.lose();
          if(a[x+4][y] === undefined || a[x-2][y] === undefined)
            this.lose();
        }
        if(a[x+3][y-3] + a[x+2][y-2] + a[x+1][y-1] + a[x][y] + a[x-1][y+1] === -5) {
          if(x + 4 > 14 || y - 4 < 0 || x - 2 < 0 || y + 2 > 14)
            this.lose();
          if(a[x+4][y-4] === undefined || a[x-2][y+2] === undefined)
            this.lose();
        }
        if(a[x][y-3] + a[x][y-2] + a[x][y-1] + a[x][y] + a[x][y+1] === -5) {
          if(y - 5 < 0 || y + 1 > 14)
            this.lose();
          if(a[x][y-5] === undefined || a[x][y+1] === undefined)
            this.lose();
        }

        //Round 3
        if([x-2][y-2] + a[x-1][y-1] + a[x][y] + a[x+1][y+1] + a[x+2][y+2] === -5) {
          if(x + 3 > 14 || x - 3 < 0 || y + 3 > 14 || y - 3 < 0)
            this.lose();
          if(a[x-3][y-3] === undefined || a[x+3][y+3] === undefined)
            this.lose();
        }
        if(a[x-2][y] + a[x-1][y] + a[x][y] + a[x+1][y] + a[x+2][y] === -5) {
          if(x + 3 > 14 || x - 3 < 0)
            this.lose();
          if(a[x-3][y] === undefined || a[x+3][y] === undefined)
            this.lose();
        }
        if(a[x-2][y+2] + a[x-1][y+1] + a[x][y] + a[x+1][y-1] + a[x+2][y-2] === -5) {
          if(x - 3 < 0 || y + 3 > 14 || x + 3 > 14 || y - 3 < 0)
            this.lose();
          if(a[x-3][y+3] === undefined || a[x+3][y-3] === undefined)
            this.lose();
        }
        if(a[x][y+2] + a[x][y+1] + a[x][y] + a[x][y-1] + a[x][y-2] === -5) {
          if(y + 3 > 14 || y - 3 < 0)
            this.lose();
          if(a[x][y+3] === undefined || a[x][y-3] === undefined)
            this.lose();
        }
      } catch (error) {
        console.error();
      }
    }
    this.checkYourTurn = (x, y) => {
      const a = this.caroArray;
      
      try {
        // Round 1
        if(a[x-4][y-4] + a[x-3][y-3] + a[x-2][y-2] + a[x-1][y-1] + a[x][y] === 5) {
          if(x + 1 > 14 || x - 5 < 0 || y + 1 > 14 || y - 5 < 0)
            this.win();
          if(a[x-5][y-5] === undefined || a[x+1][y+1] === undefined)
            this.win();
        }

        if(a[x-4][y] + a[x-3][y] + a[x-2][y] + a[x-1][y] + a[x][y] === 5) {
          if(x + 1 > 14 || x - 5 < 0)
            this.win();
          if(a[x-5][y] === undefined || a[x+1][y] === undefined)
            this.win();  
        }

        if(a[x-4][y+4] + a[x-3][y+3] + a[x-2][y+2] + a[x-1][y+1] + a[x][y] === 5) {
          if(x - 5 < 0 || y + 5 > 14 || x + 1 > 14 || y - 1 < 0)
            this.win();
          if(a[x-5][y+5] === undefined || a[x+1][y-1] === undefined)
            this.win();  
        }

        if(a[x][y+4] + a[x][y+3] + a[x][y+2] + a[x][y+1] + a[x][y] === 5) {
          if(y + 5 > 14 || y - 1 < 0)
            this.win();
          if(a[x][y+5] === undefined || a[x][y-1] === undefined)
            this.win();
        }

        if(a[x+4][y+4] + a[x+3][y+3] + a[x+2][y+2] + a[x+1][y+1] + a[x][y] === 5) {
          if(x + 5 > 14 || y + 5 > 14 || x - 1 < 0 || y - 1 < 0)
            this.win();
          if(a[x+5][y+5] === undefined || a[x-1][y-1] === undefined)
            this.win();
        }

        if(a[x+4][y] + a[x+3][y] + a[x+2][y] + a[x+1][y] + a[x][y] === 5) {
          if(x + 5 > 14 || x - 1 < 0)
            this.win();
          if(a[x+5][y] === undefined || a[x-1][y] === undefined)
            this.win();
        }
        if(a[x+4][y-4] + a[x+3][y-3] + a[x+2][y-2] + a[x+1][y-1] + a[x][y] === 5) {
          if(x + 5 > 14 || y - 5 < 0 || x - 1 < 0 || y + 1 > 14)
            this.win();
          if(a[x+5][y-5] === undefined || a[x-1][y+1] === undefined)
            this.win();
        }

        if(a[x][y-4] + a[x][y-3] + a[x][y-2] + a[x][y-1] + a[x][y] === 5) {
          if(y - 5 < 0 || y + 1 > 14)
            this.win();
          if(a[x][y-5] === undefined || a[x][y+1] === undefined)
            this.win();
        }
        // Round 2
        if(a[x-3][y-3] + a[x-2][y-2] + a[x-1][y-1] + a[x][y] + a[x+1][y+1] === 5) {
          if(x + 2 > 14 || x - 4 < 0 || y + 2 > 14 || y - 4 < 0)
            this.win();
          if(a[x-4][y-4] === undefined || a[x+2][y+2] === undefined)
            this.win();
        }
        if(a[x-3][y] + a[x-2][y] + a[x-1][y] + a[x][y] + a[x+1][y] === 5) {
          if(x + 2 > 14 || x - 4 < 0)
            this.win();
          if(a[x-4][y] === undefined || a[x+2][y] === undefined)
            this.win();
        }
        if(a[x-3][y+3] + a[x-2][y+2] + a[x-1][y+1] + a[x][y] + a[x+1][y-1] === 5) {
          if(x - 4 < 0 || y + 4 > 14 || x + 2 > 14 || y - 2 < 0)
            this.win();
          if(a[x-4][y+4] === undefined || a[x+2][y-2] === undefined)
            this.win();
        }
        if(a[x][y+3] + a[x][y+2] + a[x][y+1] + a[x][y] + a[x][y-1] === 5) {
          if(y + 4 > 14 || y - 2 < 0)
            this.win();
          if(a[x][y+4] === undefined || a[x][y-2] === undefined)
            this.win();
        }

        if(a[x+3][y+3] + a[x+2][y+2] + a[x+1][y+1] + a[x][y] + a[x-1][y-1] === 5) {
          if(x + 4 > 14 || y + 4 > 14 || x - 2 < 0 || y - 2 < 0)
            this.win();
          if(a[x+4][y+4] === undefined || a[x-2][y-2] === undefined)
            this.win();
        }
        if(a[x+3][y] + a[x+2][y] + a[x+1][y] + a[x][y] + a[x-1][y] === 5) {
          if(x + 4 > 14 || x - 2 < 0)
            this.win();
          if(a[x+4][y] === undefined || a[x-2][y] === undefined)
            this.win();
        }
        if(a[x+3][y-3] + a[x+2][y-2] + a[x+1][y-1] + a[x][y] + a[x-1][y+1] === 5) {
          if(x + 4 > 14 || y - 4 < 0 || x - 2 < 0 || y + 2 > 14)
            this.win();
          if(a[x+4][y-4] === undefined || a[x-2][y+2] === undefined)
            this.win();
        }
        if(a[x][y-3] + a[x][y-2] + a[x][y-1] + a[x][y] + a[x][y+1] === 5) {
          if(y - 5 < 0 || y + 1 > 14)
            this.win();
          if(a[x][y-5] === undefined || a[x][y+1] === undefined)
            this.win();
        }

        //Round 3
        if([x-2][y-2] + a[x-1][y-1] + a[x][y] + a[x+1][y+1] + a[x+2][y+2] === 5) {
          if(x + 3 > 14 || x - 3 < 0 || y + 3 > 14 || y - 3 < 0)
            this.win();
          if(a[x-3][y-3] === undefined || a[x+3][y+3] === undefined)
            this.win();
        }
        if(a[x-2][y] + a[x-1][y] + a[x][y] + a[x+1][y] + a[x+2][y] === 5) {
          if(x + 3 > 14 || x - 3 < 0)
            this.win();
          if(a[x-3][y] === undefined || a[x+3][y] === undefined)
            this.win();
        }
        if(a[x-2][y+2] + a[x-1][y+1] + a[x][y] + a[x+1][y-1] + a[x+2][y-2] === 5) {
          if(x - 3 < 0 || y + 3 > 14 || x + 3 > 14 || y - 3 < 0)
            this.win();
          if(a[x-3][y+3] === undefined || a[x+3][y-3] === undefined)
            this.win();
        }
        if(a[x][y+2] + a[x][y+1] + a[x][y] + a[x][y-1] + a[x][y-2] === 5) {
          if(y + 3 > 14 || y - 3 < 0)
            this.win();
          if(a[x][y+3] === undefined || a[x][y-3] === undefined)
            this.win();
        }
      } catch (error) {
        console.error();
      }
    }
  }])

  app.directive('messageLine', () => {
    return {
      restrict: 'E',
      templateUrl: '/directive/message-lines.html',
    }
  })

  app.directive('hostZone', () => {
    return {
      restrict: 'E',
      templateUrl: '/directive/host-zone.html'
    }
  })
  app.directive('roomList', () => {
    return {
      restrict: 'E',
      templateUrl: '/directive/room-lists.html'
    }
  })

  app.directive('gamePlay', () => {
    return {
      restrict: 'E',
      templateUrl: '/directive/game-play.html'
    }
  }) 

})();