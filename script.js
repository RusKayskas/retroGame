//игрок 1 создаем классы и структуру  этап 1
class player {
  //этап 4 делаем игрока делаем доступ к game что бы оттуда пользоваться аршументами
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    //выравниваем по центру игрока
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    //движение игрока
    this.speed = 5;

  }
  //метод отрисовки
  draw(context) {
    //сначала координаты потом ширина высота
    context.fillRect(this.x, this.y, this.width, this.height);
    
  }

  //для отображения движения игрока и тд
  update() {
    if (this.game.keys.indexOf('a') > -1) this.x -= this.speed;
    if (this.game.keys.indexOf('d') > -1) this.x += this.speed;
    if (this.game.keys.indexOf('A') > -1) this.x -= this.speed;
    if (this.game.keys.indexOf('D') > -1) this.x += this.speed;
    if (this.game.keys.indexOf('s') > -1) this.y += this.speed;
    if (this.game.keys.indexOf('S') > -1) this.y += this.speed;
    if (this.game.keys.indexOf('w') > -1) this.y -= this.speed;
    if (this.game.keys.indexOf('W') > -1) this.y -= this.speed;
    // делаем что бы игрок не уходил за пределы игровой области
    if (this.x < 0) this.x = 0;
    else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width
    if (this.y < this.game.height / 2) this.y = this.game.height / 2;
    else if (this.y > this.game.height - this.height ) this.y = this.game.height - this.height;
  }
  //этам 7 
  shoot() {
    const projectile = this.game.getProjectTile();
    if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
  }
}

//тут создание снарядов и создание сетки и тд 
//ЭТАП 7 стрельба
class Projectile {
  constructor() {
    //lazer
    this.width = 10;
    this.height = 20; 
    this.x = 0;
    this.y = 0;
    this.speed = 20;
    //показываем сняряд или нет
    this.free = true;
  }

  draw(context) {
    if (!this.free) {
      context.fillRect(this.x, this.y, this.width, this.height)
    }
  }
  update() {
    if (!this.free) {
      this.y -= this.speed;
      //обновляем что бы было 10 пуль но они стирали свое значение после того как улетают за экран
      if (this.y < -this.height) this.reset();
    }
  }
  start(x , y) {
    this.x = x - this.width * 0.5;
    this.y = y;
    this.free = false;
  }
  //убираем обьект когда он не нужен
  reset() {
    this.free = true;
  }
}

//этап 8
class Enemy {
  constructor(game) {
    this.game = game;
    this.width;
    this.height;
    this.x;
    this.y;
  }
  draw(context) {
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
  update() {

  }
}
//перемещение и смещение врагов к игроку
class Wave {
  constructor(game) {
    //берем colums и тд из переменной game
    this.game = game;
    this.width = this.game.columns * this.game.enemySize;
    this.height = this.game.rows * this.game.enemySize;
    this.x = 0;
    this.y = 0;
    this.speedX = 3;
    this.speedY = 0;
  }
  render(context) {
    this.speedY = 0;
    context.strokeRect(this.x, this.y, this.width, this.height);
    // this.x += this.speedX;
    //что бы не уходило за экран 
    if (this.x < 0 || this.x > this.game.width - this.width) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

//управление всей игрой
class Game {
  //2 этап конструктор
  constructor(canvas) {
    //записываем в качестве аргумента и преобразуем в свойство
    //этап 3 описаываем саму игру базовые настройки
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    //управление игроком этап 6
    this.keys = []
    //этап 4 создаем тут player
    this.player = new player(this);


    //лимит 10 снярядов этап 7
    this.projectTilesPool = [];
    this.numberOfProjecTiles = 10;

    //вызываем методы
    this.createProjectTiles();
    console.log(this.projectTilesPool);


    //этап 8 делаем сетку для врагов сколько их должно быть в пачке и тд 
    this.columns = 3;
    this.rows = 3;
    this.enemySize  = 60;

    this.waves = [];
    this.waves.push(new Wave(this));

    //управление игроком этап 6 
    window.addEventListener('keydown', (event) => {
      //метод что бы в массив не добавлялись одинаковые значения каждый раз при нажатии
      if (this.keys.indexOf(event.key) === -1) this.keys.push(event.key);
      //стрельба этап 7
      if (event.key === ' ') this.player.shoot(); //далее надо нарисовать это все и идем в render
    })

    //удаляем ключ и массива когда отпускаем кноппку
    window.addEventListener('keyup', (event) => {
      const index = this.keys.indexOf(event.key)
      //это выражегте означает если ключ есть внутри массива удаляем его 
      if (index > -1) this.keys.splice(index, 1);
    })

  }
  //метод рендер для отрисовки
  render(context) {
    // console.log('render', this.width, this.height);
    ////этап 4 отрисовываем игрока
    this.player.draw(context);
    //вызываем метод для движения игрока //этап 5 анимация
    this.player.update();

    //выстрел этап 7
    this.projectTilesPool.forEach(projectile => {
      projectile.update();
      projectile.draw(context);
    })

    //этап 8
    this.waves.forEach(wave => {
      wave.render(context);
    })
  }
  
  //этап 7 create projectiles object pool
  createProjectTiles() {
    for (let i = 0; i < this.numberOfProjecTiles; i++) {
      this.projectTilesPool.push(new Projectile());
    }
  }
  //get free projectile object from the pool
  getProjectTile() {
    for (let i = 0; i < this.projectTilesPool.length; i++) {
      if(this.projectTilesPool[i].free) return this.projectTilesPool[i];
    }
  }
}

window.addEventListener('load', function() {
  //обьявляем переменные для работы в canvas этап 1
  const canvas = document.getElementById('canvas_1');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 800;
  
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 6;

  //как бы запускаем класс этап 3 и передаем canvas как аргумент
  const game = new Game(canvas);
  

  //движение анимация функция что бы игрок и тд двигались
  function animate() {
    //этап 5 анимация тут мы чистим кадры что бы показать движение
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //вызываем метод свой в game в render передаем ctx что бы отприсовывать и тд
    game.render(ctx);
    //функция для отрисовки анимации //этап 5 анимация
    window.requestAnimationFrame(animate);
  }

  animate();
})