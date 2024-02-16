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
    this.x += this.speed;
  }
}

//тут создание снарядов и создание сетки и тд
class Projectile {
  
}

class Enemy {

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

    //управление игроком этап 6 
    window.addEventListener('keydown', (event) => {
      //метод что бы в массив не добавлялись одинаковые значения каждый раз при нажатии
      if (this.keys.indexOf(event.key) === -1) this.keys.push(event.key);
      console.log(this.keys);
    })

    //удаляем ключ и массива когда отпускаем кноппку
    window.addEventListener('keyup', (event) => {
      const index = this.keys.indexOf(event.key)
      //это выражегте означает если ключ есть внутри массива удаляем его 
      if (index > -1)
      console.log(this.keys);
    })

  }
  //метод рендер для отрисовки
  render(context) {
    // console.log('render', this.width, this.height);
    ////этап 4 отрисовываем игрока
    this.player.draw(context);
    //вызываем метод для движения игрока //этап 5 анимация
    this.player.update();
  }
}

window.addEventListener('load', function() {
  //обьявляем переменные для работы в canvas этап 1
  console.log('1');
  const canvas = document.getElementById('canvas_1');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 800;
  

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